"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const { nodemailer, transport } = require("nodemailer");
const fetch = require("cross-fetch");

// Config files
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 60000 /* in ms */,
  users: new Set(),
};

// only allow owners to run this command
module.exports.ownerOnly = {
  ownerOnly: true
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const ping =  interaction.createdTimestamp - Date.now()

    /*
    async function getInfo() {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });
    
      const info = await transporter.sendMail({
        from: "Panel",
        to: process.env.TO,
        subject: "Logging",
        text: ping,
      });
    }
    getInfo();
    */

    if (ping >= 500) {
      var stat = "🔴";
    } else {
      var stat = "🟢";
    }

    const embed = new MessageEmbed()
      .setTitle("Debug")
      .setDescription(
        `
        Ping: ${stat} ${ping}ms
        
        With a higher ping, the bot may respond slower than usual.
        `
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("debug")
  .setDescription("Debugs the bot");
