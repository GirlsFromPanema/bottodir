"use strict";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, MessageEmbed } = require("discord.js");
const moment = require("moment");
const voucher_codes = require("voucher-code-generator");

// Datbase queries
const schema = require("../../../../models/Premium/Code");

// Configs
const emojis = require("../../../../../Controller/emojis/emojis");

module.exports.cooldown = {
  length: 10000,
  users: new Set(),
};

// only allow owners to run this command
module.exports.ownerOnly = {
  ownerOnly: true
};


/**
 * @param {CommandInteraction} interaction
 */

module.exports.run = async (interaction) => {
  try {
      
    const plan = interaction.options.getString("option");
    const plans = ["daily", "monthly"];

    if(!plans.includes(plan)) {
        return interaction.reply({ content: `Not a valid option, available option: ${plans.join(", ")}`, ephemeral: true })
    }

    let codes = [];

    let time;
    if (plan === "daily") time = Date.now() + 86400000;
    if (plan === "monthly") time = Date.now() + 86400000 * 30;
  
    for (let i = 0; i < 1; i++) { 
        const codePremium = voucher_codes.generate({
            pattern: "####-####-####",
          });

        const code = codePremium.toString().toUpperCase(); 

        const find = await schema.findOne({
            code: code,
        });

        if (!find) {
            schema.create({
              code: code,
              plan: plan,
              expiresAt: time,
            });
    
            // Push the new generated Code into the Queue
            codes.push(`${i + 1}- ${code}`);
          }
        
          interaction.reply({
            content: `\`\`\`Generated +${codes.length}\n\n--------\n${codes.join(
              "\n"
            )}\n--------\n\nType - ${plan}\nExpires - ${moment(time).format(
              "dddd, MMMM Do YYYY"
            )}\`\`\`\nTo redeem, use \`/redeem <code>\``,
          });
    }
  } catch(error) {
      console.log(error);
  }
};

module.exports.data = new SlashCommandBuilder()
  .setName("gencode")
  .setDescription("Generate a premium Code")
  .addStringOption(option => option.setName("option").setDescription("Enable with enable, disable with disable").setRequired(true))
  