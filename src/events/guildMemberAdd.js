"use strict";

const { GuildMember, MessageEmbed, Role } = require("discord.js");
const moment = require("moment");
const Guild = require("../models/welcome.js");
const client = require("../util/bot.js");
const GuildLogs = require("../models/logs");
const emojis = require("../../Controller/emojis/emojis");

module.exports.data = {
  name: "guildMemberAdd",
  once: false,
};

/**
 * Handle the clients event.
 * @param {GuildMember} member The client that triggered the event.
 */

module.exports.run = async (member) => {
  try {
    const embed = new MessageEmbed()
      .setTitle("👋 Welcome!")
      .setDescription(`Welcome to **${member.guild.name}** ${member}!`)
      .setColor("GREEN")
      .setTimestamp()
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Server: ${member.guild.name}`, iconURL: member.displayAvatarURL({ dynamic: true })})
  
    const logembed = new MessageEmbed()
    .setTitle("👋  New member!")
    .setDescription(`Username: ${member}\nID: ${member.id}\n\n📅 Created: ${moment(member.user.createdTimestamp).format("DD/MM/YYYY")}`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Server: ${member.guild.name}`, iconURL: member.displayAvatarURL({ dynamic: true })})
    .setTimestamp()
    .setColor("GREEN")

    // Query the database for the Guilds Settings (Channel)
    const guildQuery = await Guild.findOne({ id: member.guild.id });
    if (!guildQuery) return;
    
    const role = member.guild.roles.cache.find(
      (role) => role.id == guildQuery.role
    );
    
    if (guildQuery) {
      // Sending message when new user joins the Server.
      const guild = member.client.guilds.cache.get(member.guild.id);
      const logging = guild.channels.cache.get(guildQuery.channel);
      logging.send({ embeds: [embed] });

      member.roles.add(role); // role.id
    }

    const logQuery = await GuildLogs.findOne({ id: member.guild.id })
    if(!logQuery) return;

    if(logQuery) {
      const guildlogs = member.client.guilds.cache.get(member.guild.id);
      const logchannel = guildlogs.channels.cache.get(logQuery.channel);
      logchannel.send({ embeds: [logembed] })
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
