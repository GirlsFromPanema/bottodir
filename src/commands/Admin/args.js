"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

// only allow owners to run this command
module.exports.ownerOnly = {
  ownerOnly: true,
};

/**
 * Runs args command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const echo = interaction.options.getInteger("int", true); // returning users input as an Echo
    await interaction.reply({ content: echo.toString(), ephemeral: true });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("args")
  .setDescription("Testing Command")
  .addIntegerOption((option) =>
    option.setName("int").setDescription("Enter an integer").setRequired(true)
  );
