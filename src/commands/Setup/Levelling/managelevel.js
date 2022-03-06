"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const GuildLevelling = require("../../../models/Levelling/guildlevel");

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
    const guildQuery = await GuildLevelling.findOne({ id: interaction.guild.id });
    if (!guildQuery) {
      const newGuild = new GuildLevelling({
        id: interaction.guild.id,
      });
      newGuild.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully **enabled** levelling.`,
        ephemeral: true,
      });
    } else {
      return interaction.followUp({
        content: `${emojis.error} | You have already enabled levelling.`,
        ephemeral: true,
      });
    }
    
  } else if (sub === "remove") {
    const guildQuery = await GuildLevelling.findOne({ id: interaction.guild.id });
    if(!guildQuery) return interaction.followUp({ content: `${emojis.error} | You first have to setup levelling before disabling it.`, ephemeral: true });

    guildQuery.delete();

    interaction.followUp({
        content: `${emojis.success} | Successfully **disabled** levelling.`,
        ephemeral: true,
      });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managelevel")
  .setDescription("Setup/Remove levelling")
  .addSubcommand((sub) => sub.setName("setup").setDescription("Setup levelling"))
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove levelling system.")
  );
