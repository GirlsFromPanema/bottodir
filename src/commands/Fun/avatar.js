"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

module.exports.cooldown = {
    length: 10000, /* in ms */
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
        const user = interaction.options.getMember("user")
        if(!user) return interaction.reply({ content: "This User is invalid"})

        const embed = new MessageEmbed()
        .setTitle(`${user.user.username}'s Avatar`)
        .setImage(user.user.displayAvatarURL({dynamic: true, size: 512}))

        await interaction.reply({ embeds: [embed], ephemeral: false });
        return;
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
    .setName("avatar")
    .setDescription("Check someones avatar")
    .addUserOption(option => option.setName("user").setDescription("Select the User to check the Avatar from.").setRequired(true))
