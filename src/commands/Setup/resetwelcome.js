"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const Guild = require("../../models/welcome");

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

    // Find the Guild in the Database
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
  
    // If no setup, return
    if (!isSetup) {
        return interaction.reply({ content: `${emojis.error} | You first have to setup the Guild before deleting it`, ephemeral: true })
    }

    // If setup, delete data.
    if(isSetup) {
        isSetup.delete()
        interaction.reply({ content: `${emojis.success} | Successfully deleted welcome module `, ephemeral: true})
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
  .setName("resetwelcome")
  .setDescription("Reset the Welcome Module on your Server")
