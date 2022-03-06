"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Antiscam/antiscam");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  if (sub === "enable") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (isSetup)
      return interaction.followUp({
        content: `${emojis.error} | Antiscam is already enabled.`,
        ephemeral: true,
      });

    const newGuild = new Guild({
      id: interaction.guildId
    });
    newGuild.save();
    interaction.followUp({
      content: `${emojis.success} | Successfully **enabled** antiscam`,
      ephemeral: true,
    });
  } else if (sub === "disable") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | Antiscam is not enabled.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
        content: `${emojis.success} | Successfully **disabled** antiscam`,
        ephemeral: true,
      });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("manageantiscam")
  .setDescription("Enable/Disable Antiscam")
  .addSubcommand((sub) =>
    sub.setName("enable").setDescription("Enable Antiscam")
  )
  .addSubcommand((sub) =>
    sub.setName("disable").setDescription("Remove the Antiscam Setup")
  );
