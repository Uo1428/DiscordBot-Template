const { ApplicationCommandType,SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const os = require('os');
require('ms');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('invite')
        .addSubcommand(s => s
                .setName('me')
                .setDescription('Invite Me in your server 😎')
        ),
  run: async (client, interaction) => {
    try {
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${client.config.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`  
        const actionRow = new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setLabel('Invite Me!')
              .setURL(inviteUrl)
              .setStyle(5)
          ])

      await interaction.reply({ /* content: "_ _", */ components: [actionRow] })
	  
      } catch (error) {
        client.slash_err(client, interaction, error);
      }
  }
};