"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageAttachment, Discord } = require("discord.js");

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

    let back = await Canvas.loadImage(
      "https://cdn.discordapp.com/attachments/847044835412148234/937107418595340378/memestealinglicense.png"
    );

    const canvas = Canvas.createCanvas(775, 575);
    const ctx = canvas.getContext(`2d`);

    ctx.font = '65px "Keripik"';
    ctx.drawImage(back, 0, 0, 775, 575);
    ctx.drawImage(avatar, 25, 75, 230, 280);
    ctx.fillText(`${target.user.username}`, 415, 175);

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      "license.jpg"
    );

    interaction.reply({ content: `If your username contains any non-alphabetical characters, it won't show the username`, files: [attachment] })
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("steal")
  .setDescription("Create a steal a meme canvas card")
  .addUserOption((option) =>
    option.setName("user").setDescription("Select the user").setRequired(false)
  );
