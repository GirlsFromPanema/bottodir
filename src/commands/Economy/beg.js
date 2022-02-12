"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Database queries
const economyUser = require("../../models/Economy/usereconomy");
const Guild = require("../../models/Economy/guildeconomy");

// Configs
const emojis = require("../../../Controller/emojis/emojis");
const config = require("../../../Controller/owners.json");

module.exports.cooldown = {
    length: 360000000, /* 1h Cooldown */
    users: new Set()
};

// Update the users wallet
const randomNum = (max, min) => Math.floor(Math.random() * (max - (min ? min : 0))) + (min ? min : 0);
        const addMoney = async (userID, wallet = 0) => {
            await economyUser.updateOne(
                { userID },
                {
                    $inc: { wallet }
                },
                { upsert: true }
            );
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

         // Check if the Guild has enabled economy, if not, return an error.
        const isSetup = await Guild.findOne({ id: interaction.guildId })
        if(!isSetup) return interaction.reply({ content: `${emojis.error} | Economy System is **disabled**, make sure to enable it before running this Command.\n\nSimply run \`/manageeconomy <enable/disable>\` and then rerun this Command.`, ephemeral: true})
        
        // Find the user in the database, if he isn't registered, return an error.
        const isRegistered = await economyUser.findOne({ userID: interaction.user.id });
        if(!isRegistered) return interaction.reply({ content: `${emojis.error} | You are not registered!\nUse \`/register\` to create an account.`, ephemeral: true })

        const earning = randomNum(100, 350);
        await addMoney(interaction.user.id, earning)

        const embed = new MessageEmbed()
        .setDescription(`${emojis.success} Successfully begged for \`${earning}$\`\n\nUpdated Account:\n**Wallet**: ${isRegistered.wallet.toLocaleString()}`)
        .setColor("GREEN")
        .setFooter({ text: `Account: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} Begged Money`)
        .setDescription(`
        **Actioned by**: \`${interaction.user.tag}\`
        **Earning**: \`${earning}$\`
        `)
        .setColor("GREEN")
        .setTimestamp()

        /*
        if(masterLogger) {
            masterLogger.send({ embeds: [logs] })
        }
        */

        return interaction.reply({ embeds: [embed], ephemeral: true })
       
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
    .setName("beg")
    .setDescription("Beg for Money");
