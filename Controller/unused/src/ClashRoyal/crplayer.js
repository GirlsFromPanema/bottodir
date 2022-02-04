"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  Client,
} = require("discord.js");
const clashroyaltoken = process.env.CR_TOKEN;
const { stripIndents } = require("common-tags");

const coc = new Client({
  keys: [clashroyaltoken],
});

module.exports.cooldown = {
  length: 10000 /* in ms */,
  users: new Set(),
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
    const tag = interaction.options.getString("tag");

    const data = await coc.clan(tag);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/704725852453208104/f865e9817d5f675a2abd3cc9de6178d3.png?size=2048"
      ).setDescription(stripIndents`
        **Tag:**
        \`${data.tag}\`
        XP:
        \`${data.expLevel}\`
        
        **Cards collected:**
        \`${data.clanCardsCollected}\`
		**Role in clan:**
        \`${data.role}\`
        
        **3 crown wins:**
		\`${data.threeCrownWins}\`
		**Trophies:**
		\`${data.trophies}\`
		
		**Best trophies:**
		\`${data.bestTrophies}\`
		
		**Battle count:**
		\`${data.battleCount}\`
        
		**Donations**
		\`${data.donations}\`
		**Donations Received:**
		\`${data.donationsReceived}\`
		**War day wins:**
		\`${data.warDayWins}\`
	
  `);

    return interaction.reply({
      embeds: [embed],
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("crplayer")
  .setDescription("Search for a Clash Royal Player")
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Provide the Player Tag of the Account")
      .setRequired(true)
  );
