"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Welcome/leave");

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
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    if (!isSetup) {
      if (channel.type != "GUILD_TEXT") {
        interaction.followUp({
          content: `${emojis.error} | This is not a valid channel!`,
          ephemeral: true,
        });
        return;
      }

      const newAuctions = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });
      newAuctions.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully set the leave Channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
      });
      interaction.followUp({
        content: `${emojis.success} | Successfully changed leave channel to ${channel}`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No leave setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed leave setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("manageleave")
  .setDescription("Setup/Remove leave messages")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup leave messages")

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for sending leave messages")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove leave system.")
  );
