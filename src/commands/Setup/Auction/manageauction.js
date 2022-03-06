"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Auction/actions");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

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

  if (sub === "setup") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    if (!isSetup) {
      if (channel.type != "GUILD_TEXT") {
        interaction.followUp({
          content: `${emojis.error} | This is not a valid channel!`,
          ephemeral: true,
        });
        return;
      }

      const newAuctions = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });
      newAuctions.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully set the auction Channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
      });
      interaction.followUp({
        content: `${emojis.success} | Successfully changed auction channel to ${channel}`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No auction setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed auction setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("manageauction")
  .setDescription("Setup/Remove Auctions")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup auctions")

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for the auctions.")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove auction system.")
  );
