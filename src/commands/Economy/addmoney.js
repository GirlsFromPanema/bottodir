"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const economyUser = require("../../models/Economy/usereconomy");
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 10000, /* 1h Cooldown */
    users: new Set()
};


module.exports.ownerOnly = {
    ownerOnly: true
};
  

const addMoney = async (userID, wallet = 0) => {
	await economyUser.updateOne({ userID }, { $set: { userID }, $inc: { wallet } }, { upsert: true });
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

        const amount = interaction.options.getInteger("amount");

        const isRegistered = await economyUser.findOne({ userID: user.id });
        if(!isRegistered) return interaction.reply({ content: `${emojis.error} | You are not registered!\nUse \`/register\` to create an account.`, ephemeral: true })

        const bal = Number(amount[1]) || 0;
        if(isRegistered) {
            await addMoney(user.id, bal)
        }

        const embed = new MessageEmbed()
        .setDescription(`${emojis.success} Successfully added \`${amount}$\` to ${user.tag}\n\nUpdated Account:\n**Wallet**: ${isRegistered.wallet.toLocaleString()}`)
        .setColor("GREEN")
        .setFooter({ text: `Dev: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()

        return interaction.reply({ embeds: [embed], ephemeral: true })
       
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
    .setName("addmoney")
    .setDescription("Add money to a User")
    .addIntegerOption((option) => option.setName("amount").setDescription("How much should the User receive?").setRequired(true))
    .addUserOption((option) => option.setName("user").setDescription("Who should receive the Money?").setRequired(false))

