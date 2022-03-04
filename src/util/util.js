"use strict";
                                                                                                                                                                                                                                                                                                                            /*

                                        ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION ----- INFORMATION 

                                                                            THIS IS THE TIME SYSTEM OF THE BOT.
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
                                                                                    
                                                                                    
                                                                                    
                                                                        --      last update: 12/2/2022         --                                                                                                                                                                                       */

/* 

Various utility functions for uptime/math etc.

*/

const fs = require("fs");
const path = require("path");

/**
 * Storing the bots color plaette
 */
module.exports.colorPalette = {
    brandingColor: 475478
};

/**
 * Recursively read all files in a directory.
 * @param {fs.PathLike} dirPath The path to the directory that will be recursively traversed. 
 * @param {Array} arrayOfFiles The array that all files will be recursively pushed to.
 * @returns Returns an array of files.
 */
module.exports.getAllFiles = function getAllFiles(dirPath, arrayOfFiles)
{
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file)
    {
        if (fs.statSync(dirPath + "/" + file).isDirectory())
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        else arrayOfFiles.push(path.join(dirPath, "/", file));
    });

    return arrayOfFiles;
};

/**
 * Get the key for the given value in an object.
 * @param {Object} object 
 * @param {any} value 
 * @returns Returns the key that corresponds to the value.
 */
module.exports.getKeyByValue = function (object, value)
{
    return Object.keys(object).find(key => object[key] === value);
};

/**
 * Formats milliseconds to minutes and seconds. 298999 -> 4:59
 * @param {Number} ms The amount of milliseconds to format.
 * @returns Returns the formatted string.
 */
module.exports.msToMinAndSec = function (ms)
{
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

/**
 * Formats the ms to days, hours, minutes and seconds and returns those values in an object.
 * @param {Number} ms The amount of milliseconds to format.
 */
module.exports.msToTimeObj = function (ms)
{
    return {
        days: Math.floor(ms / 86400000),
        hours: Math.floor(ms / 3600000) % 24,
        minutes: Math.floor(ms / 60000) % 60,
        seconds: Math.floor(ms / 1000) % 60
    };
};


