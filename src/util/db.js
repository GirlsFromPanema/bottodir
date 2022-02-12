"use strict";

                                                                                                                                                                                                                                                        /*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE DATABASE SYSTEM OF THE BOT.
                                                                                    DO NOT MODIFY THIS.

                                                                - THIS FILE IS ONLY NEEDED FOR INIT. THE DATABASE CONNECTION.

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
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 12/2/2022         --                                                                                                                                                             */

const { connect, Mongoose } = require("mongoose");
const { cyan, red, green } = require("colors/safe");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

console.log(cyan("Connecting to Database . . ."));
connect(process.env.MONGO_TOKEN)
  .then(() => {
    console.log(green("Successfully connected to database."));
  })
  .catch((err) => console.error(red(err)));
