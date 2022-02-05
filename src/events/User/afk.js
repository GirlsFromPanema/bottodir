"use strict";

const {
  GuildMember,
  MessageEmbed,
  MessageFlags,
  CommandInteraction,
} = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const User = require("../../models/AFK/afk");

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

    const isAFK = await User.findOne({
      Guild: message.guild.id,
      userID: message.author.id,
    });

    if (isAFK) {
      isAFK.delete();

      const dataDeletedEmbed = new MessageEmbed()
        .setDescription(`${message.author.username} You are no longer AFK!`)
        .setColor("GREEN")
        .setTimestamp();

      message.channel.send({ embeds: [dataDeletedEmbed] });
    }

    const mentionedUser = message.mentions.users.first();
    if (mentionedUser) {
      const data = await User.findOne({
        Guild: message.guild.id,
        userID: mentionedUser.id,
      });

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
