import { EmbedBuilder, Collection, PermissionsBitField } from 'discord.js'
import { slash as ErrorHandler } from '../functions/cmdError.mjs';
import {slash as CoolDown} from '../functions/onCoolDown.mjs'

// import { parsePermissions } from (`${process.cwd()}/src/functions/functions.js`);
// ================================================================================
export default {
  name: "interactionCreate",
  run: async (client, interaction) => {
    const err =  (err, i) =>  ErrorHandler(!i ? interaction : i, err);
    let emojis = client.emotes
    // ==============================< Command Handling >=============================\\
    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (interaction.type == 4) {
      if (slashCommand.autocomplete) {
        const choices = [];
        await slashCommand.autocomplete(interaction, choices)
      }
    }
    if (!interaction.type == 2) return;
    // ==============================< If command doesn't found >=============================\\
    if (!slashCommand) return client.slashCommands.delete(interaction.commandName);
    // ==============================< Other Command Handling list >=============================\\
    try {
      // ==============================< Toggle off >=============================\\
      if (slashCommand.toggleOff) {
        return await interaction.reply({
          ephemeral: true,
          embeds: [new EmbedBuilder()
            .setTitle(`${emojis.MESSAGE.x} **That Command Has Been Disabled By The Developers! Please Try Later.**`).setColor(client.embed.wrongcolor)
          ]
        }).catch((e) => {
          console.log(e)
        });
      }
      // ==============================< On Mainenance Mode >============================= \\
      if (slashCommand.maintenance) {
        return await interaction.reply({
          ephemeral: true,
          content: `${emojis.MESSAGE.x} **${slashCommand.name} command is on __Maintenance Mode__** try again later!`
        })
      }
      // ==============================< Owner Only >============================= \\            
      if (slashCommand.ownerOnly) {
        const owners = client.config.OWNERS;
        if (!owners.includes(interaction.user.id)) return await interaction.reply({
          ephemeral: true,
          embeds: [new EmbedBuilder()
            .setDescription(`${emojis.MESSAGE.x} **You cannot use \`${slashCommand.name}\` command as this is a developer command.**`).setColor(client.embed.wrongcolor)
          ]
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
      // ==============================< NSFW checking >============================= \\
      if (slashCommand.nsfwOnly && !interaction.channel.nsfw) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`${emojis.MESSAGE.x} This command can only be used in NSFW channels!`)
              .setColor(client.embed.wrongcolor)
          ]
        })
      }

      // ==============================< CoolDown checking >============================= \\
      if (slashCommand.cooldown && CoolDown(interaction, slashCommand)) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder()
              .setDescription(`${emojis.MESSAGE.x} Please wait \`${CoolDown(interaction, slashCommand).toFixed(1)}\` Before using the \`${slashCommand.name}\` command again!`)
              .setColor(client.embed.wrongcolor)
            ]
          })
        }
      // ==============================< Start The Command >============================= \\	       
      await slashCommand.run({ client, interaction, err });
      if (client.config.Channels.CommmandLogs && client.config.Settings.CommmandLogs) await client.channels.cache.get(client.config.Channels.CommmandLogs).send({
        embeds: [new EmbedBuilder()
          .setColor(client.embed.color)
          .setAuthor({ name: "Slash Command", iconURL: `https://cdn.discordapp.com/emojis/942758826904551464.webp?size=28&quality=lossless` })
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .addFields([
            { name: "**Author**", value: `\`\`\`yml\n${interaction.user.tag} [${interaction.user.id}]\`\`\`` },
            { name: "**Command Name**", value: `\`\`\`yml\n${slashCommand.data.name}\`\`\`` },
            // { name: `**Guild**`, value: `\`\`\`yml\n${interaction.guild.name} [${interaction.guild.id}]\`\`\`` }
          ])
        ]
      });
      // ==============================< On Error >============================= \\
    } catch (error) {
     err(error)
    }
  }
  // }
}