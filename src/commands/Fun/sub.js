'use strict'

const { SlashCommandBuilder } = require('@discordjs/builders')
const { CommandInteraction } = require('discord.js')

module.exports.cooldown = {
	length: 10000,
	users: new Set(),
}

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
	await interaction.deferReply()
	const sub = interaction.options.getSubcommand()
	if (sub === 'testsub') {
		interaction.followUp({ content: 'Sub complete!' })
	} else if (sub === 'subtest') {
		interaction.followUp({ content: 'e' })
	}
}

module.exports.data = new SlashCommandBuilder()
	.setName('sub')
	.setDescription('Test')
	.addSubcommand((sub) => sub.setName('testsub').setDescription('Test'))
	.addSubcommand((sub) => sub.setName('subtest').setDescription('Sub Test'))
