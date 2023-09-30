import { Collection } from "discord.js";


export {
  slash,
  msg
} 

// InteractionCreate only
function slash(interaction, slashCommand) {
  if (!interaction || !interaction.client) throw 'No Interaction with a valid DiscordClient granted as First Parameter';
  if (!slashCommand || !slashCommand.data.name) throw 'No Command with a valid name granted as Second Parameter';
  const client = interaction.client;
  if (!client.cooldowns.has(slashCommand.data.name)) {
    client.cooldowns.set(slashCommand.data.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(slashCommand.data.name);
  const cooldownAmount = (slashCommand.cooldown || 1) * 1000;
  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeleft = (expirationTime - now) / 1000;
      return timeleft
    } else {
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      return false;
    }
  } else {
    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    return false
  }
}


// Message Only

function msg (message, command) {
  if (!message || !message.client) throw 'No Message with a valid DiscordClient granted as First Parameter';

  const client = message.client;
  if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;
  if (timestamps.has(message.member.id)) {
      const expirationTime = timestamps.get(message.member.id) + cooldownAmount;
      if (now < expirationTime) {
          const timeleft = (expirationTime - now) / 1000;
          return timeleft
      } else {
          timestamps.set(message.member.id, now);
          setTimeout(() => timestamps.delete(message.member.id), cooldownAmount);
          return false;
      }
  } else {
      timestamps.set(message.member.id, now);
      setTimeout(() => timestamps.delete(message.member.id), cooldownAmount);
      return false
  }
}
