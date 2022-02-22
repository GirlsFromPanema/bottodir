"use strict";

const { GuildMember, MessageEmbed, MessageFlags, DiscordAPIError } = require("discord.js");

// Database Query Model
const Guild = require("../../models/Games/gtn");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

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

    // If no setup, don't do anything.
    const isRunning = await Guild.findOne({ id: message.guild.id });
    if(!isRunning) return;

    const guildgame = message.client.guilds.cache.get(message.guild.id);
    const gamechannel = guildgame.channels.cache.get(isRunning.channel);
    
    // Only accept numbers, if the guess is correct, return a message.
    // BTW. don't look at the code, it's cringe
    // TODO: REWRITE ...
    if(Number.isInteger(parseInt(message.content)) && parseInt(message.content) == isRunning.number && message.channel.id == gamechannel) {
        message.pin().catch(error => {
            if(error instanceof DiscordAPIError) return message.reply({ content: `${emojis.success} correct Number!\n\n**Warning: Unable to pin message**`})
        })

        // Remove the perms to send any message into the channel 
        message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        });

        message.react("✅").catch(error => console.log(error));
        message.reply('This is the correct number! Congrats!');
        isRunning.delete(); // Delete saved data from the db as it's not needed anymore.
    } else return;
    
   

  } catch (err) {
    return Promise.reject(err);
  }
};
