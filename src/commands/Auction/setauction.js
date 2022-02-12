"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const Guild = require("../../models/Auction/actions");

const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000 /* in ms */,
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
      const channel = interaction.options.getChannel("channel");

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid Channel!",
          ephemeral: true,
        });
        return;
      }

      const newAuctions = new Guild({
        id: interaction.guild.id,
        channel: channel.id
      });

      newAuctions.save();
      interaction.reply({
        content: `✅ | Successfully set the auction Channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      const channel = interaction.options.getChannel("channel");

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid Channel!",
          ephemeral: true,
        });
        return;
      }

      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id
      });
      await interaction.reply({
        content: `🌀 | Successfully changed auction channel to ${channel}`,
        ephemeral: true,
      });
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("setauction")
  .setDescription("Setup auction")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Set the channel for auctions")
      .setRequired(true)
  );
