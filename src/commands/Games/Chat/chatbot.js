"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const emojis = require("../../../../Controller/emojis/emojis");

const Guild = require("../../../models/Games/chatbot");

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
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    const hasChatbot = await Guild.findOne({ id: interaction.guild.id });

    if (channel.type != "GUILD_TEXT") {
      interaction.reply({
        content: ":x: | This is not a valid channel!",
        ephemeral: true,
      });
      return;
    }

    // If there is no data, create new data. If there is, update it to the new channel. 
    if (!hasChatbot) {
      const newBot = new Guild({
        id: interaction.guild.id,
        channel: channel.id,
      });
      newBot.save();
      interaction.reply({
        content: `${emojis.success} | Successfully set Chatbot to ${channel}`,
        ephemeral: true,
      });
    } else {
      const channel =
        interaction.options.getChannel("channel") || interaction.channel;

      if (channel.type != "GUILD_TEXT") {
        interaction.reply({
          content: ":x: | This is not a valid channel!",
          ephemeral: true,
        });
        return;
      }

      await Guild.findOneAndUpdate({
        id: interaction.guild.id,
        channel: channel.id,
      });
      interaction.reply({
        content: `${emojis.success} | Successfully updated Chatbot to ${channel}`,
        ephemeral: true,
      });
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
  .setName("chatbot")
  .setDescription("Setup the Chatbot for your Server")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("Which channel should be used?")
      .setRequired(false)
  );
