"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed, Permissions } = require("discord.js");

// Datbase queries
const Guild = require("../../models/Auction/actions");
const Auction = require("../../models/Auction/items");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

function generateID() {
  var length = 12,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  if (sub === "create") {
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    const userQuery = await Auction.findOne({ userID: interaction.user.id });

    if (!guildQuery)
      return interaction.followUp({
        content: `${emojis.error} | No auction Setup found`,
        ephemeral: true,
      });

    if (userQuery)
      return interaction.followUp({
        content: `${emojis.error} | You can't have more than one auction at once.`,
        ephemeral: true,
      });

    const description = interaction.options.getString("description");
    const budget = interaction.options.getNumber("budget");
    const pin = generateID();

    const user = interaction.user;

    if (description.length >= 30)
      return interaction.followUp({
        content: `${emojis.error} | Description must be less than 30 characters.`,
        ephemeral: true,
      });
    if (budget.length >= 5)
      return interaction.followUp({
        content: `${emojis.error} | Budget must be less than 5 digits.`,
        ephemeral: true,
      });

    const embed = new MessageEmbed()
      .setTitle(`${emojis.diamond} New Auction`)
      .setDescription(
        `
    **By**: ${interaction.user.tag}
    **Description**: ${description}\n
    **Budget**: ${budget}$
    `
      )
      .setFooter({
        text: `PIN: ${pin}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        interaction.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .setTimestamp();

    const userembed = new MessageEmbed()
      .setTitle(`${emojis.success} Auction`)
      .setDescription(
        `
    **Name**: ${interaction.user.tag}
    **Description**: ${description}\n
    **Budget**: ${budget}$

    By creating auctions, you agree to the [Privacy Policy](https://github.com/GirlsFromPanema/bottodir#privacy-policy).
    Admins and Server Owners are allowed to delete your auction any time.
    `
      )
      .setFooter({
        text: `PIN: ${pin}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(
        interaction.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .setTimestamp();

    // Fetch the guilds saved channel and send the embed into it.
    const guild = interaction.client.guilds.cache.get(interaction.guild.id);
    const auctionchannel = guild.channels.cache.get(guildQuery.channel);
    const message = await auctionchannel.send({ embeds: [embed] });

    // Save the data in the db.
    const newAuction = new Auction({
      userID: interaction.user.id,
      description: description,
      message: message.id,
      budget: budget,
      pin: pin,
    });
    newAuction.save();

    interaction.followUp({
      content: `${emojis.success} | Auction created!`,
      ephemeral: true,
    });

    user.send({ embeds: [userembed] });
  } else if (sub === "delete") {
    const guildQuery = await Guild.findOne({ id: interaction.guild.id });
    const auctionID = interaction.options.getString("id");
    const reason = interaction.options.getString("reason");

    const itemQuery = await Auction.findOne({ pin: auctionID });

    if (!guildQuery)
      return interaction.followUp({
        content: `${emojis.error} | No auction Setup found`,
        ephemeral: true,
      });

    if (!itemQuery)
      return interaction.followUp({
        content: `${emojis.error} | No auction found with that ID.`,
        ephemeral: true,
      });

    const achannel = interaction.guild.channels.cache.get(guildQuery.channel);
    if (!achannel)
      return interaction.followUp(
        `${emojis.error} | No auction channel found.`
      );

    const embed = new MessageEmbed()
      .setTitle(`${emojis.error} | Auction Ended`)
      .setDescription(
        `**Auction:** This auction has ended.\n**Moderator**: ${interaction.user.username}\n**Reason**: ${reason}`
      )
      .setColor("RED")
      .setTimestamp();

    const message = itemQuery.message;

    await achannel.messages.fetch(message).then((editm) => {
      editm.edit({ embeds: [embed] });
    });

    itemQuery.delete();

    interaction.followUp({
      content: `${emojis.success} | Auction successfully **deleted**!`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("auctions")
  .setDescription("Create/Delete an auction")
  .addSubcommand((sub) =>
    sub
      .setName("create")
      .setDescription("Create an auction")

      .addStringOption((option) =>
        option
          .setName("description")
          .setDescription("Explain your deal a little bit.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("budget")
          .setDescription("Your budget that you'd like to get/pay.")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("delete")
      .setDescription("Delete an auction")

      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("Enter the Auction ID you would like to remove")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("reason")
          .setDescription("Enter reason for the deletion of the auction")
          .setRequired(true)
      )
  );
