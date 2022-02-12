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

// functions to update the user
const addMoney = async (userID, wallet = 0) => economyUser.updateOne({ userID }, { $set: { userID }, $inc: { wallet } }, { upsert: true })
const robMoney = async (userID, wallet = 0) => {
    await economyUser.updateOne({
        userID,
        $inc: { wallet: -wallet}, 
        upsert: true 
    });
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
        const target = interaction.options.getUser("target");
        
        // Check if the Guild has enabled economy, if not, return an error.
        const isSetup = await Guild.findOne({ id: interaction.guildId })
        if(!isSetup) return interaction.reply({ content: `${emojis.error} | Economy System is **disabled**, make sure to enable it before running this Command.\n\nSimply run \`/manageeconomy <enable/disable>\` and then rerun this Command.`, ephemeral: true})
        
        // Find the user in the database, if he isn't registered, return an error.
        const isRegistered = await economyUser.findOne({ userID: interaction.user.id });
        if(!isRegistered) return interaction.reply({ content: `${emojis.error} | You are not registered!\nUse \`/register\` to create an account.`, ephemeral: true })

        // Check if the robbed user is registered
        const UserisRegistered = await economyUser.findOne({ userID: target.id });
        if(!UserisRegistered) return interaction.reply({ content: `${target} is not registered.`, ephemeral: true });

        const memberBank = await economyUser.findOne({ userID: target.id });
        const memberCash = memberBank && memberBank.wallet ? memberBank.wallet : 0;
        const robbed = Math.floor((memberCash * 40) / 100);

        if(robbed === 0) {
            return interaction.reply({ content: `${emojis.error} | The user you are trying to rob has no money!`, ephemeral: true })
        }

        await robMoney(target.id, robbed);
        await addMoney(interaction.user.id, robbed);

        const embed = new MessageEmbed()
        .setDescription(`${emojis.success} Successfully robbed ${robbed} from ${target}`)
        .setColor("GREEN")
        .setFooter({ text: `Account: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} ${interaction.user.tag} Rob`)
        .setDescription(`
        **Actioned by**: \`${interaction.user.tag}\`
        **Target**: \`${target.tag}\`
        **Earning**: \`${robbed}$\`
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
    .setName("rob")
    .setDescription("Rob someones money")
    .addUserOption((option) => option.setName("target").setDescription("Who do you want to rob?").setRequired(true))
