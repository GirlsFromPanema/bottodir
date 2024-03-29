"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../models/Suggestions/suggestions"); // For guild
const UserSuggestion = require("../../models/Suggestions/usersuggestions"); // Users suggestions

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  if (sub === "accept") {
    const suggestionid = interaction.options.getString("id");

    // Query the guild and the user for the suggestions
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    const suggestionQuery = await UserSuggestion.findOne({ pin: suggestionid });

    // Get the suggestion (message)
    const suggestionmessage = suggestionQuery.suggestion;
    const suggestionbyuser = suggestionQuery.userID.tag;

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
      return interaction.reply(
        `${emojis.error} | No suggestion channel found.`
      );

    const embed = new MessageEmbed()
      .setTitle(`${emojis.success} | Suggestion accepted`)
      .setDescription(`**${suggestionmessage}**\nBy <@${suggestionbyuser}>\n💝 Thanks for this cool idea!`)
      .setColor("RED")
      .setFooter({
        text: `Bottodir:: Suggestions`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();

    // Fetch the message, edit it and remove all reactions
    const message = suggestionQuery.message;

    // Fetch the message with the suggestion and edit the message
    await schannel.messages.fetch(message).then((editm) => {
      editm.edit({ embeds: [embed] });
      editm.reactions.removeAll();
    });

    // Delete suggestion from database.
    suggestionQuery.delete();

    interaction.followUp({
      content: `${emojis.success} | Suggestion successfully **accepted**!`,
      ephemeral: true,
    });
  } else if (sub === "deny") {
    const suggestionid = interaction.options.getString("id");

    // Query the guild and the user for the suggestions
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    const suggestionQuery = await UserSuggestion.findOne({ pin: suggestionid });

    // Get the suggestion (message)
    const suggestionmessage = suggestionQuery.suggestion;
    const suggestionbyuser = suggestionQuery.userID;

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
      return interaction.reply(
        `${emojis.error} | No suggestion channel found.`
      );

    const embed = new MessageEmbed()
      .setTitle(`${emojis.error} | Suggestion denied`)
      .setDescription(
        `**${suggestionmessage}**\nBy <@${suggestionbyuser}>\n😟 Sadly, this suggestion wasn't good enough.`
      )
      .setColor("RED")
      .setFooter({
        text: `Bottodir:: Suggestions`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();

    // Fetch the message, edit it and remove all reactions
    const message = suggestionQuery.message;

    // Fetch the message with the suggestion and edit the message
    await schannel.messages.fetch(message).then((editm) => {
      editm.edit({ embeds: [embed] });
      editm.reactions.removeAll();
    });

    // Delete suggestion from database.
    suggestionQuery.delete();

    interaction.followUp({
      content: `${emojis.success} | Suggestion successfully **denied**!`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("suggestions")
  .setDescription("Accept or deny a suggestion")
  .addSubcommand((sub) =>
    sub
      .setName("accept")
      .setDescription("Accept a suggestion")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Enter the Suggestion ID you would like to accept")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("deny")
      .setDescription("Deny a suggestion")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Enter the Suggestion ID you would like to accept")
          .setRequired(true)
      )
  );
