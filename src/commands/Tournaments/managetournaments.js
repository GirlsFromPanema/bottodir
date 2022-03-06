"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions  } = require("discord.js");

// Database queries
const Guild = require("../../models/Tournaments/tournaments");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

// generate random ID
function generateID() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  const tournamentname = interaction.options.getString("name");
  const tournamentdate = interaction.options.getString("date");
  const tournamentprice = interaction.options.getString("price");

  const pin = generateID();

  if (sub === "create") {

    const isSetup = await Guild.findOne({ id: interaction.guild.id });

    // Check if the Server has a tournament going on right one, if yes, cancel.
    if (isSetup) {
      return interaction.followUp({
        content: `${emojis.error} | There is a limit of three Tournaments at once.`,
        ephemeral: true,
      });
    }
    
    // If no tournament found, create a new one
    const newtournament = new Guild({
      id: interaction.guild.id,
      pin: pin,
      name: tournamentname,
      date: tournamentdate,
      price: tournamentprice,
    });
    newtournament.save();

    interaction.followUp({
      content: `${emojis.success} | Successfully created ${tournamentname}`,
      ephemeral: true,
    });
    
  } else if (sub === "delete") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id, tournamentPin: pin });

    const tournamentPin = interaction.options.getString("pin");
    const findPin = await Guild.findOne({ tournamentPin: pin });

    if (!isSetup) {
      return interaction.followUp({
        content: `${emojis.error} | There is no Tournament going on.`,
        ephemeral: true,
      });
    }
      isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully ended the Tournament`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managetournaments")
  .setDescription("Create/Delete tournaments")
  .addSubcommand((sub) =>
    sub.setName("create").setDescription("Create a tournament")
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
  )
  )
  .addSubcommand((sub) =>
    sub.setName("delete").setDescription("Delete a tournament")
    .addStringOption((option) =>
    option
      .setName("pin")
      .setDescription("Enter the pin of the Tournament that should get deleted.")
      .setRequired(true)
    )
  );
