"use strict";

/*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE INTERACTION SYSTEM OF THE BOT.
                                                                                    MODIFY AT YOUR OWN RISK.

                                                                - THIS FILE IS ONLY NEEDED FOR INIT. THE TIME UTIL QUERIES.

                                     - SUPPORT IS NOT PROVIDED IF THIS IS MODIFIED/CHANGED/MOVED IN ANY WAY THAT MAY BREAK COMMANDS/EVENTS/FUNCTIONS.




                                                                                                                                                                                                                                                                                                                    */

/*



                                                                                %CopyrightBegin%


                                                                    Copyright Bottodir 2021. All Rights Reserved.

                                                            Licensed under the Apache License, Version 2.0 (the "License");
                                                            you may not use this file except in compliance with the License.

                                                                    You may obtain a copy of the License at

                                                                    http://www.apache.org/licenses/LICENSE-2.0

                                                            Unless required by applicable law or agreed to in writing, software
                                                            distributed under the License is distributed on an "AS IS" BASIS,
                                                        WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                        See the License for the specific language governing permissions and
                                                                            limitations under the License.


                                                                                    %CopyrightEnd%    
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 09/03/2022         --                                                                                                                                                                                                       */

const { Permissions, CommandInteraction } = require("discord.js");
const { getKeyByValue, msToMinAndSec } = require("../util/util.js");
const { red } = require("colors/safe");

// Configs
const client = require("../util/bot");
const config = require("../../Controller/owners.json");
const emojis = require("../../Controller/emojis/emojis");

// Database queries
const Blacklisted = require("../models/Admin/userblacklist");
const User = require("../models/Premium/User");

module.exports.data = {
  name: "interactionCreate",
  once: false,
};

/**
 * Handle the clients interactionCreate event.
 * @param {CommandInteraction} interaction The interaction that triggered the event.
 */
