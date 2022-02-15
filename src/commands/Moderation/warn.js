"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  ReactionUserManager,
} = require("discord.js");

// User profile
const warnModel = require("../../models/Moderation/warning");

// Logging
const Guild = require("../../models/Logging/logs");

// Configs
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
    const target = interaction.options.getMember("target");
    const reason = interaction.options.getString("reason") || "No reason";

    if (
      target.roles.highest.position >=
      interaction.guild.me.roles.highest.position
    )
      return interaction.reply({
        content:
          "I cannot warn this user as their highest role is higher than mine or I have the same highest role as them.",
        ephemeral: true,
      });

    if (target.id === interaction.guild.ownerId)
      return interaction.reply({
        content: "I cannot warn the owner of the server.",
        ephemeral: true,
      });

    if (target.id === interaction.user.id)
      return interaction.reply({
        content: "You cannot warn yourself.",
        ephemeral: true,
      });

    if (target.id === interaction.guild.me.id)
      return interaction.reply({
        content: "I cannot warn myself.",
        ephemeral: true,
      });

    const e = new MessageEmbed();
    e.setDescription(`Are you sure you want to warn ${target.user.username}?`);
    e.setColor("BLUE");
    const components = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("YES")
        .setLabel("Yes")
        .setStyle("SUCCESS"),

      new MessageButton().setCustomId("NO").setLabel("No").setStyle("DANGER")
    );

    const msg = await interaction.reply({
      embeds: [e],
      components: [components],
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = msg.channel.createMessageComponentCollector({
      filter,
      time: 90000,
    });

    const e2 = new MessageEmbed();
    e2.setDescription(
      `✅ | User has been warned\n\nUser: ${target.user.tag}\nModerator: ${interaction.user.tag}\nReason: \`${reason}\` `
    );
    e2.setColor("GREEN");
    e2.setTimestamp();

    const targetembed = new MessageEmbed()
      .setTitle(":x: | You have been warned")
      .setDescription(
        `You have been warned on **${interaction.guild.name}**\nModerator: ${interaction.user.tag}\nReason: ${reason}`
      )
      .setColor("RED")
      .setTimestamp();

    const e3 = new MessageEmbed();
    e3.setDescription("❌ | Action was canceled!");
    e3.setColor("RED");

    // Set the collector on the buttons - if "YES" -> save to database
    collector.on("collect", async (i) => {
      if (i.customId === "YES") {
        interaction.editReply({
          embeds: [e2],
          components: [],
          ephemeral: true,
        });

        new warnModel({
          userId: target.id,
          guildId: interaction.guildId,
          moderatorId: interaction.member.id,
          reason,
          timestamp: Date.now(),
        }).save();

        try {
          await target.send({ embeds: [targetembed] });
        } catch(error) {
          interaction.followUp({
           content: `${emojis.error} | Could not send warning to the User.\nSaved warning in the Database.`, ephemeral: true
          });
          console.log(error)
          return;
        }

        // fetch the logs channel of the guild, then send the embed.
        const guildQuery = await Guild.findOne({ id: interaction.guild.id });

        if (guildQuery) {
          const webhookid = guildQuery.webhookid;
          const webhooktoken = guildQuery.webhooktoken;

          const webhookClient = new WebhookClient({
            id: webhookid,
            token: webhooktoken,
          });

          webhookClient.send({ embeds: [e2] });
        }

        collector.stop("success");
      } else if (i.customId === "NO") {
        interaction.editReply({
          embeds: [e3],
          components: [],
          ephemeral: true,
        });
        collector.stop("success");
      }
    });
    const e4 = new MessageEmbed();
    e4.setDescription("You took too much time! timed out");
    e4.setColor("RED");
    collector.on("end", async (ignore, error) => {
      collector.stop("success");
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
  .setName("warn")
  .setDescription("Warn a User")
  .addUserOption((option) =>
    option
      .setName("target")
      .setDescription("Select the User to warn")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide a Reason to warn")
      .setRequired(true)
  );
