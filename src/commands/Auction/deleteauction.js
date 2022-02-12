"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  WebhookClient,
} = require("discord.js");

const Guild = require("../../models/Auction/actions");

const Auction = require("../../models/Auction/items");

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
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    const auctionID = interaction.options.getString("id");

    const itemQuery = await Auction.findOne({ pin: auctionID });

    if (!guildQuery)
      return interaction.reply({
        content: `${emojis.error} | No auction Setup found`,
        ephemeral: true,
      });

    if (!itemQuery)
      return interaction.reply({
        content: `${emojis.error} | No auction found with that ID.`,
        ephemeral: true,
      });

    const achannel = interaction.guild.channels.cache.get(guildQuery.channel);
    if (!achannel)
      return interaction.reply(`${emojis.error} | No auction channel found.`);

    const embed = new MessageEmbed()
      .setTitle(`${emojis.error} | Auction Ended`)
      .setDescription(`**Auction:** This auction has ended`)
      .setColor("RED")
      .setTimestamp();

    const message = itemQuery.message;

    await achannel.messages.fetch(message).then((editm) => {
      editm.edit({ embeds: [embed] });
    });

    interaction.reply({
      content: `${emojis.success} | Auction **deleted**!`,
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
  .setName("deleteaction")
  .setDescription("Delete an auction from another User.")
  .addStringOption((option) =>
    option
      .setName("id")
      .setDescription("Enter the Auction ID you would like to remove")
      .setRequired(true)
  );
