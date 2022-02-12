"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

// Database queries
const Guild = require("../../models/Suggestions/suggestions"); // For guild
const UserSuggestion = require("../../models/Suggestions/usersuggestions"); // Users suggestions

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

    const suggestionid = interaction.options.getString("id");

    // Query the guild and the user for the suggestions
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    const suggestionQuery = await UserSuggestion.findOne({ pin: suggestionid });

    // Get the suggestion (message)
    const suggestionmessage = suggestionQuery.suggestion;
    
    if (!guildQuery)
      return interaction.reply({
        content: `${emojis.error} | No suggestion setup found`,
        ephemeral: true,
      });

    if (!suggestionQuery)
      return interaction.reply({
        content: `${emojis.error} | No suggestion found with that ID.`,
        ephemeral: true,
      });

    const schannel = interaction.guild.channels.cache.get(guildQuery.channel);
    if (!schannel)
      return interaction.reply(`${emojis.error} | No suggestion channel found.`);

    const embed = new MessageEmbed()
      .setTitle(`${emojis.error} | Suggestion denied`)
      .setDescription(`${suggestionmessage}\n\nSadly, this suggestion is not good enough.`)
      .setColor("RED")
      .setFooter({ text: `Bottdir :: Suggestions`, iconURL: interaction.guild.iconURL({ dynamic: true })})
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();

    // Fetch the message, edit it and remove all reactions
    const message = suggestionQuery.message;

    await schannel.messages.fetch(message).then((editm) => {
      editm.edit({ embeds: [embed] })
      editm.reactions.removeAll()
    });

    // Delete suggestion from database.
    suggestionQuery.delete();

    interaction.reply({
      content: `${emojis.success} | Suggestion successfully **denied**!`,
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
  .setName("denysuggestion")
  .setDescription("Deny a suggestion.")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("Enter the Suggestion ID you would like to deny")
      .setRequired(true)
  )
  
