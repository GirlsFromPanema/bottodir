"use strict";

const { PresenceUpdateStatus } = require("discord-api-types/v9");
const { Presence } = require("discord.js");

// Database queries
const Guild = require("../../models/Tracker/guilds.js");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.data = {
    name: "presenceUpdate",
    once: false,
};

/**
 * Handle the presenceUpdate event.
 * @param {Presence} oldPresence The presence before the update, if one at all
 * @param {Presence} newPresence The presence after the update
 */

module.exports.run = async (oldPresence, newPresence) =>
 {
     try
     {
         if (!oldPresence || !oldPresence.user.bot)
             return;
         if (oldPresence.status == newPresence.status)
             return;
 
 
         // find the guild in the database
         const guildQuery = await Guild.findOne({ id: oldPresence.guild.id });
         if (guildQuery)
         {
             // check if the bot is a bot we need to watch
             let checker = (await guildQuery.populate("bots")).bots.find(b => b.id == oldPresence.user.id);
             if(!checker) return;
 
 
             /* Bot went online. */
             if (newPresence.status == PresenceUpdateStatus.Online)
             {
                 newPresence.guild.channels.cache.get(guildQuery.channel)?.send({
                     content: `<@&${guildQuery.role}>`,
                     embeds: [{
                         title: "Bot went online!",
                         description: `Looks like ${newPresence.member.displayName} (${newPresence.user.tag}) just went online!`,
                         color: "GREEN",
                         thumbnail: {
                             url: newPresence.user.avatarURL({ format: "png", size: 1024 }),
                         },
                         timestamp: new Date()
                     }]
                 });
             }
 
             /* Bot went offline. */
             else if (newPresence.status == PresenceUpdateStatus.Offline || newPresence.status == PresenceUpdateStatus.Invisible)
             {
                 newPresence.guild.channels.cache.get(guildQuery.channel)?.send({
                     content: `<@&${guildQuery.role}>`,
                     embeds: [{
                         title: "Bot went offline!",
                         description: `Looks like ${newPresence.member.displayName} (${newPresence.user.tag}) just went offline!`,
                         color: "RED",
                         thumbnail: {
                             url: newPresence.user.avatarURL({ format: "png", size: 1024 }),
                         },
                         timestamp: new Date()
                     }]
                 });
             }
         }
     }
     catch (err)
     {
         return Promise.reject(err);
     }
 };