"use strict";

const { GuildMember, MessageEmbed, WebhookClient } = require("discord.js");
const moment = require("moment");

// Database queries
const Guild = require("../../models/Admin/guildblacklist");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const client = require("../../util/bot.js");

module.exports.data = {
  name: "guildCreate",
  once: false,
};

/**
 * Handle the clients event.
 * @param {GuildMember} member The client that triggered the event.
 */

module.exports.run = async (guild) => {
  try {
    
    const isBlacklisted = await Guild.findOne({ id: guild.id })
    if(!isBlacklisted) return;

    await guild.leave();
    console.log("Left blacklisted guild.")

  } catch (err) {
    return Promise.reject(err);
  }
};
