"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Tracker/guilds");

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
    const role = interaction.options.getRole("role", true);

    if (!isSetup) {
      if (channel.type != "GUILD_TEXT") {
        interaction.followUp({
          content: `${emojis.error} | This is not a valid channel!`,
          ephemeral: true,
        });
        return;
      }

      const newGuild = new Guild({
        id: interaction.guildId,
        role: role.id,
        channel: channel.id,
      });
      newGuild.save();

      interaction.followUp({
        content: `${emojis.success} | Successfully set the tracking Channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      await Guild.findOneAndUpdate({
        id: interaction.guildId,
        role: role.id,
        channel: channel.id,
      });

      await interaction.followUp({
        content: `🌀 | Successfully changed tracking channel to ${channel}`,
        ephemeral: true,
      });
    }
  } else if (sub === "remove") {
    const isSetup = await Guild.findOne({ id: interaction.guild.id });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No logging setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed tracking setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managetracker")
  .setDescription("Setup/Remove tracker")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup tracking messages")
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription(
            "The role you wish to be pinged on a bot status change."
          )
          .setRequired(true)
      )

      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for sending status messages")
          .setRequired(false)
      )
      
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove tracking system.")
  );
