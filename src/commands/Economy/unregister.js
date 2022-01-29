"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton, Interaction } = require("discord.js");
const moment = require("moment")
const economySchema = require("../../models/Economy/usereconomy");
const emojis = require("../../../Controller/emojis/emojis");
const config = require("../../../Controller/owners.json");

module.exports.cooldown = {
  length: 500000 /* in ms */,
  users: new Set(),
};

/**
 * Runs ping command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const masterLogger = interaction.client.channels.cache.get(config.channel);

    // Check if the User is registered
    const isRegistered = await economySchema.findOne({
      userID: interaction.user.id,
    });

    // If the user isnt registered/if there is no data, dont do anything.
    if (!isRegistered)
      return interaction.reply({
        content: `${emojis.error} | You first have to \`register\` to be able to unregister.`,
        ephemeral: true,
      });

    const verify = `${emojis.success}`;
    const cancel = `${emojis.error}`;

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("verify")
          .setEmoji(verify)
          .setStyle("SUCCESS")
          .setLabel("Yes")
          .setDisabled(state),
        new MessageButton()
          .setCustomId("deny")
          .setEmoji(cancel)
          .setStyle("DANGER")
          .setLabel("No")
          .setDisabled(state)
      ),
    ];

    const initialEmbed = new MessageEmbed()
      .setTitle("UNREGISTER")
      .setDescription(
        `Are you sure you want to uregister yourself from the economy system?`
      )
      .addField(
        "\u200b",
        `
                Click ${verify} to unregister.
                Click ${cancel} to cancel the unregistration.
      `
      );
    const initialMessage = await interaction.reply({
      embeds: [initialEmbed],
      components: components(false),
      fetchReply: true,
    });

    const filter = (i) => {
      if (i.user.id === interaction.user.id) return true;
      else i.reply({ content: "This is not for you!", ephemeral: true });
    };

    const collector = initialMessage.channel.createMessageComponentCollector({
      filter,
      time: 20000,
      max: 1,
    });

    collector.on("collect", async (interaction, user) => {
      interaction.deferUpdate();
      if (interaction.customId === "verify") {
        const editEmbed = new MessageEmbed()
          .setTitle("UNREGISTERED")
          .setDescription(`${emojis.success} Successfully deleted your Data.`)
          .setFooter({
            text: `Requested by: ${interaction.user.username}`,
            displayAvatarURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp()
          .setColor("RANDOM");

        initialMessage.edit({
          embeds: [editEmbed],
          components: components(true),
        });

        // Delete the Users data if he clicks "verify"
        isRegistered.delete();
      } else if (interaction.customId === "deny") {
        const editEmbed = new MessageEmbed()
          .setTitle("CANCELLED")
          .setDescription(
            `You \`cancelled\` your unregistration from the economic system.`
          )
          .setColor("RANDOM");

        initialMessage.edit({
          embeds: [editEmbed],
          components: components(true),
        });
      }

      const logs = new MessageEmbed()
        .setTitle(`${emojis.error} Unregistered`)
        .setDescription(
          `
        **Actioned by**: \`${interaction.user.tag}\`
        **Date**: \`${moment((Date.now() * 1000) / 1000).fromNow()}\`
        `
        )
        .setColor("GREEN")
        .setTimestamp();

      /*
        if(masterLogger) {
            masterLogger.send({ embeds: [logs] })
        }
        */

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
  .setName("unregister")
  .setDescription("Unregister from the Economy System");
