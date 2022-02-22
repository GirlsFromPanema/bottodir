"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

// Economy
const economyUser = require("../../models/Economy/usereconomy");

// Warnings, we are not resetting them due to saveity (guild admins)
const warnedUser = require("../../models/User/user");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

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
        const mentionedUser = interaction.options.getString("id");
        if(!mentionedUser) return interaction.reply({ content: `${emojis.error} | That's not a valid User.`, ephemeral: true })

        const userTypesToDelete = [economyUser];

        for (const userType of userTypesToDelete){
            const isUser = await userType.findOne({
                userID: mentionedUser,
            });
        
            if(!isUser) {
                console.error("User is missing an account")
                continue; 
            }
        
            // If everything is true, delete the users data.
            isUser.delete();
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
    .addStringOption((option) => option.setName("id").setDescription("Mention the User to reset.").setRequired(true))
