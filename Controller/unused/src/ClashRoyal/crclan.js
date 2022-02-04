"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");
const { Client } = require("clashofclans.js");
const { stripIndents } = require("common-tags");
const clashroyaltoken = process.env.CR_TOKEN;

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

    const data = await coc.getPlayer(tag)

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/717460150528639077/751713217096712213/unnamed.png"
      ).setDescription(stripIndents`
		**Description:**
		\`${data.description}\`
		**Tag:**
		\`${data.tag}\`
		**Type:**
		\`${data.type}\`
		**Members:**
		\`${data.members}/50\`
		**War Trophies:**
		\`${data.clanWarTrophies}\`
		**Location:**
		\`${data.location.name}\`
		**Clan Score:**
		\`${data.clanScore}\`
		**Clan chest status:**
		\`${data.clanChestStatus}\`
		**Clan chest level:**
		\`${data.clanChestLevel}\`
		**Required Trophies:**
		\`${data.requiredTrophies}\`
		**Donations per week:**
		\`${data.donationsPerWeek}\`
		
  `);
    interaction.reply({ embeds: [embed], ephemeral: true });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("crclan")
  .setDescription("Show Information about a Clash Royal Clan")
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Provide the Clan Tag you want to lookup")
      .setRequired(true)
  );
