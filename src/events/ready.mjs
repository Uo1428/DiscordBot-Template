import { version } from 'discord.js';
import logger from '../utils/logger.mjs';
export default {
  name: "ready",
  runOnce: false,
  run: async (client) => {

    client.user.setActivity(client.config.Activity);
    client.user.setStatus(client.config.Status);

    logger(`Logged in as ${client.user.tag}!`.cyan.bold);

  }
};
