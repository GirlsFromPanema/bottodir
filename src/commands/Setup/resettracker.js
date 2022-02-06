"use strict";
const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

const Bot = require("../../models/bots.js");
const bot = require("../../models/bots.js");

const Guild = require("../../models/guilds.js");

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

    const isSetup = await Guild.findOne({ id: interaction.guildId });
    const botQuery = await Bot.findOne({ bots: bot.id });
    
    if (!botQuery) return;

    if (isSetup) {

      isSetup.delete()
      botQuery.delete()

      await interaction.reply({
        content: `Sad to see you go, thanks for trying me out!\n\nYou can rerun the Setup anytime you need me again! :D`, ephemeral: true
      });
    } else {
        interaction.reply({ content: "Nothing to remove here.", ephemeral: true})
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
  .setName("resettracker")
  .setDescription("Removes the saved Channel and Role of the Server");
