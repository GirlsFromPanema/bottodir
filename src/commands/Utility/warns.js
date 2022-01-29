"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const warnModel = require("../../models/Moderation/warning");
const moment = require("moment");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const user = interaction.options.getMember("target");

    const userWarnings = await warnModel.find({
      userId: user.id,
      guildId: interaction.guild.id,
    });

    if (!userWarnings?.length) {
      return interaction.reply({
        content: `${user} has no warnings`,
        ephemeral: true,
      });
    }

    const userwarns = userWarnings
      .map((warn) => {
        const moderator = interaction.guild.members.cache.get(warn.moderatorId);
        return [
          `warnId: ${warn._id}`,
          `Moderator: ${moderator || "Has left"}`,
          `Date: ${moment(warn.timestamp).format("MMMM Do YYYY")}`,
          `Reason: ${warn.reason}`,
        ].join("\n");
      })
      .join("\n\n");

    const embed = new MessageEmbed()
      .setTitle(`${user.user.tag}'s warnings`)
      .setDescription(userwarns)
      .setColor("RED")
      .setTimestamp()
      .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Server: ${user.guild.name}`, iconURL: user.displayAvatarURL({ dynamic: true })})

    interaction.reply({ embeds: [embed] });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
  userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("warns")
  .setDescription("Show warns of a User")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("Select the User to list warns from")
      .setRequired(true)
  );
