"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Suggestions/suggestions");

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
      const newLogs = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });
      newLogs.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully set the suggestion channel to ${channel}`,
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
        content: `${emojis.success} | Successfully changed suggestion channel to ${channel}`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No suggestion setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed suggestion setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managesuggestion")
  .setDescription("Setup/Remove suggestions")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup suggestions")

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for sending suggestions.")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove suggestions system.")
  );
