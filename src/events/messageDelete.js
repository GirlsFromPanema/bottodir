"use strict";

const { GuildMember, MessageEmbed } = require("discord.js");
const Guild = require("../models/logs");
const emojis = require("../../Controller/emojis/emojis")

module.exports.data = {
  name: "messageDelete",
  once: false,
};

/**
 * Handle the clients event.
 * @param {GuildMember} member The client that triggered the event.
 * @param {CommandInteraction} interaction The Command Interaciton
 */

module.exports.run = async (message) => {
  try {
    
    if(message.author.bot) return;

    const embed = new MessageEmbed()
      .setTitle(`${emojis.error} Message deleted`)
      .setDescription(`[Message](${message.url})\nFrom ${message.author.tag}\n\nDeleted message:\n**${message.content ? message.content : "None"}**`.slice(0, 4096))
      .setColor("RED")
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Member: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true })})
    

    // Query the database for the Guilds Settings (Channel)
    const guildQuery = await Guild.findOne({ id: message.guild.id });
    if (!guildQuery) return;

    if (guildQuery) {
      // Sending message someone deletes a message
      const guild = message.client.guilds.cache.get(message.guild.id);
      const logging = guild.channels.cache.get(guildQuery.channel);
      logging.send({ embeds: [embed] });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
