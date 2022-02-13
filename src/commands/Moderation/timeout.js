"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  WebhookClient
} = require("discord.js");
const ms = require("moment");

// Database queries
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils, guild, member) => {
  try {
    const target = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason");
    const time = ms(interaction.options.getNumber("time"));

    if (!target)
      return interaction.reply({
        content: "This User is invalid",
        ephemeral: true,
      });

    if (!time)
      return interaction.reply({
        content: "Please provide a valid Time to Timeout",
        ephemeral: true,
      });

    const timeout = await target.timeout(time, reason);

    await interaction.reply({
      content: `${emojis.success} successfully timeouted ${target}`,
      ephemeral: true,
    });

    const embed = new MessageEmbed()
      .setTitle(`${emojis.success} User timeouted`)
      .setDescription(
        `User: ${target}\nModerator: ${interaction.user.tag}\nReason: ${reason}`
      )
      .setTimestamp()
      .setColor("GREEN")
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `From: ${interaction.guild.name}`, iconURL: String });

    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    if (!guildQuery) return;

    if (guildQuery) {
      const webhookid = guildQuery.webhookid;
      const webhooktoken = guildQuery.webhooktoken;

      const webhookClient = new WebhookClient({
        id: webhookid,
        token: webhooktoken,
      });

      webhookClient.send({ embeds: [logs] });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
};

module.exports.data = new SlashCommandBuilder()
  .setName("timeout")
  .setDescription("Timeout a User")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("Select the User to timeout")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide a reason to timeout")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("time")
      .setDescription("Select the Time for the Timeout")
      .setRequired(true)
  );
