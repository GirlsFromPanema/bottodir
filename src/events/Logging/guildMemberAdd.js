"use strict";

const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");
const moment = require("moment");

// Database queries
const Guild = require("../../models/Welcome/welcome.js");
const GuildLogs = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const client = require("../../util/bot.js");

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
    
    try {
      if (guildQuery) {
        // Sending message when new user joins the Server.
        const guild = member.client.guilds.cache.get(member.guild.id);
        const logging = guild.channels.cache.get(guildQuery.channel);
        logging.send({ embeds: [embed] });
  
        member.roles.add(role); // role.id
      }
    } catch(error) {
      console.log(error)
    }
    
    const logQuery = await GuildLogs.findOne({ id: member.guild.id })
    if(!logQuery) return;

    if(logQuery) {
      const webhookid = logQuery.webhookid;
      const webhooktoken = logQuery.webhooktoken;

      const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });
    
      webhookClient.send({ embeds: [logembed]})
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
