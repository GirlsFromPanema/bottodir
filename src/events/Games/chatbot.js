"use strict";

const { GuildMember, MessageEmbed, MessageFlags, DiscordAPIError } = require("discord.js");
const fetch = require("cross-fetch");

// Database Query Model
const Guild = require("../../models/Games/chatbot");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const config = require("../../../Controller/owners.json");

const {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  Discord,
  ReactionUserManager,
} = require("discord.js");

module.exports.data = {
  name: "messageCreate",
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
    
    // If not setup, don't answer.
    const hasChatbot = await Guild.findOne({ id: message.guild.id })
    if(!hasChatbot) return;

    const chatbotchannel = hasChatbot.channel;
    const errorchannel = message.channel;

    // Only allow answers within the bot channel saved in the db
    if(message.channel.id === chatbotchannel) {
    const response = await fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(message.content)}&botname=${message.client.user.username}&ownername=Koni#9521`)
    
    if(!response.ok) {
      console.log("Error while fetching APi for chatbot") 
      errorchannel.setRateLimitPerUser(300)
      return;
    } 

    if(response.ok) {
      errorchannel.setRateLimitPerUser(0)
    }

    const data = await response.json();
    message.reply(data.message);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
