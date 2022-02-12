"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Databae queries
const Guild = require("../../models/Polls/polls");

// Config files
const emojis = require("../../../Controller/emojis/emojis");

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
    const hasSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!hasSetup)
      return interaction.reply({
        content: `${emojis.error} | You first have to setup polls to be able to create polls.\nSimply run \`setpolls <channel>\``,
        ephemeral: true,
      });

    const question = interaction.options.getString("question");

    const embed = new MessageEmbed()
      .setTitle(`${emojis.notify} New Poll`)
      .setDescription(
        `${question}?\n\nClick ${emojis.success} to upvote.\nClick ${emojis.error} to downvote.`
      )
      .setTimestamp()
      .setFooter({
        text: `From: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setColor("#36393F");

    const guild = interaction.client.guilds.cache.get(interaction.guild.id);
    const pollchannel = guild.channels.cache.get(hasSetup.channel);
    const message = await pollchannel.send({ embeds: [embed] });

    await message.react(`${emojis.success}`);
    await message.react(`${emojis.error}`);

    interaction.reply({
      content: `${emojis.success} | Successfully sent poll.`,
      ephemeral: true,
      fetchReply: true,
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
  .setName("createpoll")
  .setDescription("Create a poll for the Server")
  .addStringOption((option) =>
    option
      .setName("question")
      .setDescription("What is the question for the poll?")
      .setRequired(true)
  );
