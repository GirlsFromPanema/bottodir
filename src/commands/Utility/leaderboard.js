"use strict";

/*

This might be broken, I hate levelling that's why I don't want to try to fix it, lol.

*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const Levels = require('discord-xp');
const emojis = require("../../../Controller/emojis/emojis");

const Guild = require("../../models/Levelling/guildlevel");

const client = require("../../util/bot");

module.exports.cooldown = {
    length: 120000, /* in ms */
    users: new Set()
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        const hasEnabled = await Guild.findOne({ id: interaction.guild.id });
        if (!hasEnabled) return interaction.reply({ content: `${emojis.error} | Levelling is disabled.`, ephemeral: true });

        const rawLeaderboard = await Levels.fetchLeaderboard(interaction.guild.id, 5); // this will get the first 5 ppl
        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
        if (rawLeaderboard.length < 1) return interaction.reply('Nobody is in the leaderboard');

        const l = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator} -> Level: ${e.level} -> Xp: ${e.xp.toString()}`); // u can design this any way.. even by putting it in a embed 
        interaction.reply({
            content: `${l.join("\n\n")}`
        })
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
    .setName("leaderboard")
    .setDescription("Check the rank of the level system")
