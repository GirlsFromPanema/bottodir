"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  Discord,
} = require("discord.js");

// Package utility stuff
const { utc } = require("moment");
const os = require("os");

// Time stuff
const ms = require("ms");
const moment = require("moment");
const momentDurationFormatSetup = require("moment-duration-format");

// Configs
const version = require("../../../package.json").version;
const { msToTimeObj, colorPalette } = require("../../util/util");
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
module.exports.run = async (interaction, utils, client) => {
  try {

    // Database queries
    const Guild = require("../../models/Welcome/welcome");
    const GuildLogs = require("../../models/Logging/logs");
    const GuildTracker = require("../../models/Tracker/guilds");
    const GuildSuggestion = require("../../models/Suggestions/suggestions");

    // Welcoming
    const welcome = await Guild.findOne({ 
      id: interaction.guild.id
    }); 

    // Mod Logs
    const logs = await GuildLogs.findOne({ 
      id: interaction.guild.id 
    });
    
    // Status Tracker
    const tracker = await GuildTracker.findOne({ 
      id: interaction.guildId 
    })

    // Suggestions
    const suggestions = await GuildSuggestion.findOne({
      id: interaction.guild.id
    })

    // Check if they are setup, if yes => on. if not => off.
    let welcomeing = emojis[welcome ? 'on' : 'off']
    let logging = emojis[logs ? 'on' : 'off']
    let tracking = emojis[tracker ? 'on' : 'off']
    let suggest = emojis[suggestions ? 'on' : 'off']

    const timeObj = msToTimeObj(interaction.client.uptime);
    const core = os.cpus()[0];

    const embed = new MessageEmbed()
      .setColor("PURPLE")
      .setTimestamp()
      .addFields({
        name: `${emojis.bot} **Bot Information**`,
        value: `Server: ${emojis.online} Online\n• Ping: ${
          Date.now() - interaction.createdTimestamp
        }\n• Uptime: **${timeObj.days}** days, **${timeObj.hours}** hours, **${
          timeObj.minutes
        }** minutes\n• Node: ${
          process.version
        }\n• Version: v${version}\n• Discord: v13.5.0`,
        inline: true,
      })

      .addFields({
        name: `${emojis.settings} **Server Information**`,
        value: `Server: ${emojis.online} Online\n• Cores: ${os.cpus().length}\n• Mode: ${
          core.model
        }\n • Speed: ${core.speed}MHz\n• RAM: ${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)} MB / ${(process.memoryUsage().rss / 1024 / 1024).toFixed(
          2
        )} MB`,
        inline: true,
      })

      .addFields({
        name: `${emojis.botserver} Server Configuration`,
        value: `Badges: ${emojis.gratis} ${emojis.gold} ${emojis.platin} ${emojis.saphire} ${emojis.diamond}\n• Welcome: ${welcomeing} • Logging: ${logging}\n• Presence: ${tracking} • Suggestions: ${suggest}`,
        inline: false,
      })
      .setFooter({ text: `By: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true})})

    await interaction.reply({ embeds: [embed], ephemeral: false });
    return;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Information about the Bot Server's Server");
