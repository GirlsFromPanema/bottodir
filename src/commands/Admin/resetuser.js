"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

// Economy
const economyUser = require("../../models/Economy/usereconomy");

// Warnings
const warnedUser = require("../../models/user");


module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

// Only available for bot devs
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
        const mentionedUser = interaction.options.getUser("user");
        if(!mentionedUser) return interaction.reply({ content: "That's not a valid User.", ephemeral: true })

        const userTypesToDelete = [economyUser]

        for (const userType of userTypesToDelete){
            const isUser = await userType.findOne({
                userID: mentionedUser.id,
            });
        
            if(!isUser) {
                console.error("User is missing an account")
                continue; 
            }
        
            isUser.delete()
        }
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
    .setName("resetuser")
    .setDescription("Removes a User from the Database")
    .addUserOption((option) => option.setName("user").setDescription("Mention the User to reset.").setRequired(true))
