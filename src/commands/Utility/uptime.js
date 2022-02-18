"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Configs
const { msToTimeObj } = require("../../util/util.js");
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 90000, /* in ms */
    users: new Set()
};

/**
 * Runs uptime command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const timeObj = msToTimeObj(interaction.client.uptime);

        await interaction.reply({
            embeds: [{
                color: "RANDOM",
                title: "Uptime",
                description: `**${timeObj.days}** days, **${timeObj.hours}** hours, **${timeObj.minutes}** minutes, **${timeObj.seconds}** seconds`,
                footer: {
                    text: `${emojis.saphire} Bottodir`
                },
                thumbnail: {
                    url: interaction.client.user.avatarURL({
                        format: "png",
                        size: 1024
                    })
                }
            }], ephemeral: true
        });
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.SEND_MESSAGES]
};

module.exports.data = new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Shows how long the bot has been running for.");
