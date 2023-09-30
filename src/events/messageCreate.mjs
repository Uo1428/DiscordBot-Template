import { EmbedBuilder, Collection, PermissionsBitField } from 'discord.js'
import { msg as CoolDown } from '../functions/onCoolDown.mjs'
import { msg as ErrorHandler } from '../functions/cmdError.mjs'

export default {
    name: "messageCreate",
    run: async (client, message) => {
        let emojis = client.emotes;
        const err = (err, i) => ErrorHandler(!i ? message : i, err);
        // ==============================< Command Handling >=============================\\	
        const prefix = client.config.Prefix;
        if (message.author.bot) return;
        if (message.channel.type !== 0) return;
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
        if (!prefixRegex.test(message.content)) return;
        const [mPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(mPrefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        let command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd)) //|| client.commands.get(client.aliases.get(cmd));
        // ==============================< If command doesn't found >=============================\\         
        if (cmd.length === 0) {
            if (mPrefix.includes(client.user.id))
                return message.reply({
                    // components: [client.linksButtons],
                    embeds: [new EmbedBuilder()
                        .setColor(client.embed.color)
                        .setDescription(`${client.emotes.MESSAGE.y} **To see my commands list type \`${prefix}help\` or \`/help\`**`)
                    ],
                }).catch(() => { });
            return;
        }
        // ==============================< If !command return >=============================\\
        if (!command || !command.run) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.embed.wrongcolor)
                        .setDescription(`${emojis.MESSAGE.i} The command \`${cmd}\` does not exist`)
                ]
            }).then(m => setTimeout(() => m.delete(), 6000));
        }
        if (command) {
            // ==============================< Toggle off >=============================\\
            if (command.toggleOff) {
                return await message.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`${emojis.MESSAGE.x} **That Command Has Been Disabled By The Developers! Please Try Later.**`)
                        .setColor(client.embed.wrongcolor)
                    ]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => {
                            console.log(String(e).grey)
                        })
                    }, 6000)
                }).catch((e) => {
                    console.log(String(e).grey)
                });
            }
            // ==============================< On Mainenance Mode >============================= \\
            if (command.maintenance) {
                return await message.reply({
                    content: `${emojis.MESSAGE.x} **${command.name} command is on __Maintenance Mode__** try again later!`
                })
            }
            // ==============================< Owner Only >============================= \\
            if (command.ownerOnly) {
                const owners = client.config.DEV.OWNER.concat(
                    client.config.DEV.CO_OWNER
                );
                if (!owners.includes(message.author.id)) return await message.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`${emojis.MESSAGE.x} **You cannot use \`${prefix}${command.name}\` command as this is a developer command.**`).setColor(client.embed.wrongcolor)
                    ]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete().catch((e) => {
                            console.log(String(e).grey)
                        })
                    }, 6000)
                }).catch((e) => {
                    console.log(String(e).grey)
                });
            }
            // ==============================< Permissions checking >============================= \\
            if(command.permissions){
                if (command.permissions.bot || command.permissions.user) {
                    if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions.user || []))) {
                        const userPerms = new EmbedBuilder()
                        .setDescription(`${emojis.MESSAGE.x} ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                        .setColor(client.embed.wrongcolor)
                    return message.reply({ embeds: [userPerms] })
                }
                if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.permissions.bot || []))) {
                    const botPerms = new EmbedBuilder()
                        .setDescription(`${emojis.MESSAGE.x} ${message.author}, I don't have \`${command.permissions.bot}\` permissions to use this command!`)
                        .setColor(client.embed.wrongcolor)
                        return message.reply({ embeds: [botPerms] })
                    }
                }
            }
            // ==============================< Music Command >============================= \\
            if (command.music) {
                const { member, guild } = message, { channel } = member.voice, VC = member.voice.channel;
                if (!VC) return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.embed.wrongcolor)
                        .setDescription(`Please Join a Voice Channel`)
                    ]
                });
                if (channel.userLimit != 0 && channel.full)
                    return message.reply({
                        embeds: [new EmbedBuilder()
                            .setColor(client.embed.wrongcolor)
                            .setDescription(`Your Voice Channel is full, I can't join!`)
                        ]
                    });
                if (guild.members.me.voice.channel && VC !== guild.members.me.voice.channel) return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(client.embed.wrongcolor)
                        .setDescription(`Join my channel ${guild.members.me.voice.channel}`)
                    ]
                });
            }

            // ==============================< NSFW checking >============================= \\
            if (command.nsfwOnly && !message.channel.nsfw) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${emojis.MESSAGE.x} ${message.author.username} This command only works in NSFW channels!`)
                            .setDescription(`Please go to the NSFW channel to use this command!`)
                            .setColor(client.embed.wrongcolor)
                    ]

                }).then(m => setTimeout(() => m.delete(), 6000));
            }
            // ==============================< Only for offical guilds >============================= \\
            if (command.guildOnly) {
                const privates = client.config.SERVER.OFFICIAL.Guild_ID_1.concat(client.config.SERVER.Guild_ID_2);
                if (!privates.includes(message.guild.id)) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${emojis.MESSAGE.x} ${message.author.username} You have entered an invalid command!`)
                                .setDescription(`The command \`${command.name}\` can only be used in the official server.`)
                                .setColor(client.embed.wrongcolor)
                        ]
                    }).then(m => setTimeout(() => m.delete(), 6000));
                }
            }

            // ==============================< Options Manager >============================= \\
            const optionsMap = new Map();
            if (command.options) {
                const options = command.options;
                const errorMessages = [];
                const argsMessages = [];
                let maped = `Syntax: ${prefix}${command.name} ${command.options.map(op => `${op.required ? `<${op.name}>` : `[${op.name}]`}`).join(" ")}`;
                if ((!args || !args[0]) && options[0].required && options[0].type !== "attachment") {
                    argsMessages.push(maped)
                } else for (let index = 0; index < options.length; index++) {
                    const option = options[index];
                    if (option.required) {
                        if (!args[index] && option.type !== "attachment") {
                            errorMessages.push(`${emojis.MESSAGE.i} Missing **${th(index + 1)}** Parameter\n\`\`\`yml\n${maped}\n\`\`\``);
                            break;
                        } else {
                            if (option.type === "string") optionsMap.set(option.id, args[index])
                            else if (option.type === "user") {
                                const userMatch = args[index].match(/^<@!?(\d+)>$/);
                                const userMatch2 = args[index].match(/^(\d+)$/);
                                if (!userMatch && !userMatch2) errorMessages.push(`${emojis.MESSAGE.x} Invalid mention, Kindly mention a correct user or provide a vaild ID!\n\`\`\`yml\n${maped}\n\`\`\``);
                                else optionsMap.set(option.id, userMatch ? userMatch[1] : userMatch2[1])
                            } else if (option.type === "role") {
                                if (isValidRole(message.guild, args[index])) optionsMap.set(option.id, args[index].match(/^<@&(\d+)>$/)[1])
                                else errorMessages.push(`${emojis.MESSAGE.i} Invalid Role, Kindly provide valid role Name, ID or Mention it.\n\`\`\`yml\n${maped}\n\`\`\``);
                            } else if (option.type === "channel") {
                                if (isValidChannel(message.guild, args[index])) optionsMap.set(option.id, args[index].match(/^<#(\d+)>$/)[1])
                                else errorMessages.push(`${emojis.MESSAGE.i} Invalid Channel, Kindly provide valid Channel Name, ID or Mention it.\n\`\`\`yml\n${maped}\n\`\`\``);
                            } else if (option.type === "number") {
                                if (isNaN(args[index])) errorMessages.push(`${emojis.MESSAGE.i} Invalid Number, Kindly Provide a vaild number.\n\`\`\`yml\n${maped}\n\`\`\``);
                                else {
                                    if ((option.max && args[index] > option.max) ||
                                        (option.min && args[index] < option.min)) {
                                        errorMessages.push(`${emojis.MESSAGE.i} Kindly Provide a Number amoung ${option.min ?? 0}-${option.max ?? `Infinte`} \n\`\`\`yml\n${maped}\n\`\`\``);
                                    } else {
                                        optionsMap.set(option.id, args[index])
                                    }
                                }

                            } else if (option.type === "attachment") {
                                if (option.required) {
                                    if (!message.attachments || message.attachments.size === 0) {
                                        errorMessages.push(`${emojis.MESSAGE.i} Missing **${th(index + 1)}** Parameter\n\`\`\`yml\n${maped}\n\`\`\``);
                                    } else optionsMap.set(option.id, message.attachments)
                                }

                            }
                        }
                    } else {
                        if (args[index]) {
                            const userMatch = args[index].match(/^<@!?(\d+)>$/);
                            const userMatch2 = args[index].match(/^(\d+)$/);
                            if (!userMatch && !userMatch2) {
                                errorMessages.push(`${emojis.MESSAGE.x} Invalid mention, Kindly mention a correct user`);
                            } else optionsMap.set(option.id, userMatch ? userMatch[1] : userMatch2[1])
                        }
                        break;
                    };
                }
                if (argsMessages.length > 0) {
                    const embed = new EmbedBuilder().setFooter({
                        text: "Required Parameters: < > - Optional Parameters: [ ]"
                    })
                        .setDescription(`***Make Sure to follow the syntax to run  \`${command.name}\` command***\n\`\`\`yml\n${argsMessages[0]}\`\`\``)
                        .setColor(client.embed.wrongcolor)
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL({
                                format: "png", dynamic: true
                            })
                        }).setTimestamp()
                    message.reply({
                        embeds: [embed]
                    });
                    return;
                } else if (errorMessages.length > 0) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL({
                                format: "png", dynamic: true
                            })
                        }).setTimestamp()
                        .setDescription(errorMessages[0])
                        .setColor(client.embed.wrongcolor)
                        .setFooter({
                            text: "Required Parameters: < > - Optional Parameters: [ ]"
                        });
                    message.reply({
                        embeds: [embed]
                    });
                    return;
                }
            }
            // ==============================< CoolDown checking >============================= \\
            if (command.cooldown) {
                if (CoolDown(message, command, client)) {
                    return await message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`${emojis.MESSAGE.x} Please wait ***\`${CoolDown(message, command).toFixed(1)}\` Seconds*** Before using the \`${command.name}\` command again!`)
                                .setColor(client.embed.wrongcolor)
                        ]
                    }).then(m => setTimeout(() => m.delete(), CoolDown(message, command) * 1000));
                }
            }

            // ==============================< Start The Command >============================= \\
            await command.run({ client, message, args, command, options: optionsMap, err });

            const commandLogsChannel = client.channels.cache.get(client.config.Channels.CommandLogs);
            if (!commandLogsChannel || !client.config.Settings.CommandLogs) return;
            commandLogsChannel.send({
                embeds: [new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setAuthor({
                        name: message.guild.name,
                        iconURL: message.guild.iconURL({
                            dynamic: true
                        })
                    })
                    .setTitle(`Prefix Command`)
                    .addFields([
                        { name: "**Author**", value: `\`\`\`yml\n${message.author.tag} [${message.author.id}]\`\`\`` },
                        { name: "**Command Name**", value: `\`\`\`yml\n${command.name}\`\`\`` },
                        { name: `**Guild**`, value: `\`\`\`yml\n${message.guild?.name} [${message.guild?.id}]\`\`\`` }
                    ])
                ]
            });
        }
    }
}


// escapeRegex
function escapeRegex(str) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
        console.log(String(e.stack))
    }
}

function th(index) {
    if (index == 1) return "First"
    else if (index == 2) return "2nd"
    else if (index == 3) return "3rd"
    else return index + "th"
}



function isValidRole(guild, input) {
    const mentionMatch = input.match(/^<@&(\d+)>$/);
    if (mentionMatch) {
        const roleId = mentionMatch[1];
        return guild.roles.cache.has(roleId);
    }

    if (guild.roles.cache.has(input)) return true;

    const role = guild.roles.cache.find((r) => r.name === input);
    return !!role;
}


function isValidChannel(guild, input) {

    const mentionMatch = input.match(/^<#(\d+)>$/);
    if (mentionMatch) {
        const channelId = mentionMatch[1];
        return guild.channels.cache.has(channelId);
    }

    if (guild.channels.cache.has(input)) {
        return true;
    }

    const channel = guild.channels.cache.find((c) => c.name === input);
    return !!channel;
}