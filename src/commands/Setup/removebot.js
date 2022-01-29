"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");
const Guild = require("../../models/guilds.js");
const Bot = require("../../models/bots.js");

module.exports.cooldown = {
    length: 10000 /* in ms */,
    users: new Set(),
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
        /* Check if the user is a bot. */
        const bot = interaction.options.getUser("bot", true);
        if (!bot.bot)
        {
            await interaction.editReply({
                content: "You did not provide an actual Bot!",
                ephemeral: true,
            });
            return;
        }

        /* Check if bot is in th db */
        const botQuery = await Bot.findOne({ id: bot.id });
        if (!botQuery)
            return; /* Der Bot ist nicht auf der Watchlist für den Server */
        const guildQuery = await Guild.findOne({ id: interaction.guildId, bots: botQuery._id });

        if (!guildQuery)
            return; /* Please setup your guiild first..*/


        /* Update Guild (Entferne Referenz des Bots in dem bots array) */
        await guildQuery.update({
            $pull: { bots: botQuery._id }
        });
        await guildQuery.save();

        /* Wenn der Bot dadurch in keinem Server mehr wäre, kann man den Bot auch direkt aus der Db löschen. 
            Andernfalls entfernt man auch bei dem Bot in dem 'guilds' Array die Referenz auf die Gilde. => Nicht gut außer für one-guild purposes lmao */
        if (botQuery.guilds.length == 1)
        {
            await botQuery.remove();
            await interaction.editReply({ content: "done", ephemeral: true });
            return;
        }
        else
        {
            await botQuery.update({
                $pull: { guilds: guildQuery._id }
            });
        }

        await botQuery.save();
        await interaction.editReply({ content: "done", ephemeral: true });
    }
    catch (err)
    {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
    .setName("removebot")
    .setDescription("Removes a bot from the watchlist.")
    .addUserOption((option => option.setName("bot").setDescription("Remove Bots from the Watchlist!").setRequired(true)));