"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const userAuth = require("../../models/Auth/user");

const moment = require("moment");
const config = require("../../../Controller/owners.json");
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 160000, /* in ms */
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
        const masterLogger = interaction.client.channels.cache.get(config.channel);

        // Find the user in the database, if he isn't registered, return an error.
        const isRegistered = await userAuth.findOne({ userID: interaction.user.id });
        if(isRegistered) return interaction.reply({ content: `${emojis.error} | You are already registered.\nDate Registered: \`${moment(isRegistered.createdAt).fromNow()}\``, ephemeral: true })

        const registered = new MessageEmbed()
            .setTitle("Signed Up")
            .setDescription(`${emojis.success} \`${interaction.user.tag}\` successfully signed up!\n\nDate and Time: \`${moment((Date.now() * 1000) / 1000).fromNow()}\`` )
            .setColor("RANDOM")
            .setTimestamp()

        const password = interaction.options.getString("password");
        const recoveryID = interaction.options.getNumber("recoveryid");

        // Security check, dont allow long asf password
        if(password.length && recoveryID.length >= 16) {
            return interaction.reply({ content: `${emojis.error} | Password or Recovery ID cant be longer than \`16\` Characters.`, ephemeral: true })
        }

        // If the password has two characters (ex: ab) then return an error.
        if(password.length <= 2) {
            return interaction.reply({ content: `${emojis.error} | Password must be at least \`2\` Characters long.`, ephemeral: true })
        }

        // Create the user in the database
        if(!isRegistered) {
            const newUser = new userAuth({
                userID: interaction.user.id,
                createdAt: (Date.now() * 1000) / 1000,
                password: password,
                recoveryID: recoveryID
            })
            newUser.save();
        }

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} SignedUp`)
        .setDescription(`
        **Actioned by**: \`${interaction.user.tag}\`
        **Date**: \`${moment((Date.now() * 1000) / 1000).fromNow()}\`
        `)
        .setColor("GREEN")
        .setTimestamp()

        /*
        if(masterLogger) {
            masterLogger.send({ embeds: [logs] })
        }
        */

        interaction.reply({ embeds: [registered], ephemeral: true })
       
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
    .setName("signup")
    .setDescription("Signup your Account with a strong password")
    .addStringOption((option) => option.setName("password").setDescription("Enter the Password for your Account").setRequired(true))
    .addNumberOption((option) => option.setName("recoveryid").setDescription("Enter the recovery ID number").setRequired(true))
