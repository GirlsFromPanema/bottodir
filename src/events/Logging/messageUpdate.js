"use strict";

const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");

// Database queries
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.data = {
  name: "messageUpdate",
  once: false,
};

/**
 * Handle the clients event.
 * @param {GuildMember} member The client that triggered the event.
 * @param {CommandInteraction} interaction The Command Interaciton
 */

module.exports.run = async (oldMessage, newMessage) => {
  try {

    if(oldMessage.author.bot) return;

    if(oldMessage.content === newMessage.content) return; 

    const Count = 1950;

    const Originial = oldMessage.content.slice(0, Count) + (oldMessage.content.length > 1950 ? " ..." : "")
    const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > 1950 ? " ..." : "")

    const embed = new MessageEmbed()
      .setTitle(`${emojis.notify} Message Updated`)
      .setDescription(`[Message](${newMessage.url}) by ${newMessage.author.tag} was **edited** in ${newMessage.channel}.\n**Original**: ${Originial}\n**Edited**: ${Edited}`.slice("0", "4096"))
      .setColor("RED")
      .setTimestamp()
      .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Member: ${newMessage.author.tag}`, iconURL: newMessage.author.displayAvatarURL({ dynamic: true })})
    
    // Query the database for the Guilds Settings (Channel)
    const guildQuery = await Guild.findOne({ id: newMessage.guild.id });
    if (!guildQuery) return;

    if (guildQuery) {
     // Send message if someone updates message
     const webhookid = guildQuery.webhookid;
     const webhooktoken = guildQuery.webhooktoken;

     const webhookClient = new WebhookClient({ id: webhookid, token: webhooktoken });
   
     webhookClient.send({ embeds: [embed]});
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
