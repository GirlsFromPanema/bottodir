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

    // Find the Guild in the Database
    const isSetup = await Guild.findOne({ id: interaction.guild.id });

    // If its not in the Database, check if the User mentioned a valid channel, if yes, save it to the Database
    if (!isSetup) {
      const channel = interaction.options.getChannel("channel", true);

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid Channel!",
          ephemeral: true,
        });
        return;
      }

      const newLogs = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });

      // Save guild id and channel id (unique)
      newLogs.save();
      interaction.reply({
        content: `✅ | Successfully set the Logging Channel to ${channel}`, ephemeral: true});

      // If the Guild has already done the Setup before, update it to the new channel
    } else {
      const channel = interaction.options.getChannel("channel", true);

      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
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
