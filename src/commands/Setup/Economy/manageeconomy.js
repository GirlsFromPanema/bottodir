"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const GuildEconomy = require("../../../models/Economy/guildeconomy");

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

  if (sub === "setup") {
    const guildQuery = await GuildEconomy.findOne({ id: interaction.guild.id });
    if (!guildQuery) {
      const newGuild = new GuildEconomy({
        id: interaction.guild.id,
      });
      newGuild.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully **enabled** economy.`,
        ephemeral: true,
      });
    } else {
      return interaction.followUp({
        content: `${emojis.error} | You have already enabled economy.`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await GuildEconomy.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | You first have to **enable** Economy before disabling it.`,
        ephemeral: true,
      });

    isSetup.delete();

    interaction.followUp({
      content: `${emojis.success} | Successfully **disabled** economy.`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("manageeconomy")
  .setDescription("Setup/Remove Auctions")
  .addSubcommand((sub) => sub.setName("setup").setDescription("Setup economy"))
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove economy system.")
  );
