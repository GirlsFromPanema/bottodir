"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

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
        const role = interaction.options.getRole("role")
        await role.delete();

        interaction.reply({ content: `${emojis.success} | Successfully deleted ${role}`, ephemeral: true })

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
    .setName("deleterole")
    .setDescription("Deletes a role from the Server")
    .addRoleOption((option) => option.setName("role").setDescription("Select the Role that should get deleted").setRequired(true))