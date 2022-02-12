"use strict";

const {
  GuildMember,
  MessageEmbed,
  MessageFlags,
  CommandInteraction,
} = require("discord.js");

// Database queries
const Guild = require("../../models/Levelling/guildlevel");
const Levels = require("discord-xp");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const config = require("../../../Controller/owners.json");

const mongooseConnectionString = config.database;
Levels.setURL(mongooseConnectionString);

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
    if (message.author.bot) return;

    const hasEnabled = await Guild.findOne({ id: message.guild.id });
    if (!hasEnabled) return;

    if (hasEnabled) {
      const randomxp = Math.floor(Math.random() * 10) + 1; 
      const hasLevelUp = await Levels.appendXp(
        message.author.id,
        message.guild.id,
        randomxp
      );
      if (hasLevelUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.reply(
          `Congrats you just leveled up!\nLevel: \`${user.level}\``
        );
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
