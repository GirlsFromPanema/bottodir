"use strict";

const { GuildMember, MessageEmbed, MessageFlags, DiscordAPIError } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const fetch = require("cross-fetch");

// Database Query Model
const Guild = require("../../models/Games/chatbot");

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
    
    if(message.content = message.content.replace(/@(everyone)/gi, "everyone").replace(/@(here)/gi, "here"))
    if (message.content.includes(`@`)) {
      return message.channel.send(`**:x: Please dont mention anyone**`);
    }

    const hasChatbot = await Guild.findOne({ id: message.guild.id })
    if(!hasChatbot) return;

    const chatbotchannel = hasChatbot.channel;
    
    if(message.channel.id === chatbotchannel) {
      fetch(`https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(message.content)}&botname=${message.client.user.username}&ownername=Koni#9521`)
        
        .then(response => response.json())
        .then(data => {
            message.reply(data.message)
        })
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
