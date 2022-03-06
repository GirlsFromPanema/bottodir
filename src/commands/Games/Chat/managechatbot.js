"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Games/chatbot");

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

    const hasChatbot = await Guild.findOne({ id: interaction.guild.id });

    if (channel.type != "GUILD_TEXT") {
      interaction.followUp({
        content: `${emojis.error} | This is not a valid channel!`,
        ephemeral: true,
      });
      return;
    }

    // If no setup, create new data
    if (!hasChatbot) {
      const newBot = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });
      newBot.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully set Chatbot to ${channel}.`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const hasChatbot = await Guild.findOne({ id: interaction.guild.id });
    if (!hasChatbot)
      return interaction.followUp({
        content: `${emojis.error} | No Chatbot setup found.`,
        ephemeral: true,
      });
    hasChatbot.delete();

    interaction.followUp({
      content: `${emojis.success} | Successfully removed Chatbot.`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managechatbot")
  .setDescription("Setup/Remove Chatbot")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup Chatbot")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for the Chatbot")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove the Chatbot Setup")
  );
