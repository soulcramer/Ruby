const JukeboxItem = require('./JukeboxItem');
const {
    readdirSync
} = require('fs');
const {
    readdir
} = require('fs').promises;
const {
    resolve,
    basename,
    extname
} = require('path');
const debug = require('debug')('jukeboxLocalItem')

/**
 * @class
 * @extends JukeboxItem
 */
class JukeboxLocalItem extends JukeboxItem {

    constructor(track, voiceConnection, asker) {
        super(track, voiceConnection, asker);
        this.localStorageDir = JukeboxLocalItem._getLocalStoragePath();

        let resolve, reject;
        this.trueTrack = new Promise(function () {
            resolve = arguments[0];
            reject = arguments[1];
        });
        this._getTrueTrackName(resolve, reject);

    }

    async _getTrueTrackName(resolve, reject) {
        const filename = await this._getFileFromAlias(this.track).catch(reject);
        resolve(filename);
    }
    /**
     * @static
     * @private
     * Return where on the disk are the song files
     * @returns {String} Dir path 
     */
    static _getLocalStoragePath() {
        return resolve(__dirname, '../sounds/');
    }

    /**
     * @static
     * @public
     * Return files aliases list
     * @returns {Object[]} List of aliases
     */
    static getAliases() {
        return {
            'corbeau': [
                'mabite',
                'corbac',
                'vent'
            ],
            'inception': [
                'dooom'
            ],
            'yeah': [

            ]
        }
    }

    /**
     * @static
     * Returns List of local files 
     * @returns {String[]} List of file
     */
    static getLocalSongList() {

        const aliases = JukeboxLocalItem.getAliases();

        const files = readdirSync(JukeboxLocalItem._getLocalStoragePath())
        let results = []
        files.map(file => {
            let filename = basename(file, extname(file));
            results.push(filename);
            //Add all aliases as valid property
            if (aliases.hasOwnProperty(filename)) {
                results = results.concat(aliases[filename]);
            }
        })
        return results;
    }

    /**
     * @async
     * @private
     * Take a file alias as parameter and returns the true name of the file with it's extension.
     * @param {String} alias 
     * @return {String} File true name
     */
    async _getFileFromAlias(alias) {
        const aliases = JukeboxLocalItem.getAliases();

        let filename;
        for (const key of Object.keys(aliases)) {
            const matches = aliases[key].filter((fileAlias) => {
                return fileAlias == alias;
            })
            if (matches.length || key == alias) {
                filename = key
                break;
            }
        }
        // await files;
        //debug(files)
        let files = await readdir(JukeboxLocalItem._getLocalStoragePath())
        const filenameWithExtension = files.filter(file => {
            return filename == basename(file, extname(file));
        })

        debug(filenameWithExtension);

        return filenameWithExtension


    }

    /**
     * @public
     * Play the source
     */
    async play(options) {
        super.play();
        this.trueTrack.then(async () => {
            let tt = await this.trueTrack;
            debug(tt)
            let path = resolve(this.localStorageDir, `./${tt}`);
            debug(path)
            this._dispatcher = this._voiceConnection.playFile(path, options);

            this._dispatcher.on('end', (evt) => {
                /**
                 * Emitted when an item stops playing
                 * @event JukeboxItem#end
                 */
                this.emit('end');
            })
        })

    }

    /**
     * @returns Info about the playback
     */
    async _getInfo() {
        return {
            title: basename(this.track),
            author: 'local',
            image: "https://i.pinimg.com/736x/95/6a/72/956a72e128f787f1c7af24b33b485e81--rwby-rose-rwby-fanart.jpg"
        }
    }

}

module.exports = JukeboxLocalItem;