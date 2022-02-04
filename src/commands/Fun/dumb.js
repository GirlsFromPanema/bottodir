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
        const target = interaction.options.getMember("target");
        if(!target) return interaction.reply({ content: "This is not a valid User!", ephemeral: true})

        interaction.reply({ content: `${target}\nhttps://images-ext-1.discordapp.net/external/pgcABJ3VPOHSIQWnFE92pXbxC6-UxqZlTst4cQmHVe0/https/media.discordapp.net/attachments/877230407114973264/884509164100010064/image0.png` , ephemeral: false })
        
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
    .setName("dumb")
    .setDescription("Dumb a User!")
    .addUserOption(option => option.setName("target").setDescription("The User which you would to dumb.").setRequired(true))
