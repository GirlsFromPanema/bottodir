"use strict";


                                                                                                                                                                                                                                                        /*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE DEV SYSTEM OF THE BOT.
                                                                                    DO NOT MODIFY THIS.

                                                                - THIS FILE IS ONLY NEEDED FOR INIT. THE COMMANDS AND EVENTS.

                                                            - SUPPORT IS NOT PROVIDED IF THIS IS MODIFIED/CHANGED/MOVED IN ANY WAY.




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
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 22/2/2022         --                                                                                                                                                             */

const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction, Permissions } = require("discord.js");
const path = require("path");

module.exports.cooldown = {
  length: 0 /* in ms */,
  users: new Set(),
};

// only allow owners to run this command
module.exports.ownerOnly = {
  ownerOnly: true
};

/**
 * Runs the command.
 * @param {CommandInteraction} interaction The Command Interaciton
 * @param {any} utils Additional util
 */
module.exports.run = async (interaction, utils) => {
  try {
   
    delete require.cache[path.join(__dirname, "../../deployCommands.js")];
    require("../../deployCommands.js");
    await interaction.reply({
      content: "Redeployed all commands.",
      ephemeral: true,
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports.permissions = {
  clientPermissions: [Permissions.FLAGS.SEND_MESSAGES],
  userPermissions: [Permissions.FLAGS.ADMINISTRATOR],
};

module.exports.data = new SlashCommandBuilder()
  .setName("deploycommands")
  .setDescription("Updating and refreshing all the Commands you need :D");
