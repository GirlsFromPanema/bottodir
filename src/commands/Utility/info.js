"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");

const moment = require("moment");
const { stripIndents } = require("common-tags");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

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

  if (sub === "user") {
    const { options, guild } = interaction;
    const target =
      interaction.options.getMember("target") || interaction.member;
    const owner = await guild.fetchOwner();

    const avpng = target.user.displayAvatarURL({
      format: "png",
      dynamic: true,
    });
    const joinedServerAt = `📅 ${moment(target.joinedTimestamp).format(
      "DD/MM/YYYY"
    )}`;
    const isBot = target.user.bot ? `${emojis.success}` : `${emojis.error}`;

    const joinedDiscordAt = `📅 ${moment(target.user.createdTimestamp).format(
      "DD/MM/YYYY"
    )}`;

    const flags = {
      DISCORD_EMPLOYEE: `${emojis.staff}`,
      DISCORD_PARTNER: `${emojis.partner}`,
      BUGHUNTER_LEVEL_1: `${emojis.bughunter}`,
      BUGHUNTER_LEVEL_2: `${emojis.bughunter2}`,
      HYPESQUAD_EVENTS: `${emojis.hypesquad}`,
      HOUSE_BRAVERY: `${emojis.habr}`,
      HOUSE_BRILLIANCE: `${emojis.brilliance}`,
      HOUSE_BALANCE: `${emojis.hob}`,
      EARLY_SUPPORTER: `${emojis.supporter}`,
      TEAM_USER: `${emojis.staff}`,
      SYSTEM: `${emojis.system}`,
      VERIFIED_BOT: `${emojis.verifiedbot}`,
      VERIFIED_DEVELOPER: `${emojis.developer}`,
    };

    const userFlags = target.user.flags.toArray();
    const badges = userFlags.length
      ? userFlags.map((flag) => flags[flag]).join(", ")
      : "None";
    const statuses = {
      Online: `${emojis.online}`,
      Idle: `${emojis.idle}`,
      DND: `${emojis.dnd}`,
      Offline: `${emojis.offline}`,
    };
    const status = `${statuses[target.presence?.status]} ${
      target.presence?.status
    }`;
    const activity = target.presence?.activities[0];
    var userstatus = "None";

    if (activity) {
      if (activity.type === "CUSTOM_STATUS") {
        let emoji = `${
          activity.emoji
            ? activity.emoji.id
              ? `<${activity.emoji.animated ? "a" : ""}:${
                  activity.emoji.name
                }:${activity.emoji.id}>`
              : activity.emoji.name
            : ""
        }`;
        userstatus = `${emoji} \`${activity.state || "None"}\``;
      } else {
        userstatus = `\`${
          activity.type.toLowerCase().charAt(0).toUpperCase() +
          activity.type.toLowerCase().slice(1)
        } ${activity.name}\``;
      }
    }

    const totalRoles = await target.roles.cache.size;
    const roles = await target.roles;
    const highestRole =
      target.roles.highest.id === guild.id ? "None" : target.roles.highest;
    function trimArray(arr, maxLen = 25) {
      if (Array.from(arr.values()).length > maxLen) {
        const len = Array.from(arr.values()).length - maxLen;
        arr = Array.from(arr.values())
          .sort((a, b) => b.rawPosition - a.rawPosition)
          .slice(0, maxLen);
        arr.map((role) => `<@&${role.id}>`);
        arr.push(`${len} more...`);
      }
      return arr.join(", ");
    }
    const Roles =
      (await target.roles.cache.size) < 25
        ? Array.from(roles.cache.values())
            .sort((a, b) => b.rawPosition - a.rawPosition)
            .map((role) => `<@&${role.id}>`)
            .join(", ")
        : roles.cache.size > 25
        ? trimArray(roles.cache)
        : "None";

    const UserInfoEm = new MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor({
        name: `User: ${target.user.tag}`,
        iconURL: target.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: `Avatar -`, value: `[PNG](${avpng})`, inline: true },
        {
          name: `Joined Server At -`,
          value: `${joinedServerAt}`,
          inline: true,
        },
        { name: `Bot -`, value: `${isBot}`, inline: true },
        { name: `Badges -`, value: `${badges}`, inline: true },
        { name: `Status -`, value: `${status}`, inline: true },
        { name: `Activity -`, value: `${userstatus}`, inline: true },

        { name: `Highest Role -`, value: `${highestRole}`, inline: true },
        {
          name: `Role(s) :-`,
          value: `[${totalRoles}] -\n ${Roles}`,
          inline: true,
        }
      )
      .setFooter({
        text: `ID - ${target.user.id} | Joined Discord At - ${joinedDiscordAt}`,
      });
    await interaction.followUp({
      content: `${emojis.users} Information about **${target.user.tag}**`,
      embeds: [UserInfoEm],
    });
  } else if (sub === "server") {
    const owner = await interaction.guild.fetchOwner();

    const embed = new MessageEmbed()
      .addFields({
        name: `**Server Information**`,
        value: `Status: ${emojis.online} Online\n• Owner: ${
          owner.user.tag
        }\n• Created: ${moment
          .utc(interaction.guild.createdAt)
          .format("MMMM D, YYYY")}
            \n• Members: ${
              interaction.guild.members.cache.filter((m) => !m.user.bot).size
            }\n• Bots: ${
          interaction.guild.members.cache.filter((m) => m.user.bot).size
        }\n• Roles: ${interaction.guild.roles.cache.size}\n• Emojis: ${
          interaction.guild.emojis.cache.size
        }\n• Channels: ${
          interaction.guild.channels.cache.filter((ch) => ch.type === "text")
            .size
        }`,
        inline: true,
      })
      .setFooter({
        text: `Guild Name: ${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setAuthor({
        name: `By: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    interaction.followUp({ embeds: [embed], ephemeral: true });
  }
};

module.exports.data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("View the information about Users or the Server")
  .addSubcommand((sub) =>
    sub
      .setName("user")
      .setDescription("Display a Users Account information")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you would like to check.")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub.setName("server").setDescription("View the Server Information.")
  );
