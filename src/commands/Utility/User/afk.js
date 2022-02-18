"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database query
const User = require("../../../models/AFK/afk");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 1800000, /* in ms */
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
        const reason = interaction.options.getString("reason");

        const isAFK = await User.findOne({ userID: interaction.user.id });

        if(!isAFK) {
            const newUser = new User({
                Guild: interaction.guild.id,
                userID: interaction.user.id,
                reason: reason,
                Date: Date.now()
            })
            newUser.save();
            interaction.reply({ content: `${emojis.success} | Successfully went AFK for \`${reason}\``, ephemeral: true });
        } else {
            isAFK.delete();
        }
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
    .setName("afk")
    .setDescription("Go afk and do something else")
    .addStringOption((option) => option.setName("reason").setDescription("Why do you want to go AFK?").setRequired(true))
