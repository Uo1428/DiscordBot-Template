import getEmojiRegex from "emoji-regex";
import * as snowflake from "./snowflake.mjs";


const EMOJI_REGEX = getEmojiRegex();

/**
 * Get all the Unicode emojis used in the specified string.
 */
export const getUnicodeEmojis = (text) => {
    if (typeof text !== "string") return [];
    return text.match(EMOJI_REGEX) || [];
};

/**
 * Get the first Unicode emoji used in the specified string.
 */
export const getUnicodeEmoji = (text) => {
    const emojis = getUnicodeEmojis(text);
    return emojis.length > 0 ? emojis[0] : "";
};

/**
 * Check whether the specified string is a Unicode emoji.
 */
export const isUnicodeEmoji = (text) => {
    return new RegExp(`^${EMOJI_REGEX.source}$`).test(text);
};

/**
 * Parse an emoji from the specified text.
 */
export const parseEmoji = (text) => {
    if (typeof text !== "string") return;

    if (snowflake.isValid(text)) return text;
    if (text.includes(":")) {
        const [, id] = text.match(/<a?:\w+:(\d+)>/i);
        return id;
    }
    return getUnicodeEmoji(text);
};

