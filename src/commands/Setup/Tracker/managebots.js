"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");

// Database queries
const Guild = require("../../../models/Tracker/guilds.js");
const Bot = require("../../../models/Tracker/bots.js");

// Settings
const emojis = require("../../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  await interaction.deferReply();
  const sub = interaction.options.getSubcommand();

  const guildQuery = await Guild.findOne({ id: interaction.guildId });

  if (sub === "add") {
    if (guildQuery) {
      /* Check if the user is a bot. */
      const bot = interaction.options.getUser("bot", true);
      if (!bot.bot) {
        await interaction.followUp({
          content: "Expected a bot.",
          ephemeral: true,
        });
        return;
      }

      /* Check if bot is already in th db. Add them otherwise. */
      let botQuery = await Bot.findOne({ id: bot.id });
      if (!botQuery) botQuery = new Bot({ id: bot.id });

      /* Don't allow duplicate bots on the guilds watchlist. */
      let alreadyAdded = (await guildQuery.populate("bots")).bots.find(
        (b) => b.id == bot.id
      );
      if (alreadyAdded) {
        await interaction.followUp({
          content: `${emojis.error} | The bot has already been added to the guild.`,
          ephemeral: true,
        });
        return;
      }

      // Push the new settings and save them.
      botQuery.guilds.push(guildQuery._id);
      guildQuery.bots.push(botQuery._id);
      await botQuery.save();
      await guildQuery.save();

      await interaction.followUp({
        content: `Successfully added ${bot} to the watchlist.`,
        ephemeral: true,
      });
    } else
      await interaction.followUp({
        content: `${emojis.error} | You need to setup your Guild first before you can add a bot to the watchlist.`,
        ephemeral: true,
      });
  } else if (sub === "remove") {
    const bot = interaction.options.getUser("bot", true);
    if (!bot.bot) {
      await interaction.followUp({
        content: `${emojis.error} | You did not provide an actual Bot!`,
        ephemeral: true,
      });
      return;
    }

    const botQuery = await Bot.findOne({ id: bot.id });
    if (!botQuery) return; /* if the bot isnt on the server */

    const guildQuery2 = await Guild.findOne({
      id: interaction.guildId,
      bots: botQuery._id,
    });

    if (!guildQuery2)
      return interaction.followUp({
        content: `${emojis.error} | You need to setup your Guild first before you can add a bot to the watchlist.`,
        ephemeral: true,
      });

    /* Update Guild (Remove ref. of the Bots within the bots array) */
    await guildQuery2.updateOne({
      $pull: { bots: botQuery._id },
    });
    await guildQuery2.save();

    /* If the bot isnt in any server, delete the bot of the database*/
    if (botQuery.guilds.length == 1) {
      await botQuery.remove();
      await interaction.followUp({
        content: `${emojis.success} | Successfully removed ${bot}`,
        ephemeral: true,
      });
      return;
    } else {
      await botQuery.updateOne({
        $pull: { guilds: guildQuery2._id },
      });
    }

    await botQuery.save();
    await interaction.editReply({
      content: `${emojis.success} | Successfully removed ${bot}`,
      ephemeral: true,
    });
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR]
};

module.exports.data = new SlashCommandBuilder()
  .setName("managebots")
  .setDescription("Add/Remove Bots to the tracker")
  .addSubcommand((sub) =>
    sub
      .setName("add")
      .setDescription("Add bots to the watchlist")
      .addUserOption((option) =>
        option
          .setName("bot")
          .setDescription("Select a bot to add to the watchlist.")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("remove")
      .setDescription("Remove Bots from the watchlist")
      .addUserOption((option) =>
        option
          .setName("bot")
          .setDescription("Remove a bot from the watchlist.")
          .setRequired(true)
      )
  );
