"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageAttachment,
  Discord,
} = require("discord.js");

const Canvas = require("canvas");

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
    const target = interaction.options.getMember("user") || interaction.member;
    if (!target) return;

    const avatar = await Canvas.loadImage(
      target.user.displayAvatarURL({ format: "jpg" })
    );

    let background = await Canvas.loadImage(
      "https://cdn.discordapp.com/attachments/881090885440385074/936589045847453776/SimpCard.png"
    );

    const canvas = Canvas.createCanvas(1280, 720);
    const ctx = canvas.getContext(`2d`);

    ctx.drawImage(background, 0, 0, 1280, 720);
    ctx.drawImage(avatar, 100, 75, 320, 360);
    ctx.font = '45px "Amaranth"';
    ctx.fillText(`${target.user.username}`, 230, 505);
    ctx.fillText(`${interaction.createdAt.toLocaleDateString()}`, 75, 620);

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      "simpcard.jpg"
    );

    interaction.reply({
      content: `If your username contains any non-alphabetical characters, it won't show the username`,
      files: [attachment],
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
  .setName("simpcard")
  .setDescription("Create a simpcard")
  .addUserOption((option) =>
    option.setName("user").setDescription("Select the user").setRequired(false)
  );
