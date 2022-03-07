"use strict";

const { GuildMember, MessageEmbed, WebhookClient, CommandInteraction } = require("discord.js");
const ms = require("moment");

// Database queries
const Guild = require("../models/Antiscam/antiscam");
const Logs = require("../models/Logging/logs");

// Configs
const emojis = require("../../Controller/emojis/emojis");
const array = require("../Data/scam.json");
const config = require("../../Controller/owners.json");

module.exports.data = {
    name: "messageCreate",
    once: false,
};

/**
 * Handle the clients event.
 * @param {GuildMember} member The client that triggered the event.
 * @param {CommandInteraction} interaction The Command Interaciton
 */

module.exports.run = async(message) => {
    try {
        const hasSetup = await Guild.findOne({ id: message.guild.id });
        const guildowner = await message.guild.fetchOwner();

        // If the Guild has no setup done, dont do anything/ignore it.
        if (!hasSetup) return;
        if (message.author.id === guildowner) return;
        if (config.owner.includes(message.author.id)) return;

        // If the user has a higher / or the same role as the bot, don't do anything.
        if (message.member.roles.highest.position >= message.guild.me.roles.highest.position) return;

        if (hasSetup) {
            if (array.some((word) => message.content.toLowerCase().includes(word))) {

                try {
                    message.delete();
                    // Timeout the user for 1h after sending a banned word/link.
                    const member = message.guild.members.cache.get(message.author);
                    const timeout = await message.member.timeout(3600000);
                } catch (error) {
                    //  message.channel.send("Bad word/Scam link detected but could not delete it due to missing permissions.")
                    console.log(error)
                    return;
                }

                const embed = new MessageEmbed()
                    .setTitle(`${emojis.error} Scam detected`)
                    .setColor("#ff0000")
                    .setDescription(
                        `${
              message.author.tag
            } sent a scam link/said a bad word: ||${message.content.toLowerCase()}||`
                    )
                    .setFooter({
                        text: `From ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    });

                // Logging the message into the guild logs
                const guildQuery = await Logs.findOne({ id: message.guild.id });
                if (!guildQuery) return;

                if (guildQuery) {
                    // Sending message if scam gets logged
                    const webhookid = guildQuery.webhookid;
                    const webhooktoken = guildQuery.webhooktoken;

                    const webhookClient = new WebhookClient({
                        id: webhookid,
                        token: webhooktoken,
                    });

                    webhookClient.send({ embeds: [embed] });
                }

                const embed2 = new MessageEmbed()
                    .setTitle(`${emojis.error} Scam detected`)
                    .setDescription(
                        `Dear ${
              message.author.tag
            }\nYou have received this message because you sent a blocked message.\nServer: **${
              message.guild.name
            }**\nMessage: ||${message.content.toLowerCase()}||\n\nYour timeout will be removed automatically in exactly **12 Hours**.`
                    )
                    .setColor("RED")
                    .setFooter({
                        text: `Sent to ${message.author.username}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    })
                    .setTimestamp();

                // Handling errors 
                try {
                    await message.author.send({ embeds: [embed2] });
                } catch (error) {
                    message.channel.send({ content: `Could not send DMs to the User, they are closed.` })
                    console.log(error)
                    return;
                }
            }
        }
    } catch (err) {
        return Promise.reject(err);
    }
};