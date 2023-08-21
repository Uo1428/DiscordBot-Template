const { version } = require(`discord.js`)
var AsciiTable = require('ascii-table')
var table = new AsciiTable()
table.setBorder('│', '─', "✥", "✥");
table.setTitle(`Bot is online!`)
module.exports = {
  async execute(client) {
    client.on("ready", () => {
      let i = 0, s = 0;

      setInterval(() => {
        const activities = [
          { name: `${client.guilds.cache.size} Servers`, type: 2 },
          { name: `${client.channels.cache.size} Channels`, type: 0 },
          { name: `${client.users.cache.size} Users`, type: 3 },
          { name: `Discord.js v14 by @uoaio`, type: 5 }
        ];
        const status = ['online', 'dnd', 'idle'];

        if (i >= activities.length) i = 0;
        client.user.setActivity(activities[i])
        if (s >= status.length) s = 0;
        client.user.setStatus(status[s])

        i++;
        s++;
      }, 60 * 1000); // suggested 1m -> 60 * 1000

      setTimeout(() => {
        client.logger((`Logged in as ${client.user.tag}!`).cyan.bold)
      }, 2000)

      // Rows
      table
        .addRow(`Bot`, client.user.tag)
        .addRow(`Guild(s)`, `${client.guilds.cache.size} Server(s)`)
        .addRow(`Member(s)`, `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()} Members`)
        .addRow(`Commands`, `${client.slashCommands.size} (Slash)`)
        .addRow(`Discord.js`, `${version}`)
        .addRow(`Node.js`, `${process.version}`)
        .addRow(`Memory`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`)
      setTimeout(() => { console.log(table.toString()) }, 3000)
    });
  }
}
