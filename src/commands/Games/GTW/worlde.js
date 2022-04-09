"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions, MessageEmbed } = require("discord.js");

// Configs
const emojis = require("../../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 90000, /* in ms */
    users: new Set()
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
    try {
        let errEmbed = new MessageEmbed()
            .setColor("#6F8FAF")

        const gamedesc = [
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`,
            `⬛⬛⬛⬛⬛ - Empty`
        ]

        let game = new MessageEmbed()
            .setTitle(`Wordle`)
            .setDescription(gamedesc.join('\n'))
            .setFooter({ text: `You have 6 tries to guess the word` })
            .setColor("#6F8FAF")

        interaction.reply({ embeds: [game] })

        let options = {
            yellow: `🟨`,
            grey:   `⬜`,
            green:  `🟩`,
            black:  `⬛`,
        };

        let tries = 0;
        let words = ["books", "apple", "color", "ready", "house", "table", "light", "sugar", "eager", "elite", "plant", "stamp", "spawn", "dog", "kitchen", "mouse", "beer"]
        let solution = words[Math.floor(Math.random() * words.length)];

        const filter = m => m.author.id === interaction.user.id;
        const msgCollector = interaction.channel.createMessageCollector({ filter, time: 50000 });

        msgCollector.on('collect', async m => {
            if (m.author.bot) return;
            let guess = m.content.toLowerCase();

            if (guess.length > 5 || guess.length < 5) return;
            let result = "";

            for (let i = 0; i < guess.length; i++) {
                let guessLetter = guess.charAt(i);
                let solutionLetter = solution.charAt(i);

                if (guessLetter === solutionLetter) {
                    result = result.concat(options.green)
                }
                else if (solution.indexOf(guessLetter) != -1) {
                    result = result.concat(options.yellow)
                }
                else {
                    result = result.concat(options.grey)
                }
            }
            if (result === "🟩🟩🟩🟩🟩") {
                gamedesc[tries] = `${result} - ${guess}`;

                interaction.editReply({ embeds: [game.setDescription(gamedesc.join('\n'))] })
                interaction.editReply({ embeds: [game.setFooter({ text: `${emojis.success} You got the correct Word!` })] })
                return msgCollector.stop();
            } else {
                msgCollector.resetTimer();
                gamedesc[tries] = `${result} - ${guess}`;
                interaction.editReply({ embeds: [game.setDescription(gamedesc.join('\n'))] })
                tries += 1
                if (tries === 6) {
                    interaction.editReply({ embeds: [game.setFooter({ text: `You used your 6 tries, the correct word was: ${solution}.` })] })
                    return msgCollector.stop();
                }
            }
        });
    }
    catch (err) {
        return Promise.reject(err);
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
    userPermissions: [Permissions.FLAGS.SEND_MESSAGES]
};

// make sure to fill out the name and the description (to avoid errors)
module.exports.data = new SlashCommandBuilder()
    .setName("worlde")
    .setDescription("Play a game of wordle");
