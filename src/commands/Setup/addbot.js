"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");
const Guild = require("../../models/guilds.js");
const Bot = require("../../models/bots.js");
module.exports.cooldown = {
    length: 10000, /* in ms */
    users: new Set()
};

/**
 * Adds a bot to the watchlist.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) =>
{
    try
    {
        await interaction.deferReply({ ephemeral: true });

        /* Check if guild is already setup. */
        const guildQuery = await Guild.findOne({ id: interaction.guildId });
        if (guildQuery)
        {
            /* Check if the user is a bot. */
            const bot = interaction.options.getUser("bot", true);
            if (!bot.bot)
            {
                await interaction.editReply({ content: "Expected a bot.", ephemeral: true });
                return;
            }

            /* Check if bot is already in th db. Add them otherwise. */
            let botQuery = await Bot.findOne({ id: bot.id });
            if (!botQuery)
                botQuery = new Bot({ id: bot.id });

            /* Don't allow duplicate bots on the guilds watchlist. */
            let alreadyAdded = (await guildQuery.populate("bots")).bots.find(b => b.id == bot.id);
            if (alreadyAdded)
            {
                await interaction.editReply({ content: "The bot has already been added to the guild.", ephemeral: true });
                return;
            }

            botQuery.guilds.push(guildQuery._id);
            guildQuery.bots.push(botQuery._id);
            await botQuery.save();
            await guildQuery.save();

            await interaction.editReply({ content: `Successfully added ${bot} to the watchlist.`, ephemeral: true });
        }
        else await interaction.editReply({ content: "You need to setup your Guild first before you can add a bot to the watchlist.", ephemeral: true });
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
    .setName("addbot")
    .setDescription("Adds a bot to the watchlist.")
    .addUserOption(option => option.setName("bot").setDescription("Select a bot to add to the watchlist.").setRequired(true))
