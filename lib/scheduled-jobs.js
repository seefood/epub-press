'use strict';

const exec = require('child_process').exec;

const Config = require('./config');
const Logger = require('./logger');

const log = new Logger();

class ScheduledJobs {
    static cleanEbooks() {
        return new Promise((resolve, reject) => {
            const ebookFolder = Config.DEFAULT_EBOOK_FOLDER;
            const cleanCmd = `find ${ebookFolder} -mtime +2 -exec rm {} \\;`;
            exec(cleanCmd, (error) => {
                if (error) {
                    log.warn('Cleaning failed:', { error });
                    return reject(error);
                }
                return resolve();
            });
        });
    }
}

module.exports = ScheduledJobs;