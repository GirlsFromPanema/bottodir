"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const voucher_codes = require('voucher-code-generator');

const config = require("../../owners.json");

const client = require("../../../src/util/bot");

const emojis = require("../../emojis/emojis");

module.exports.cooldown = {
  length: 90000,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {

    const masterLogger = interaction.client.channels.cache.get(config.channel);
    if (!masterLogger) return interaction.reply({ content: `${emojis.error} | You cannot do that right now, try again later.`, ephemeral: true })

    const supportcode = voucher_codes.generate({
        pattern: '####-####'
    })

    const finalcode = supportcode.toLocaleString()
    
    const logs = new MessageEmbed()
      .setTitle(`${emojis.notify} Data deletion`)
      .setDescription(
        `
        **User**: \`${interaction.user.tag} | ${interaction.user.id}\`
        **Action**: Requested data deletion.
        `
      )
      .setColor("GREEN")
      .setTimestamp();

    const userconf = new MessageEmbed()
      .setTitle(`${emojis.notify} Notification`)
      .setDescription(
        `
        Hello there, ${interaction.user.tag}.
        You have recently requested a deletion of you data.
        We have successfully received your request and you collected data will be deleted within two days.\n
        Support ID: \`${finalcode}\`
        If you have any questions, contact us here: \`blacktipemodding@gmail.com\`
        `
      )
      .setColor("GREEN")
      .setTimestamp();  

    interaction.reply({ content: `${emojis.ploading} | Processing ...`, ephemeral: true });

    setTimeout(function() {
        interaction.followUp({ content: `${emojis.success} | Successfully sent request.\nCheck your direct messages for more information.`, ephemeral: true })
        interaction.user.send({ embeds: [userconf] })
    }, 10000)

    masterLogger.send({ embeds: [logs] });
   
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
  .setDescription("Request a deletion of your collected Data");
