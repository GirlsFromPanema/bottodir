"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, Guild } = require("discord.js");

const emojis = require("../../../../Controller/emojis/emojis");
const User = require("../../../models/Admin/userblacklist");

module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

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
        const user = interaction.options.getUser("id");

        const isBlacklisted = await User.findOne({ userID: user.id })
        if(!isBlacklisted) return interaction.reply({ content: `${emojis.error} | <@${user.id}> is not blacklisted.`, ephemeral: true })

            isBlacklisted.delete();

        const embed = new MessageEmbed()
        .setTitle(`${emojis.notify} Profile Updated`)
        .setDescription(`Dear ${user.tag}, your profile got updated!\n\n**Action:** Whitelisted.\nYou are allowed to use my Commands again.`)
        .setColor("GREEN")
        .setTimestamp()

        await user.send({ embeds: [embed] })
        interaction.reply({ content: `${emojis.success} | Successfully whitelisted ${user}`, ephemeral: true })
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
    .setName("whitelistuser")
    .setDescription("Whitelist a User from using the Bot")
    .addUserOption((option) => option.setName("id").setDescription("Who should get whitelisted?").setRequired(true));
