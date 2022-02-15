"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  Message,
} = require("discord.js");

// Database queries
const Guild = require("../../models/Report/report");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 108000000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const target = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason");

    const embed = new MessageEmbed()
      .setTitle(`${emojis.notify} Report`)
      .setDescription(
        `User: ${interaction.user.tag}\nVictim: ${target.user.tag} (${target.id}).\nReason: **${reason}**`
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `From: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setTimestamp();

    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    if (!guildQuery) {
      return interaction.reply({
        content: `${emojis.error} | This guild has no Report System setup.`,
        ephemeral: true,
      });
    }

    if (target.id === interaction.guild.ownerId)
      return interaction.reply({
        content: `${emojis.error} | I cannot report the owner of the server.`,
        ephemeral: true,
      });

    if (
      target.roles.highest.position >=
      interaction.guild.me.roles.highest.position
    )
      return interaction.reply({
        content: `${emojis.error} | I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.`,
        ephemeral: true,
      });

    if (target.id === interaction.user.id)
      return interaction.reply({
        content: `${emojis.error} | You cannot report yourself.`,
        ephemeral: true,
      });

    if (target.id === interaction.guild.me.id)
      return interaction.reply({
        content: `${emojis.error} | I cannot report myself.`,
        ephemeral: true,
      });

    if (guildQuery) {
      const webhookid = guildQuery.webhookid;
      const webhooktoken = guildQuery.webhooktoken;

      const webhookClient = new WebhookClient({
        id: webhookid,
        token: webhooktoken,
      });

      //  webhookClient.send({ embeds: [embed] });
    }
    interaction.reply({
      content: `${emojis.success} | Successfully reported ${target} for: ${reason}`,
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("report")
  .setDescription("Reports a User to the Admins")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("Provide the user you want to report.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide the reason for the ban, add proofs via Imgur.")
      .setRequired(true)
  );
