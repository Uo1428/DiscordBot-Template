const fs = require('fs');
const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const { REST } = require('discord.js');
const { Routes } = require('discord.js');
const config = require(`${process.cwd()}/Assets/Config/config.js`);
const set = require(`${process.cwd()}/Assets/Config/settings`);
require("colors");
module.exports = {
  async execute(client) {
    const TOKEN = config.TOKEN;
    const CLIENT_ID = client.config.CLIENT_ID;
    const rest = new REST({ version: '9' }).setToken(TOKEN);
    const slashCommands = [];
    let x = 0;
    fs.readdirSync(`${process.cwd()}/Commands/Slash/`).forEach(async dir => {
      const files = fs.readdirSync(`${process.cwd()}/Commands/Slash/${dir}/`).filter(file => file.endsWith('.js'));
      for (const file of files) {
        const slashCommand = require(`${process.cwd()}/Commands/Slash/${dir}/${file}`);
        slashCommands.push(slashCommand.data);
        x++;
        if (slashCommand.data.name) {
          client.slashCommands.set(slashCommand.data.name, slashCommand)
        } else {
          client.logger(`Command Error: ${slashCommand.name || file.split('.js')[0] || "Missing Name"}`.brightRed)
        }
      }
    });

    (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(CLIENT_ID),
          { body: slashCommands },
        )
        setTimeout(() => {
          client.logger(`Loaded ${x} Slash Commands`.bold)
        }, 1500)
      } catch (error) {
        console.log(error);
      }
    })();
  }
};
