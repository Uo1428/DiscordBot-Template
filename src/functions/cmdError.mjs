import { EmbedBuilder, MessageManager } from 'discord.js';

import(`colors`)
export {
  slash,
  msg
}

// function slash
function slash(interaction, error) {
  const { client } = interaction;
  console.log(error.stack ? String(error.stack).gray : String(error).gray)

  if (client.config.Settings.CommandErrorLogs && client.config.Channels.CommandErrorLogs) client.channels.cache.get(client.config.Channels.CommandErrorLogs).send({
    embeds: [
      new EmbedBuilder()
        .setColor("#00ffaa")
        .setTitle(`${client.emotes.MESSAGE.x} Error System [INTERACTION COMMANDS]`)
        .setDescription(`_An error has occured_.\n\n**Error Code:** \`${error.name}\`\n**Error Message:** \`${error.message}\`\n**Stack:** \`\`\`yml\n${error.stack}\`\`\``)
        .setFooter({ text: `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}% | Ping: ${Date.now() - interaction.createdTimestamp}ms` })
        .addFields([
          { name: "Guild", value: interaction.guild?.name, inline: true },
          { name: "ID", value: interaction.guild?.id, inline: true }
        ])
    ]
  });

  let embed = new EmbedBuilder()
    .setColor(client.embed.wrongcolor)
    .setAuthor({ name: `An error has occured! Try again later!`, url: "https://youtube.com/@uoaio" })


  interaction.reply({ embeds: [embed], ephemeral: true, }).catch(() => {

    interaction.editReply({
      embeds: [embed],
      content: "", files: [], components: []

    }).catch(() => { })

  })
}



function msg(message, error) {
  if(!error) throw 'Error Was Not Provided - Prefix Error Handler'
  const { client } = message;
  console.log(error.stack ? String(error.stack).gray : String(error).gray)

  if (client.config.Settings.CommandErrorLogs && client.config.Channels.CommandErrorLogs) client.channels.cache.get(client.config.Channels.CommandErrorLogs).send({
    embeds: [
      new EmbedBuilder()
        .setColor("#00ffaa")
        .setTitle(`${client.emotes.MESSAGE.x} Error System [INTERACTION COMMANDS]`)
        .setDescription(`_An error has occured_.\n\n**Error Code:** \`${error.name}\`\n**Error Message:** \`${error.message}\`\n**Stack:** \`\`\`yml\n${error.stack}\`\`\``)
        .setFooter({ text: `Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB | CPU: ${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}% | Ping: ${Date.now() - message.createdTimestamp}ms` })
        .addFields([
          { name: "Guild", value: `\`\`\`yml\n${message.guild?.name} (${message.guild?.id})\`\`\``, inline: true },
          { name: "User", value: `\`\`\`yml\n${message.author.username} (${message.author.id})\`\`\``, inline: true }
        ])
    ]
  });

  let embed = new EmbedBuilder()
    .setColor(client.embed.wrongcolor)
    .setAuthor({ name: `An error has occured! Try again later!`, url: "https://youtube.com/@uoaio" })

  if (message.author.id === client.user.id) message.edit({
    embeds: [embed],
    content: "", files: [], components: []
  });
  else message.reply({
    embeds: [embed]
  })
}