"use strict";

const { GuildMember, MessageEmbed, Role } = require("discord.js");

// Database queries
const Guild = require("../../models/Welcome/leave");

// Configs
const client = require("../../util/bot");

module.exports.data = {
  name: "guildMemberRemove",
  once: false,
};

/**
 * Handle the clients event.
 * @param {GuildMember} member The client that triggered the event.
 */

module.exports.run = async (member) => {
  try {
    const embed = new MessageEmbed()
      .setTitle("👋 Goodbye!")
      .setDescription(`Sadly ${member} left **${member.guild.name}**!`)
      .setColor("RED")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Server: ${member.guild.name}`, iconURL: member.displayAvatarURL({ dynamic: true })})
    

    // Query the database for the Guilds Settings (Channel)
    const guildQuery = await Guild.findOne({ id: member.guild.id });
    if (!guildQuery) return;

    if (guildQuery) {
      // Sending message when new user joins the Server.
      const guild = member.client.guilds.cache.get(member.guild.id);
      const logging = guild.channels.cache.get(guildQuery.channel);
      logging.send({ embeds: [embed] });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
