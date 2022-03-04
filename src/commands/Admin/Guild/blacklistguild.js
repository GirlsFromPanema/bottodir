"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database query
const Guild = require("../../../models/Admin/guildblacklist");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");
const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

// Command for owners only
module.exports.ownerOnly = {
    ownerOnly: true
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
        const guildID = interaction.options.getString("id");
        if (!rgx.test(guildID)) return interaction.reply({ content: `${emojis.error} | Provide a valid guild`, ephemeral: true });

        // if the guild id is longer than 18, don't save it.
        if(guildID.length > 18) return interaction.reply({ content: `${emojis.error} | Provide a valid guild`, ephemeral: true });

        const isBlacklisted = await Guild.findOne({ id: guildID })
        if(isBlacklisted) return interaction.reply({ content: `${emojis.error} | Guild is already blacklisted.`, ephemeral: true })

        const blacklist = new Guild({
            id: guildID,
            active: true
        })
        blacklist.save();

        interaction.reply({ content: `${emojis.success} | Successfully blacklisted Guild`, ephemeral: true })
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("blacklistguild")
    .setDescription("Blacklist a Guild from using the Bot")
    .addStringOption((option) => option.setName("id").setDescription("Guild ID that should get blacklisted").setRequired(true));
