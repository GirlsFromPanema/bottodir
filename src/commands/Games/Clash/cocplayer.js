"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

const { Client } = require("clashofclans.js");
const { stripIndents } = require("common-tags");

const cocToken = process.env.COC_TOKEN;
const coc = new Client({
  keys: [cocToken],
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

    const data = await coc.getPlayer(tag).catch((err) => {
      console.log(err);
      return { ok: false, status: err.code, name: err.message };
    });

    const embed = new MessageEmbed()
      .setTitle(`${data.name} - ${data.tag}`)
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/717460150528639077/751713217096712213/unnamed.png"
      ).setDescription(stripIndents`
					[Player](https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${encodeURIComponent(
            data.tag
          )})
		
					Name:
					\`${data.name}\`
					XP:
					\`${data.expLevel}\`
					Home Village:
					\`${data.trophies}\`
					Builder Base:
					\`${data.versusTrophies}\`
					Attacks:
					\`${data.attackWins}\`
					Defences:
					\`${data.defenseWins}\`
					War Stars:
					\`${data.warStars}\`
					Troops donated:
					\`${data.donations || "None"}\`
					Troops received:
					\`${data.donationsReceived || "None"}\`
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
  .setName("cocplayer")
  .setDescription("Search for a Clash of Clans Player")
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Provide the Player Tag of the Account")
      .setRequired(true)
  );
