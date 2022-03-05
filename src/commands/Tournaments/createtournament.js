"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const Guild = require("../../models/Tournaments/tournaments");
const Tournament = require("../../models/Tournaments/tournaments");

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
    const tournamentname = interaction.options.getString("name");
    const tournamentdate = interaction.options.getString("date");
    const tournamentprice = interaction.options.getString("price");

    const isSetup = await Guild.findOne({ id: interaction.guild.id });

    // Check if the Server has a tournament going on right one, if yes, cancel.
    if (isSetup) {
      return interaction.reply({
        content: `${emojis.error} | There is already a Tournament going on.`,
        ephemeral: true,
      });
    }

    // If no tournament found, create a new one
    const newtournament = new Tournament({
      id: interaction.guild.id,
      name: tournamentname,
      date: tournamentdate,
      price: tournamentprice,
    });
    newtournament.save();

    interaction.reply({
      content: `${emojis.success} | Successfully created ${tournamentname}`,
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
  .setName("createtournament")
  .setDescription("Create a Tournament for your Server")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("What should be the name of the Tournament?")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("date")
      .setDescription("When is the Tournament? Example: 12/12/2022 6PM MESZ")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("price")
      .setDescription("What is the price for the tournament?")
      .setRequired(true)
  );