module.exports.run = async (interaction) => {
  try {
    /* 
    
    Only handle command interactions.

    Return if the command does not exist or is not loaded / registered - deployed.

    Add a cooldown to the user and return an error 
    */

    if (!interaction.isCommand()) return;
    const command = interaction.commandName.toLowerCase();
    let cmdFile;
    if (interaction.client.commands.has(command))
      cmdFile = interaction.client.commands.get(command);
    else return; /* Return if command doesn't exist. */

    /* Check if command is on cooldown. */
    if (cmdFile.cooldown.users.has(interaction.member.id)) {
      await interaction.reply({
        content: `${
          emojis.error
        } | You can only use this command every ${msToMinAndSec(
          cmdFile.cooldown.length
        )} minutes.`,
        ephemeral: true,
      });
      return;
    }

    /*
    -------------------------------------------------------------------------

    Some database queries, adding security options to the application commands
    
    secure commands being flagged by
        -  non-owners
        
        -  non-owners/blacklisted users

        - cooldown: true on users profile

    -------------------------------------------------------------------------
    */

    // Check if the User is blacklisted, if true, return and error and don't execute the command.
    let profile = await Blacklisted.findOne({ userID: interaction.user.id });
    if (profile) {
      return interaction.reply({
        content: `${emojis.error} | You are blacklisted from using my Commands.`,
        ephemeral: true,
      });
    }

    /*
    -------------------------------------------------------------------------
    This is used for the premium system. 
    Every user that is interacting with the bot in any way, is cached 
    and saved to the Database.
    
    Once they redeem a premium code, their profile is updated within the DB.
    
    Why isn't this within another user profile schema? like economy?
    	- We like to keep things clean.
    -------------------------------------------------------------------------
    */

    // find the user from cache
    let user = interaction.client.userSettings.get(interaction.user.id)

    // If the user isn't in the cache
    if (!user) {
      // check if they're in database, if they are not create a schema or else return
      const findUser = await User.findOne({ userID: interaction.user.id })
      if (!findUser) {
        const newUser = await User.create({ userID: interaction.user.id })
        interaction.client.userSettings.set(interaction.user.id, newUser)
        user = newUser
      } else return;
    }
      
      // Only allow premium members to use command [ ... ].
      if (cmdFile.premiumOnly) {
        const isPremium = await User.findOne({ isPremium: true })
        if (isPremium) {
          return interaction.reply({
            content: `${emojis.error} | This is only for premium users.`,
            ephemeral: true,
          });
        }
      }

    /*
    -------------------------------------------------------------------------
    Custom Owner Permissions 

    Sometimes, we don't want other people execute some commands. (Ex. blacklist/whitelist etc.)
    That's why we have an option to only allow developers (defined by discord user ID in the configs) to execute these commands


     module.exports.ownerOnly = {
  	ownerOnly: true
     };

    -------------------------------------------------------------------------
    */
    if (cmdFile.ownerOnly) {
      if (!config.owner.includes(interaction.user.id))
        return interaction.reply({
          content: `${emojis.error} | You are not the Owner of this Bot.`,
          ephemeral: true,
        });
    }

	/*
	-------------------------------------------------------------------------
	Client (Bot) permissions:

	Some users might invite the bot without any permissions.
	When trying to ban another user, admin permissions are required.

	Here, we have to check if the client has enough permissions to perform that.
	If the bot/client doesn't have the correct permissions, return an error telling the author to fix that.

	-------------------------------------------------------------------------
	*/

    /* Array containing all the missing permissions of the client/user to run the interaction. Ideally those arrays are empty. */
    let missingClientPermissions = [],
      missingUserPermissions = [];

    /* Check if the client is missing any permissions. */
    cmdFile.permissions?.clientPermissions.forEach((flag) => {
      if (!interaction.guild.me.permissions.has(flag))
        missingClientPermissions.push(getKeyByValue(Permissions.FLAGS, flag));
    });

    /* If the client is missing any permissions, don't run the command. */
    if (missingClientPermissions.length != 0) {
      await interaction.reply({
        content: `${
          emojis.error
        } | I am missing the following permissions.\n \`${missingClientPermissions.toString()}\``,
        ephemeral: true,
      });
      return;
    }

    /* Check if the user is missing any permissions. */
    cmdFile.permissions?.userPermissions.forEach((flag) => {
      if (!interaction.member.permissions.has(flag))
        missingUserPermissions.push(getKeyByValue(Permissions.FLAGS, flag));
    });

    	/* 
	-------------------------------------------------------------------------
	Command options:

	Handling options to make command handling cleaner.

		Example:
			- A module that requires a setup, a change (update), reset (deleting saved [] in database), adding additional information.

		Normally, this would be four separate commands. However, with subcommands, this is handled in max. two commands.
		
	-------------------------------------------------------------------------
	*/
	  
    /* Handling sub commands */
    // TODO: Add cmd options
    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

	/*
	-------------------------------------------------------------------------
	User/Member Permissions:

	User with no permissions should not be able to execute commands only available by admins or any higher permission role.

	here, we are checking if the user has the required permissions, if not, we are returning an error.

	-------------------------------------------------------------------------
	*/

    /* Only run the command if the user is not missing any permissions. */
    if (missingUserPermissions.length == 0) {
      cmdFile.run(interaction, args).catch((err) => console.error(red(err)));
      /* If user doesn't has Admin perms, add him a cooldown. */
      if (
        !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
        /* Adding cooldown onto the command */
        cmdFile.cooldown?.users.add(interaction.member.id);
        setTimeout(() => {
          cmdFile.cooldown?.users.delete(interaction.member.id);
        }, cmdFile.cooldown?.length);
      }
    } else
      await interaction.reply({
        content: `${
          emojis.error
        } | You are missing the following permissions.\n \`${missingUserPermissions.toString()}\``, // here is what we were talking about (custom) permissions-
        ephemeral: true,
      });
  } catch (err) {
    console.error(red(err));
  }
};
