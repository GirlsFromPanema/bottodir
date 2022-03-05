class Timestamp {
    /**
     * Discord Timestamps
     * @param {number} timestamp timestamp to convert to a readable string
     * @requires [UNIX](https://en.wikipedia.org/wiki/Unix_time) timestamp in `milliseconds`
     */
    constructor(timestamp) {
        this.timestamp = timestamp;
        if (this.timestamp < 0)
            throw new Error('Timestamp must be a positive number');
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getRelativeTime();
     * // => a few seconds ago
     * ```
     * @returns {string} The relative time from this timestamp to now
     */
    getRelativeTime() {
        return `<t:${Math.floor(this.timestamp / 1000)}:R>`;
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getShortDateTime();
     * // => 5 March 2022 9:48 PM
     * ```
     * @returns {string} The date and time in the format of `Date Month Year HH:MM`
     */
    getShortDateTime() {
        return `<t:${Math.floor(this.timestamp / 1000)}:f>`;
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getLongDateTime();
     * // => Saturday, 5 March 2022 9:48 PM
     * ```
     * @returns {string} The date and time in the format of `Day Date Month Year HH:MM`
     */
    getLongDateTime() {
        return `<t:${Math.floor(this.timestamp / 1000)}:F>`;
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getShortDate();
     * // => 05/03/2022
     * ```
     * @returns {string} The date and time in the format of `DD/MM/YYYY`
     */
    getShortDate() {
        return `<t:${Math.floor(this.timestamp / 1000)}:d>`;
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getLongDate();
     * // => 5 March 2022
     * ```
     * @returns {string} The date and time in the format of `Date Month Year`
     */
    getLongDate() {
        return `<t:${Math.floor(this.timestamp / 1000)}:D>`;
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getShortTime();
     * // => 9:48 PM
     * ```
     * @returns {string} The date and time in the format of `HH:MM`
     */
    getShortTime() {
        return `<t:${Math.floor(this.timestamp / 1000)}:t>`;
    }
    /**
     * @example
     * ```js
     * const timestamp = new Timestamp(Date.now());
     * timestamp.getLongTime();
     * // => 9:48:38 PM
     * ```
     * @returns {string} The date and time in the format of `HH:MM:SS`
     */
    getLongTime() {
        return `<t:${Math.floor(this.timestamp / 1000)}:T>`;
    }
}

// by: EvolutionX#0001