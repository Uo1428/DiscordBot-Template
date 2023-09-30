import { EmbedBuilder } from 'discord.js';
export default {
    name: "ping",
    cooldown: 10,
    aliases: ["pong", "up", "uptime"],
    run: async ({ message, client, err }) => {
        try {
            let days = Math.floor(client.uptime / 86400000)
            let hours = Math.floor(client.uptime / 3600000) % 24
            let minutes = Math.floor(client.uptime / 60000) % 60
            let seconds = Math.floor(client.uptime / 1000) % 60
            let webLatency = new Date() - message.createdAt
            let apiLatency = client.ws.ping
            let totalLatency = webLatency + apiLatency
            let emLatency = {
                Green: '🟢',
                Yellow: '🟡',
                Red: '🔴'
            }
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(totalLatency < 200 ? client.embed.successcolor : totalLatency < 500 ? client.embed.stanbycolor : client.embed.wrongcolor)
                        .setTitle(`Returns Latency And API Ping`)
                        .setFields([
                            {
                                name: `📡 Websocket Latency`,
                                value: `>>> \`\`\`yml\n${webLatency <= 200 ? emLatency.Green : webLatency <= 400 ? emLatency.Yellow : emLatency.Red} ${webLatency}ms\`\`\``,
                                inline: true
                            },
                            {
                                name: `🛰 API Latency`,
                                value: `>>> \`\`\`yml\n${apiLatency <= 200 ? emLatency.Green : apiLatency <= 400 ? emLatency.Yellow : emLatency.Red} ${apiLatency}ms\`\`\``,
                                inline: true
                            },
                            {
                                name: `⏲ Uptime`,
                                value: `>>> \`\`\`m\n${days} Days : ${hours} Hrs : ${minutes} Mins : ${seconds} Secs\`\`\``,
                                inline: false
                            }
                        ])]
            })
        } catch (error) {
            err(error)
        }
    }
};