"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const economySchema = require("../../models/Economy/usereconomy")

module.exports.cooldown = {
    length: 10000, /* in ms */
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
        const user = interaction.options.getUser("user") || interaction.user;
        if(!user) return interaction.reply({ content: ":x: | This is not a valid user.", ephemeral: true });

        const isRegistered = await economySchema.findOne({ userID: user.id });
        if(!isRegistered) return interaction.reply({ content: `${user} is not registered.`, ephemeral: true });

        const balance = new MessageEmbed()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(`
        **Wallet**: ${isRegistered.wallet.toLocaleString()}
        **Bank**: ${isRegistered.bank.toLocaleString()}/${isRegistered.bankSpace} \`${(isRegistered.bank / isRegistered.bankSpace * 100).toFixed(1)}%\`
        `)
        .setFooter({ text: `From: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        .setColor("RANDOM")

        if(isRegistered) {
            interaction.reply({ embeds: [balance], ephemeral: true })
        }
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
    .setName("balance")
    .setDescription("View the Balance of a User")
    .addUserOption((option) => option.setName("user").setDescription("Provide the User").setRequired(false))
