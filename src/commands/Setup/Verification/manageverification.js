"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const GuildVerification = require("../../../models/Verification/verification");

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

  const embed = new MessageEmbed()
    .setTitle("Verification")
    .setDescription(`Verify for ${interaction.guild.name}!`)
    .setFooter({
      text: `Verify with /verify`,
      iconURL: interaction.guild.iconURL({ dynamic: true }),
    })
    .setTimestamp();

  if (sub === "setup") {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    const role = interaction.options.getRole("role");

    if (channel.type != "GUILD_TEXT") {
      interaction.followUp({
        content: `${emojis.error} | This is not a valid channel!`,
        ephemeral: true,
      });
      return;
    }

    if (!role) {
      interaction.reply({
        content: `${emojis.error} | This is not a valid Role.`,
        ephemeral: true,
      });
    }

    const guildQuery = await GuildVerification.findOne({
      id: interaction.guild.id,
    });

    if (!guildQuery) {
      const newVerification = new GuildVerification({
        id: interaction.guild.id,
        role: role.id,
        channel: channel.id,
      });
      newVerification.save();
      interaction.followUp({
        content: `${emojis.success} | Successfully set the verification channel to ${channel}`,
        ephemeral: true,
      });
    } else {
      if (channel.type != "GUILD_TEXT") {
        interaction.followUp({
          content: `${emojis.error} | This is not a valid channel!`,
          ephemeral: true,
        });
        return;
      }

      await GuildVerification.findOneAndUpdate({
        id: interaction.guild.id,
        role: role.id,
        channel: channel.id,
      });
      interaction.reply({
        content: `${emojis.success} | Successfully changed verification channel to ${channel}`,
        ephemeral: true,
      });
      channel.send({ embeds: [embed] });
    }
  } else if (sub === "remove") {
    const isSetup = await GuildVerification.findOne({
      id: interaction.guild.id,
    });
    if (!isSetup)
      return interaction.followUp({
        content: `${emojis.error} | No verification setup found.`,
        ephemeral: true,
      });

    isSetup.delete();
    interaction.followUp({
      content: `${emojis.success} | Successfully removed verification setup`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("manageverification")
  .setDescription("Setup/Remove verification")
  .addSubcommand((sub) =>
    sub
      .setName("setup")
      .setDescription("Setup verification")

      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Select the role for verifications.")
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Select the channel for verifications.")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("remove").setDescription("Remove verification system.")
  );
