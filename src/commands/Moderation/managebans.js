"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    CommandInteraction,
    Permissions,
    MessageEmbed,
    WebhookClient,
} = require("discord.js");

// Database queries
const Guild = require("../../models/Logging/logs");

// Configs
const emojis = require("../../../Controller/emojis/emojis");

module.exports.cooldown = {
    length: 10000 /* in ms */ ,
    users: new Set(),
};
/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async(interaction) => {
    await interaction.deferReply();
    const sub = interaction.options.getSubcommand();

    // for ban
    const banuser = interaction.options.getMember("target");

    // for hackban
    const hbanuser = interaction.options.getString("id");
    const reason =
        interaction.options.getString("reason") || "No reason provided";

    if (sub === "ban") {
        if (!banuser) return interaction.followUp({ content: "This User is invalid" });

        let bandm = new MessageEmbed()
            .setColor("RED")
            .setDescription(
                `You have been banned from **${interaction.guild.name}**\nModerator: ${interaction.user.tag}\nReason: ${reason}`
            )
            .setTimestamp();

        try {
            await banuser.send({ embeds: [bandm] });
        } catch (error) {
            interaction.followUp({
                content: `${emojis.success} | Successfully banned ${banuser.user.tag}.\n\nFailed to send DMs due to closed direct messages.`,
                ephemeral: true,
            });
            console.log(error);
            return banuser.ban({ banuser });
        }

        let banmsg = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`${banuser.user.tag} Banned`)
            .setDescription(
                `Banned ${banuser.user.tag} from ${interaction.guild.name}\nModerator: ${interaction.user.tag}\nReason: ${reason}`
            )
            .setTimestamp()
            .setColor("GREEN")
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setImage(interaction.guild.iconURL({ dynamic: true }));

        const logs = new MessageEmbed()
            .setTitle("✅ | User banned")
            .setDescription(
                `User: ${banuser.user.tag}\nModerator: ${interaction.user.tag}\nReason: ${reason}`
            )
            .setTimestamp()
            .setColor("RED");

        // Log Channel
        const guildQuery = await Guild.findOne({ id: interaction.guild.id });

        if (!guildQuery) return;
        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({
                id: webhookid,
                token: webhooktoken,
            });

            webhookClient.send({ embeds: [logs] });
        }

        await interaction.followUp({ embeds: [banmsg], ephemeral: true });
    } else if (sub === "hackban") {

         // ban the user if the ID is valid. 
         interaction.guild.members.ban(hbanuser).then((user) => {
            interaction.followUp({ 
                content: `${emojis.success} | \`The user ${user.tag} has been hack-banned from this server.\`` 
        });
        }).catch(() => {
            interaction.followUp({
                 content: `${emojis.error} | Please provide a valid member/user ID.`
                });
        });  

        const logs = new MessageEmbed()
            .setTitle("✅ | User hack-banned")
            .setDescription(
                `User: ${hbanuser}\nModerator: ${interaction.user.tag}\nReason: ${reason}`
            )
            .setTimestamp()
            .setColor("RED");

        // Log Channel
        const guildQuery = await Guild.findOne({ id: interaction.guild.id });

        // logging webhooks
        if (!guildQuery) return;
        if (guildQuery) {
            const webhookid = guildQuery.webhookid;
            const webhooktoken = guildQuery.webhooktoken;

            const webhookClient = new WebhookClient({
                id: webhookid,
                token: webhooktoken,
            });

            webhookClient.send({ embeds: [logs] });
        }
       
    }
};

module.exports.permissions = {
    clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    userPermissions: [Permissions.FLAGS.BAN_MEMBERS]
};

module.exports.data = new SlashCommandBuilder()
    .setName("managebans")
    .setDescription("Ban/Hackban a user from your server")
    .addSubcommand((sub) =>
        sub.setName("ban").setDescription("Ban a user directly from the server")
        .addUserOption(option => option.setName("target").setDescription("Role to add").setRequired(true))
        .addStringOption((option) =>
        option
        .setName("reason")
        .setDescription("Provide a reason to Ban")
        .setRequired(true)
    )
    )
    .addSubcommand((sub) =>
        sub.setName("hackban").setDescription("Ban a user from the outside of the server")
        .addStringOption(option => option.setName("id").setDescription("Role to remove").setRequired(true))
        .addStringOption((option) =>
        option
        .setName("reason")
        .setDescription("Provide a reason to hack-ban")
        .setRequired(false)
    )
    );