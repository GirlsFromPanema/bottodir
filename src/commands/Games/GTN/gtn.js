"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const Guild = require("../../../models/Games/gtn");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

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
    const ranNum = Math.round(Math.random() * 1000);
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const number = interaction.options.getNumber("number") || ranNum;

    if (channel.type != "GUILD_TEXT") {
      interaction.reply({
        content: `${emojis.error} | This is not a valid channel!`,
        ephemeral: true,
      });
      return;
    }

    if (number === 0)
      return interaction.reply({
        content: `${emojis.error} | Number can't be 0.`,
        ephemeral: true,
      });

    const isRunning = await Guild.findOne({ id: interaction.guild.id });
    if (isRunning)
      return interaction.reply({
        content: `${emojis.error} | A GTN Event is already running.`,
        ephemeral: true,
      });

    const newEvent = new Guild({
      id: interaction.guild.id,
      channel: channel.id,
      number: number,
    });
    newEvent.save();

    const embed = new MessageEmbed()
      .setTitle(`${emojis.diamond} New Event`)
      .setDescription(
        `A new Event has started!\n\nGuess the number between \`1 - 1000\`.`
      )
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    interaction.reply({
      content: `${emojis.success} | Successfully started Guess the Number Event in ${channel}`,
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
  .setName("gtn")
  .setDescription("Setup a Guess the Number Event")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Select the Channel for the Event")
      .setRequired(false)
  )
  .addNumberOption((option) =>
    option
      .setName("number")
      .setDescription("What Number should be guessed?")
      .setRequired(false)
  );
