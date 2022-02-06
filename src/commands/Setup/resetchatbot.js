"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

const emojis = require("./../../../Controller/emojis/emojis");

const Guild = require("../../models/Games/chatbot");

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Sets up the bot for first use.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {

    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    
    if(!isSetup) return interaction.reply({ content: `${emojis.error} | No setup for chat bot found.`, ephemeral: true })

    isSetup.delete();

    interaction.reply({ content: `${emojis.success} | Successfully deleted chatbot.`, ephemeral: true })
    
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("resetchatbot")
  .setDescription("Removes the saved channel for the chat bot");
