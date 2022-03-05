"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const Guild = require("../../models/Tournaments/tournaments");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 90000 /* in ms */,
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
      return interaction.reply({
        content: `${emojis.error} | There is no Tournament going on.`,
        ephemeral: true,
      });
    }
    isSetup.delete();
    interaction.reply({
      content: `${emojis.success} | Successfully ended the Tournament`,
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("endtournament")
  .setDescription("End the Tournament on your Server");
