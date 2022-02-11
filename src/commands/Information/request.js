"use strict";

const { SlashCommandBuilder, ActionRow } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");

const config = require("../../../Controller/owners.json");

const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 180000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const reason = interaction.options.getString("reason");
    const user = interaction.user;
    const masterLogger = interaction.client.channels.cache.get(config.channel);

    // interaction.reply({ content: `${emojis.ploading} processing ...`, ephemeral: true })

    const logembed = new MessageEmbed()
      .setTitle(`${emojis.notify} Data Delete Request`)
      .setDescription(
        `${interaction.user.tag} | ${interaction.user.id} has requested to delete their data.\nReason: ${reason}`
      )
      .setColor("DARK_RED")
      .setAuthor({
        name: `By: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    const components = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("ACCEPT")
        .setLabel("Accept")
        .setStyle("SUCCESS"),

      new MessageButton()
        .setCustomId("DECLINE")
        .setLabel("Decline")
        .setStyle("DANGER")
    );

    const userlogs = new MessageEmbed()
      .setTitle(`${emojis.success} Successfully sent request`)
      .setDescription(
        `
        **User**: \`${interaction.user.tag}\`
        **Reason**: \`${reason}\`\n\nYou request will be reviewed within the next \`3\` days.\nThanks for using me.`
      )
      .setColor("GREEN")
      .setTimestamp();

    const successlogs = new MessageEmbed()
      .setTitle(`${emojis.notify} Profile Message`)
      .setDescription(
        `
        **User**: \`${interaction.user.tag}\`
        **Reason**: \`${reason}\`\n\nYou recently requested to delete your data.\nYour request has been accepted.`
      )
      .setColor("GREEN")
      .setTimestamp();

    const failedlogs = new MessageEmbed()
      .setTitle(`${emojis.notify} Profile Message`)
      .setDescription(
        `
        **User**: \`${interaction.user.tag}\`
        **Reason**: \`${reason}\`\n\nYou recently requested to delete your data.\nYour request has been rejected.`
      )
      .setColor("RED")
      .setTimestamp();

    const e4 = new MessageEmbed()
      .setDescription(`${emojis.error} failed to proceed request.`)
      .setColor("RED")
      .setTimestamp();

    const msg = await masterLogger.send({
      embeds: [logembed],
      components: [components],
      fetchReply: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = msg.channel.createMessageComponentCollector({
      filter,
      time: 864000000,
    });

    const e2 = new MessageEmbed();
    e2.setDescription(
      `✅ | Accepted Request\n\nModerator: ${interaction.user.tag}`
    );
    e2.setColor("GREEN");
    e2.setTimestamp();

    const e3 = new MessageEmbed();
    e3.setDescription("❌ | Action was canceled!");
    e3.setColor("RED");

  
    collector.on("collect", async (i) => {
      if (i.customId === "ACCEPT") {
        masterLogger.send({ embeds: [e2], components: [], ephemeral: true });

        const row = i.message.components
        msg.edit({
          components: row.map(e => {
              e.components = e.components.map(btn => {
                btn.disabled = true
                  return btn
              })
              return e
          })
      })
        user.send({ embeds: [successlogs] });
        collector.stop("success");
      } else if (i.customId === "DECLINE") {
        user.send({
          embeds: [failedlogs],
          components: [],
        });

        msg.components.map((row) =>
          row.setComponents(row.components.map((c) => c.setDisabled(true)))
        );

        collector.stop("success");
      }
    });

    collector.on("end", async (ignore, error) => {
      if (error && error !== "success") {
        masterLogger.send({
          embeds: [e4],
          components: [],
          ephemeral: true,
        });
      }
      collector.stop("success");
    });

    user.send({ embeds: [userlogs] });
    interaction.reply({
      content: `${emojis.success} | Successfully sent request`,
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("request")
  .setDescription("Request a deletion of your data")
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("Provide the reason for the deletion")
      .setRequired(true)
  );
