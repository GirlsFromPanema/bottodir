"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
  length: 120000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const channel = interaction.options.getChannel("channel", true);
    const messagetosend = interaction.options.getString("message");

    const embed = new MessageEmbed()
      .setTitle("📢 New message")
      .setDescription(`Message: ${messagetosend}`)
      .setTimestamp()

    channel.send({ embeds: [embed] })

    await interaction.reply({ content: "Done!", ephemeral: true})
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("sendmessage")
  .setDescription("Send a message into a specific channel")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription(
        "Select the Channel where you want to send the message to"
      )
      .setRequired(true)
  )
  .addStringOption((option) =>
   option
   .setName("message")
   .setDescription("The message you want to send")
   .setRequired(true));
