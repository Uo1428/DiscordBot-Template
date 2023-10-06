import { EmbedBuilder, Role, Message } from 'discord.js';
import axios from "axios";
import cache from '../../../src/utils/cache.mjs';

export default {
    name: [
        "highfive", "happy", "sleep",
        "handhold", "laugh", "bite",
        "poke", "tickle", "kiss", "wave",
        "thumbsup", "stare", "cuddle",
        "smile", "lurk", "baka", "blush",
        "nom", "peck", "handshake",
        "think", "pout", "facepalm",
        "yawn", "wink", "shoot", "smug",
        "nope", "cry", "pat", "nod",
        "punch", "dance", "feed",
        "shrug", "bored", "kick", "hug",
        "yeet", "slap", "neko", "husbando",
        "kitsune", "waifu"],
    cooldown: 10,
    description: "React on somesone as {commandName}",
    options: [
        {
            id: "user",
            type: "user",
            name: "@User / Mention Someone",
            required: false,
        }
    ],
    run: async ({ message, client, err, args, command, options }) => {
        try {
            let op = options.get("user")
            let user = op ? cache.get(`user-${op}`) : null;
            
            const errMsg = async () => await message.reply({
                embeds: [client.Embed(false).setDescription(client.emotes.MESSAGE.x + " Got an error! try again later")]
            })

            if (op && !user) {
                user = await message.guild.members.cache.get(op)
                if(!user) return await errMsg()
                cache.set(`user-${op}`, user, 120)
            }

            const response = await axios.get(`https://nekos.best/api/v2/${command.name}`);

            if (!response.data || !response.data.results || !response.data.results[0].url) return errMsg()

            await message.reply({
                embeds: [client.Embed().setImage(response.data.results[0].url).setTitle("Anime Reaction").setDescription(`${message.author} Reacted ${user ? `On <@${user.id}>` : `: ${command.name}`}`)],
            }).catch((e) => err(e))

        } catch (error) {
            err(error)
        }
    }
};