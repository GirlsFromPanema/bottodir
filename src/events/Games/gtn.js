"use strict";

const { GuildMember, MessageEmbed, MessageFlags, DiscordAPIError } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

// Database Query Model
const Guild = require("../../models/Games/gtn");

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

    const isRunning = await Guild.findOne({ id: message.guild.id })
    if(!isRunning) return;

    const guildgame = message.client.guilds.cache.get(message.guild.id);
    const gamechannel = guildgame.channels.cache.get(isRunning.channel);
    

    const data = {
        id: message.guild.id,
        channel: gamechannel,
        number: isRunning.number
    }

    if(Number.isInteger(parseInt(message.content)) && parseInt(message.content) == data.number && message.channel.id == data.channel) {
        message.pin().catch(error => {
            if(error instanceof DiscordAPIError) return message.reply({ content: `${emojis.success} correct Number!\n\n**Warning: Unable to pin message**`})
        })

        message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        });
    }
    message.react("✅").catch(error => console.log(error));
    message.reply('This is the correct number! Congrats!')
    isRunning.delete();

  } catch (err) {
    return Promise.reject(err);
  }
};
