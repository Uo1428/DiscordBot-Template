const { ModalBuilder, TextInputBuilder, SlashCommandBuilder, ApplicationCommandType, ActionRowBuilder } = require("discord.js")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate a piece of code'),
	cooldown: 0,
  guildOnly: false,
  ownerOnly: true,
  toggleOff: false,
  nsfwOnly: false,
  maintenance: false,
	run: async (client, interaction) => {
    try{
      const modal = new ModalBuilder() .setCustomId(`eval-modal`).setTitle(`Eval code`);
      const input = new TextInputBuilder() .setCustomId('eval-code').setValue('interaction.user').setLabel('Input code to eval').setStyle(2).setMinLength(1).setPlaceholder('Code here...').setRequired(true);
      const firstActionRow = new ActionRowBuilder().addComponents(input);
      modal.addComponents(firstActionRow);
      await interaction.showModal(modal);
    } catch(error){
      client.slash_err(client, interaction, error);
    }
  },
};