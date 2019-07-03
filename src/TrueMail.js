'use strict';

// Load lodash merge
const merge = require('lodash.merge');

// Load classes
const resources = {
    tasks: require('./Tasks'),
    single: require('./Single'),
};

class TrueMail {

    constructor(config) {
        this.config = merge({}, TrueMail.defaultConfig, config);
        this._prepResources();
    }


    getConfig() {
        return merge({}, this.config);
    }
    
    getRequestOpts(opts) {
        return merge({}, this.config.opts, opts);
    }

    _prepResources() {
        for (let name in resources) {
            this[
                name[0].toLowerCase() + name.substring(1)
            ] = new resources[name](this);
        }
    }
}

TrueMail.defaultConfig = {
    apiKey: null,
    timeout: 100000,
    opts: {
        host: 'truemail.io'
    }
};

TrueMail.errors = require('./Errors');

module.exports = TrueMail;