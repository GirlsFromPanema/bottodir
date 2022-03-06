"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Report/report");

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
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });

    if (!guildQuery) {
      const newReports = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });

      newReports.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully set the report channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: `${emojis.error} | This is not a valid channel!`,
          ephemeral: true,
        });
        return;
      }

      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
      });
      interaction.reply({
        content: `${emojis.success} | Successfully changed report channel to ${channel}`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No polls setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed polls setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managereports")
  .setDescription("Setup/Remove reports")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup reports")

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for sending reports.")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove report system.")
  );
