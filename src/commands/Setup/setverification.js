"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const GuildVerification = require("../../models/verification");

module.exports.cooldown = {
  length: 30000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {

    const embed = new MessageEmbed()
    .setTitle("Verification")
    .setDescription(`Verify for ${interaction.guild.name}!`)
    .setFooter({ text: `Verify with /verify`, iconURL: interaction.guild.iconURL({ dynamic: true })})
    .setTimestamp()

    const isSetup = await GuildVerification.findOne({
      id: interaction.guild.id,
    });

    const role = interaction.options.getRole("role");

    if (!isSetup) {
      const channel = interaction.options.getChannel("channel", true);

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid Channel!",
          ephemeral: true,
        });
        return;
      }

      if (!role) {
        interaction.reply({
          content: ":x: | This is not a valid Role!",
          ephemeral: true,
        });
      }

      const newVerification = new GuildVerification({
        id: interaction.guild.id,
        channel: channel.id,
        role: role.id,
      });

      newVerification.save();
      interaction.reply({
        content: `✅ | Successfully set the Verification Channel to ${channel}.`, ephemeral: true
      });

      channel.send({ embeds: [embed]})
    } else {

      const embed2 = new MessageEmbed()
      .setTitle(`${emojis.server} Verify`)
      .setDescription(`Verification for ${interaction.guild.name}.\n\nSimply run`)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setImage(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: `Server: ${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true })})
      .setColor("GREEN")
      .setTimestamp()

      const channel = interaction.options.getChannel("channel", true);

      await GuildVerification.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
        role: role.id,
      });
      await interaction.reply({
        content: `🌀 | Successfully updated Verification channel to ${channel} with the ${role} Role`,
        ephemeral: true,
      });

      channel.send({ embeds: [embed2] })
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("setverification")
  .setDescription("Setup verification for your Server.")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Select the Channel for verification")
      .setRequired(true)
  )
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("Set the role the users should receive when verifying")
      .setRequired(true)
  );
