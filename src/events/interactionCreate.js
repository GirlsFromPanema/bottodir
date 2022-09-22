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
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 06/14/2022         --                                                                                                                                                                                                       */

const { Permissions, CommandInteraction } = require("discord.js");
const { getKeyByValue, msToMinAndSec } = require("../util/util.js");
const { red } = require("colors/safe");

// Configs
const client = require("../util/bot");
const config = require("../../Controller/owners.json");
const emojis = require("../../Controller/emojis/emojis");

// Database queries
const Blacklisted = require("../models/Admin/userblacklist");
