"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const { Client } = require('clashofclans.js');
const { stripIndents } = require('common-tags');

const cocToken = process.env.COC_TOKEN;
const coc = new Client({
    keys: [cocToken]
});

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
        const tag = interaction.options.getString("tag");
        
        const data = await coc.getClan(tag);

        const embed = new MessageEmbed()
			.setThumbnail('https://cdn.discordapp.com/attachments/717460150528639077/751713217096712213/unnamed.png')
            .setColor("RANDOM")
			.setDescription(stripIndents`
				[Clan Link Here](https://link.clashofclans.com/en?action=OpenClanProfile&tag=${encodeURIComponent(data.tag)})
                
				**Description:**
				\`${data.description}\`
				**Tag:**
				\`${data.tag}\`
				**Members:**
				\`${data.members}/50\`
				**Total Points:**
				\`${data.clanPoints}\`
				**War Leagues:**
				\`${data.warLeague.name}\`
				**Location:**
				\`${data.location.name}\`
				**Wars Won:**
				\`${data.warWins}\`
				**War Losses:**
				\`${data.warLosses || 'Private War Log'}\`
      `);
      interaction.reply({ embeds: [embed], ephemeral: true });
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
    .setName("cocclan")
    .setDescription("Show Information about a Clash of Clans Clan")
    .addStringOption((option) => option.setName("tag").setDescription("Provide the Clan Tag you want to lookup").setRequired(true))
