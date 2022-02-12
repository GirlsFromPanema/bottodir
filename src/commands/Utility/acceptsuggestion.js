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

    const guildQuery = await Guild.findOne({ id: interaction.guild.id });

    const suggestionQuery = await UserSuggestion.findOne({ pin: suggestionid });

    const suggestionmessage = suggestionQuery.suggestion;
    const suggestionuser = suggestionQuery.userID;

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
      .setTitle(`${emojis.success} | Suggestion accepted`)
      .setDescription(`${suggestionmessage}\n\nThanks for this cool idea!`)
      .setColor("RED")
      .setFooter({ text: `Bottdir :: Suggestions`, iconURL: interaction.guild.iconURL({ dynamic: true })})
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setTimestamp();

    const message = suggestionQuery.message;

    await schannel.messages.fetch(message).then((editm) => {
      editm.edit({ embeds: [embed] })
    });

    await schannel.messages.fetch(message).then((reactionss) => {
        reactionss.reactions.removeAll()
    })
   
    suggestionQuery.delete();

    interaction.reply({
      content: `${emojis.success} | Suggestion successfully **accepted**!`,
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
  .setName("acceptsuggestion")
  .setDescription("Accepts a suggestion.")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("Enter the Suggestion ID you would like to accept")
      .setRequired(true)
  )
  
