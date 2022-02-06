"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed, IntegrationApplication, NewsChannel } = require("discord.js");

const emojis = require("../../../Controller/emojis/emojis");

const GuildEconomy = require("../../models/Economy/guildeconomy");

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
        const option = interaction.options.getString("option")
        const plans = ["enable", "disable"]

        if(!plans.includes(option)) {
            return interaction.reply({ content: `${emojis.error} | Not a valid option, available option: ${plans.join(", ")}`, ephemeral: true })
        }

        if(option === "enable") {
            const newGuild = new GuildEconomy({
                id: interaction.guild.id,
                option: option
            })
            newGuild.save();
            interaction.reply({ content: `${emojis.success} | Successfully **enabled** Economy`, ephemeral: true })
        }

        if(option === "disable") {
            const isSetup = await GuildEconomy.findOne({ id: interaction.guild.id })
            if(!isSetup) return interaction.reply({ content: `${emojis.error} | You first have to **enable** Economy before disabling it.`, ephemeral: true })

            await GuildEconomy.findOneAndDelete({ id: interaction.guild.id })
            interaction.reply({ content: `${emojis.success} | Successfully **disabled** Economy`, ephemeral: true})
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
    .setName("manageeconomy")
    .setDescription("Setup the Economy System in your Server")
    .addStringOption((option) => option.setName("option").setDescription("Enable or disable the Economy System").setRequired(true));
    
