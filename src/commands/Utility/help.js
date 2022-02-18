/*













I love (hate) it to make help commands, I will prolly move it to a website soon, don't look at the code, just don't do it.



















STOP SCROLLING!!!
















AAAAAAA, okay fine.
*/





"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  CommandInteraction,
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 120000 /* in ms */,
  users: new Set(),
};

/**
 * Runs help command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */

module.exports.run = async (interaction, utils) => {
    
  try {
    /*
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Select your option")
        .addOptions([
          {
            label: "👻 Utility",
            description: "Click to see Utility Commands",
            value: "first",
          },

          {
            label: "😎 Setup",
            description: "Click to see Setup Commands",
            value: "second",
          },

          {
            label: "💩 Fun",
            description: "Click to see Fun Commands",
            value: "third",
          },
          {
            label: "♨️ Moderation",
            description: "Click to see Moderation Commands",
            value: "fourth",
          },
          {
            label: "💯 NSFW",
            description: "Click to see NSFW Commands",
            value: "five",
          },
        ])
    );

    let embed = new MessageEmbed()
      .setTitle("Bottodir Help")
      .setDescription("Choose the Category you'd like to select")
      .setColor("GREEN");

    let sendmsg = await interaction.reply({
      content: "  ",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });

    let embed1 = new MessageEmbed()
      .setTitle("👻 Utility")
      .setDescription(`
      - \`ping\`      - Ping Pong
      - \`serverinfo\`- Serverinfo
      - \`status\`    - Server Stats
      - \`suggest\`   - Suggest ideas
      - \`uptime\`    - Uptime
      - \`userinfo\`  - Info about a User
      - \`warns\`     - Checks your warns
      `)
      .setColor("GREEN");

    let embed2 = new MessageEmbed()
      .setTitle("😎 Setup")
      .setDescription(`
      - \`settracker\`  - Bot status tracker
      - \`setwelcome\`    - Welcoming
      - \`setsuggestion\`    - Suggestions
      - \`setreport\`    - Report Channel
      - \`setlogging\`    - Moderation Logs
      - \`setleave\`    - Leave Channel
      - \`setantiscam\`    - Antiscam Mode
      - \`resettracker\`    - Resets Bot status tracker
      `)
      .setColor("GREEN");

    let embed3 = new MessageEmbed()
      .setTitle("💩 Fun")
      .setDescription(`
      - \`dumb\`     - Dumb a user
      - \`avatar\`   - Avatar of a user
      - \`8ball\`    - Random question/answer
      `)
      .setColor("GREEN");

      let embed4 = new MessageEmbed()
      .setTitle("♨️ Moderation")
      .setDescription(`
      - \`addrole\`  - Addrole to a user
      - \`ban\`   - Ban a User from the Server
      - \`kick\`  - Kick a User from the Server
      - \`lock\`  - Lock a Channel
      - \`warn\`    - Warn a User
      - \`removewarn\` - Remove a Warning
      - \`report\`     - Report a User
      - \`role\`      - Role Information
      - \`timeout\`   - Timeout a User
      - \`clear\`     - Clear messages
      `)
      .setColor("GREEN");

      let embed5 = new MessageEmbed()
      .setTitle("💯 NSFW")
      .setDescription(`
      - \`ass\`     - Random Pic 18+
      - \`bikini\`  - Random Pic 18+
      - \`boobs\`   - Random Pic 18+
      - \`cum\`     - Random Pic 18+
      - \`pussy\`   - Random Pic 18+
      - \`teen\`    - Random Pic 18+
      - \`thighs\`  - Random Pic 18+
      `)
      .setColor("GREEN");

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      time: 60000,
    });

    collector.on("collect", async (collected) => {
      const value = collected.values[0];

      if (value === "first") {
        collected.reply({ embeds: [embed1], ephemeral: true });
      }

      if (value === "second") {
        collected.reply({ embeds: [embed2], ephemeral: true });
      }

      if (value === "third") {
        collected.reply({ embeds: [embed3], ephemeral: true });
      }

      if (value === "fourth") {
        collected.reply({ embeds: [embed4], ephemeral: true });
      }

      if (value === "five") {
        collected.reply({ embeds: [embed5], ephemeral: true });
      }
    });
    */
   interaction.reply({ content: `I've too many commands, type \`/\` and click on my profile to browse all of them.`, ephemeral: true });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.SEND_MESSAGES],
};

module.exports.data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Help Command");
