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
        const role = interaction.options.getRole("role");
        if(!role) interaction.reply({ content: "This is not a valid Role", ephemeral: true });

        const Members = interaction.guild.members.cache
        .filter((member) => member.roles.cache.find((role) => role === role))
        .map((member) => member.user.username);

        const value = Members.join("\n");

        const embed = new MessageEmbed()
        .setTitle("List of Members")
        .setDescription(`Users with Role **${role.name}:** \n${value}`)
        .setColor("RANDOM")
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `Member List from ${role.name}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        
        await interaction.reply({ embeds: [embed], ephemeral: false})
        return;
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
    .setName("role")
    .setDescription("List the Users of a Role")
    .addRoleOption(option => option.setName("role").setDescription("The role you wish to check the Users from.").setRequired(true))
