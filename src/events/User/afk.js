"use strict";

const {
  GuildMember,
  MessageEmbed,
  MessageFlags,
  CommandInteraction,
} = require("discord.js");

// Database queries
const User = require("../../models/AFK/afk");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

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

    // Search the user in the database
    const isAFK = await User.findOne({
      Guild: message.guild.id,
      userID: message.author.id,
    });

    // If the user is sending a message, delete the saved id in the database and send a message
    if (isAFK) {
      isAFK.delete();

      const dataDeletedEmbed = new MessageEmbed()
        .setDescription(`${message.author.username} You are no longer AFK!`)
        .setColor("GREEN")
        .setTimestamp();

      message.channel.send({ embeds: [dataDeletedEmbed] });
    }

    // Check if the mentioned user is within the database/afk
    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
      const data = await User.findOne({
        Guild: message.guild.id,
        userID: mentionedUser.id,
      });

      // if the user is afk, send an information that the user is currently afk 
      if (data) {
        const embed = new MessageEmbed()
          .setTitle(`${mentionedUser.username} is currently AFK!`)
          .setColor("RED")
          .setDescription(
            `Reason: ${data.reason}\n Since: <t:${Math.round(
              data.Date / 1000
            )}:R>`
          );

        message.channel.send({ embeds: [embed] });
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
};
