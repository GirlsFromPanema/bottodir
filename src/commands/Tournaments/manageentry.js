"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions  } = require("discord.js");

// Database queries
const Guild = require("../../models/Tournaments/tournaments");
const User = require("../../models/Tournaments/usertournament");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 120000,
  users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  if (sub === "join") {

    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    const hasJoined = await User.findOne({ userID: interaction.user.id });

    const tournamentname = isSetup.name;
    const tournamentpin = isSetup.pin;

    // Check if the Server has a tournament going on right one, if yes, cancel.
    if (!isSetup) {
      return interaction.followUp({
        content: `${emojis.error} | There is no tournament.`,
        ephemeral: true,
      });
    }

    if(hasJoined) return interaction.followUp({
      content: `${emojis.error} | Already joined the tournament.`,
      ephemeral: true,
    });

    // Save the user within the database
    const newUser = new User({
        userID: interaction.user.id,
        name: tournamentname,
        pin: tournamentpin
    })
    newUser.save();
    
    interaction.followUp({
      content: `${emojis.success} | Successfully joined tournament \`${tournamentname}\``,
      ephemeral: true,
    });
    
  } else if (sub === "leave") {
    
    // Check if the user is within the tournament
    const hasJoinedTournament = await User.findOne({ userID: interaction.user.id })

    // Check if the Server has a tournament going on right one, if yes, cancel.
    if (!hasJoinedTournament) {
      return interaction.followUp({
        content: `${emojis.error} | You first have to join the Tournament before trying to leave it.`,
        ephemeral: true,
      });
    }
    
    // Delete the user from the database
      hasJoinedTournament.delete();

    interaction.followUp({
      content: `${emojis.success} | Successfully left tournament.`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES]
};

module.exports.data = new SlashCommandBuilder()
  .setName("manageentry")
  .setDescription("Join/Leave tournaments")
  .addSubcommand((sub) =>
    sub.setName("join").setDescription("Join a tournament")
   /* .addStringOption((option) =>
    option
      .setName("pin")
      .setDescription("Enter the pin of the Tournament that you want to join.")
      .setRequired(true)
   ) */
  )
  .addSubcommand((sub) =>
    sub.setName("leave").setDescription("Leave a tournament")
   /* .addStringOption((option) =>
    option
      .setName("pin")
      .setDescription("Enter the pin of the Tournament that should get deleted.")
      .setRequired(true)
   ) */
  );
