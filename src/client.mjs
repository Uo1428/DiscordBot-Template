import { Client, Collection, GatewayIntentBits as GIB, Partials, Routes, REST, EmbedBuilder } from 'discord.js';
import fs from 'fs';
import logger from './utils/logger.mjs';
class client extends Client {
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
        this.Embed = () => new EmbedBuilder;

        ["events", "aliases", "buttons", "commands", "cooldowns", "categories", "slashCommands"].forEach(i => this[i] = new Collection());


        await this.login(config.TOKEN);

        if (!config.CLIENT_ID) this.config.CLIENT_ID = this.application.id;
    }

    async loadEvents() {
        fs.readdirSync(`./src/events`).filter((file) => file.endsWith('.mjs')).forEach(async (event) => {
            const { default: clientEvent } = await import(`./events/${event}`);
            if (clientEvent.ignore || !clientEvent.name || !clientEvent.run) return;

            this.events.set(clientEvent.name, clientEvent);
            if (clientEvent.customEvent) return clientEvent.run(this);

            if (clientEvent.runOnce) this.once(clientEvent.name, (...args) => clientEvent.run(this, ...args));
            else this.on(clientEvent.name, (...args) => clientEvent.run(this, ...args));
        });
    }

    async loadCommands() {

        const TOKEN = this.config.TOKEN;
        const CLIENT_ID = this.config.CLIENT_ID;
        const rest = new REST({ version: '10' }).setToken(TOKEN);

        let slashCommands = [];

        fs.readdirSync("./Commands/Slash").forEach(async dir => {
            const files = fs.readdirSync(`./Commands/Slash/${dir}/`).filter(file => file.endsWith('.mjs'));
            for (const file of files) {
                const { default: slashCommand } = await import("../Commands/Slash/" + dir + "/" + file);
                if (slashCommand.ignore) return;

                slashCommands.push(slashCommand.data);

                if (slashCommand.data.name) this.slashCommands.set(slashCommand.data.name, slashCommand);
                else throw `Command Error: ${slashCommand.name || file.split('.mjs')[0] || "Missing Name"} - ${this.user.username}`
            }

            await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                body: slashCommands
            }).then(() => logger(`Loaded Slash Commands for ${this.user.username}`.bold))

        });

        this.fatchedCommands = await this.application.commands.fetch();

        // ======== Message Commands

        fs.readdirSync("./Commands/Prefix").forEach(async dir => {
            const files = fs.readdirSync(`./Commands/Prefix/${dir}/`).filter(file => file.endsWith('.mjs'));
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

            logger(`Loaded Prefix Commands for ${this.user.username}`.bold)
        });

    }

}

export default client;
