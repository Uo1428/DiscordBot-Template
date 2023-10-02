import { Client, Collection, GatewayIntentBits as GIB, Partials, Routes, REST, EmbedBuilder } from 'discord.js';
import fs from 'fs/promises';
import logger from './utils/logger.mjs';
import { mongoose } from 'mongoose'

class Bot extends Client {
    constructor() {
        super({
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false,
            },
            intents: [
                GIB.Guilds,
                GIB.GuildMessages,
                GIB.GuildPresences,
                GIB.GuildMessageReactions,
                GIB.DirectMessages,
                GIB.MessageContent
            ],
            partials: [
                Partials.User,
                Partials.Message,
                Partials.Channel,
                Partials.Reaction,
                Partials.GuildMember
            ]
        });
    }

    async start(config, embed, emotes) {

        this.config = config;
        this.embed = embed;
        this.emotes = emotes;
        this.Embed = (footer = true) => {
            let embed = new EmbedBuilder();
            if (!embed.color) embed.setColor(this.embed.color);
            if (footer) embed.setFooter({
                text: this.embed.footertext,
                iconURL: this.embed.footericon
            });
            return embed;
        };

        ["events", "aliases", "buttons", "commands", "cooldowns", "categories", "slashCommands"].forEach(i => this[i] = new Collection());


        await this.login(config.TOKEN);

        if (!config.CLIENT_ID) this.config.CLIENT_ID = this.application.id;

        if(config.MONGO_DB){       
            mongoose.set('strictQuery', true);

        mongoose.connect(config.MONGO_DB, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        })
        .then(() => logger("Connected to MongoDB".bold))
        .catch((err) => console.error("MongoDB ❌\n", err));
    }
    }

    async loadEvents() {
        await fs.readdir(`./src/events`).then((i) => {
            i.filter((file) => file.endsWith('.mjs')).forEach(async (event) => {
                const { default: clientEvent } = await import(`./events/${event}`);
                if (clientEvent.ignore || !clientEvent.name || !clientEvent.run) return;

                this.events.set(clientEvent.name, clientEvent);
                if (clientEvent.customEvent) return clientEvent.run(this);

                if (clientEvent.runOnce) this.once(clientEvent.name, (...args) => clientEvent.run(this, ...args));
                else this.on(clientEvent.name, (...args) => clientEvent.run(this, ...args));
            });
        })
    }

    async loadCommands() {

        const TOKEN = this.config.TOKEN;
        const CLIENT_ID = this.config.CLIENT_ID;
        const rest = new REST({ version: '9' }).setToken(TOKEN);

        let slashCommands = [];

        await fs.readdir("./Commands/Slash").then(async i => {
            i.forEach(async dir => {
                await fs.readdir(`./Commands/Slash/${dir}/`).then(async files => {
                    files.filter(file => file.endsWith('.mjs'));
                    for (const file of files) {
                        const { default: slashCommand } = await import("../Commands/Slash/" + dir + "/" + file);
                        if (slashCommand.ignore) return;
                        slashCommands.push(slashCommand.data);
                        if (slashCommand.data.name) this.slashCommands.set(slashCommand.data.name, slashCommand);
                        else throw `Command Error: ${slashCommand.name || file.split('.mjs')[0] || "Missing Name"} - ${this.user.username}`
                    }
                })
            })
        });

        this.fatchedCommands = await this.application.commands.fetch();

        // ======== Message Commands

        await fs.readdir("./Commands/Prefix").then(i => {
            i.forEach(async dir => {
                await fs.readdir(`./Commands/Prefix/${dir}/`).then(async files => {
                    files.filter(file => file.endsWith('.mjs'));
                    for (const file of files) {
                        const { default: prefixCommand } = await import("../Commands/Prefix/" + dir + "/" + file);
                        if (prefixCommand.ignore) return;
                        if (prefixCommand.name) {
                            let i;
                            if (Array.isArray(prefixCommand.name)) {
                                prefixCommand.name.forEach(name => {
                                    const clonedCommand = JSON.parse(JSON.stringify(prefixCommand));
                                    this.commands.set(name, clonedCommand);
                                    clonedCommand.name = name;
                                    clonedCommand.description = clonedCommand.description.replace("{commandName}", name);
                                    clonedCommand.run = prefixCommand.run;
                                })
                            } else this.commands.set(prefixCommand.name, prefixCommand);
                        } else throw `Prefix Command Error: ${prefixCommand.name || file.split('.mjs')[0] || "Missing Name"} - ${this.user.username}`
                        if (prefixCommand.aliases && Array.isArray(prefixCommand.aliases)) prefixCommand.aliases.forEach(messageCommandAlias => {

                            this.aliases.set(prefixCommand, prefixCommand.name);
                        });
                    }
                })
            })

        });

        await rest.put(
            Routes.applicationCommands(CLIENT_ID), {
            body: slashCommands
        }).then(() => logger(`Loaded Slash Commands for ${this.user.username}`.bold));
        logger(`Loaded Prefix Commands for ${this.user.username}`.bold)

    }

}

export default Bot;
