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

    const hasChatbot = await Guild.findOne({ id: message.guild.id })
    if(!hasChatbot) return;

    const guildgame = message.client.guilds.cache.get(message.guild.id);
    const botchannel = guildgame.channels.cache.get(hasChatbot.channel);
    
    if(message.channel.id === botchannel) {
        fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}&yr0n57JXpCy7aXlzFmMchuas`)
        .then(response => response.json())
        .then(data => {
            message.reply(data.response)
            console.log(data.response)
        })
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
