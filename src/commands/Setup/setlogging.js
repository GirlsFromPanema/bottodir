"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const Guild = require("../../models/logs");

module.exports.cooldown = {
  length: 43200 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });

    if (!isSetup) {
      const channel = interaction.options.getChannel("channel", true);

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid Channel!",
          ephemeral: true,
        });
        return;
      }

      let webhookid;
      let webhooktoken;

      let newwebhook = await channel
        .createWebhook("Bottodir-Logging", {
          avatar: "https://media.discordapp.net/attachments/937076782404878396/941768103807840336/Zofia_Hund_R6.jpg?width=664&height=648",
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
      interaction.reply({
        content: `✅ | Successfully set the logging Channel to ${channel}`,
        ephemeral: true,
      });
    } else {

      const channel = interaction.options.getChannel("channel")

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid Channel!",
          ephemeral: true,
        });
        return;
      }

      let webhookid;
      let webhooktoken;

      let newwebhook = await channel
        .createWebhook("Bottodir-Logging", {
          avatar: "https://media.discordapp.net/attachments/937076782404878396/941768103807840336/Zofia_Hund_R6.jpg?width=664&height=648",
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
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.ADMINISTRATOR],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("setlogging")
  .setDescription("Setup Logging for your Server")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Select the Channel for the Logs")
      .setRequired(true)
  );
