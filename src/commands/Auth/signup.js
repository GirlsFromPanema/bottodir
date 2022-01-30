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
 * Runs ping command.
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
        if(isRegistered) return interaction.reply({ content: `You are already registered.\nDate Registered: \`${moment(isRegistered.createdAt).fromNow()}\``, ephemeral: true })

        const registered = new MessageEmbed()
            .setTitle("Registered")
            .setDescription(`${emojis.success} \`${interaction.user.tag}\` successfully registered!\n\nDate and Time: \`${moment((Date.now() * 1000) / 1000).fromNow()}\`` )
            .setColor("RANDOM")
            .setTimestamp()

        const password = interaction.options.getString("password");
        const recoveryID = interaction.options.getNumber("recoveryid");

        if(!isRegistered) {
            const newUser = new userAuth({
                userID: interaction.user.id,
                createdAt: (Date.now() * 1000) / 1000,
                password: password,
                recoveryID: recoveryID
            }).save();
        }

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} Registered`)
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
    .addStringOption((option) => option.setName("password").setDescription("Provide the Password for your Account").setMaxValue(16).setMinValue(6).setRequired(true))
    .addNumberOption((option) => option.setName("recoveryid").setDescription("Provide the recovery ID number").setMaxValue(16).setMinValue(6).setRequired(true));
