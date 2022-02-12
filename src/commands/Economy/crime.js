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
    length: 360000000, /* in ms */
    users: new Set()
};

const randomNum = (max, min) => Math.floor(Math.random() * (max - (min ? min : 0))) + (min ? min : 0);
const addMoney = async (userID, wallet = 0) => {
	await economyUser.updateOne(
		{ userID },
		{ $inc: { wallet } },
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
        if(!isRegistered) return interaction.reply({ content: `${emojis.error} | You are not registered!\nRun \`/register\`, then run this Command again.`, ephemeral: true });

        const win = randomNum(10, 1) > 4 ? false : true;
		const earning = win ? 500 : -500;
		await addMoney(interaction.user.id, earning);

        if(win) {
            interaction.reply({ content: `${emojis.success} | You comitted a crime and got \`500\``, ephemeral: true})
        } else {
            interaction.reply({ content: `${emojis.error} | You comitted a crime and lost \`500\``, ephemeral: true})
        }

        const logs = new MessageEmbed()
        .setTitle(`${emojis.success} Crime comitted`)
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
    .setName("crime")
    .setDescription("Commit a crime and earn big money with some luck!");
