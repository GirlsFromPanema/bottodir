"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Logging/logs");

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

      let webhookid;
      let webhooktoken;

      let newwebhook = await channel
        .createWebhook("Bottodir-Logging", {
          avatar:
            "https://media.discordapp.net/attachments/937076782404878396/941768103807840336/Zofia_Hund_R6.jpg?width=664&height=648",
        })
        .then((webhook) => {
          webhookid = webhook.id;
          webhooktoken = webhook.token;
        });

      const newLogs = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
        webhookid: webhookid,
        webhooktoken: webhooktoken,
      });
      newLogs.save();

      interaction.followUp({
        content: `${emojis.success} | Successfully set the logging Channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      if (channel.type != "GUILD_TEXT") {
        interaction.followUp({
          content: `${emojis.error} | This is not a valid channel!`,
          ephemeral: true,
        });
        return;
      }

      let webhookid;
      let webhooktoken;

      let newwebhook = await channel
        .createWebhook("Bottodir-Logging", {
          avatar:
            "https://media.discordapp.net/attachments/937076782404878396/941768103807840336/Zofia_Hund_R6.jpg?width=664&height=648",
        })
        .then((webhook) => {
          webhookid = webhook.id;
          webhooktoken = webhook.token;
        });

      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
        webhookid: webhookid,
        webhooktoken: webhooktoken,
      });
      await interaction.reply({
        content: `🌀 | Successfully changed logging channel to ${channel}`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No logging setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed logging setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managelogging")
  .setDescription("Setup/Remove modlogs")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup logging messages")

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for sending log messages")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove logging system.")
  );
