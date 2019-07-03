'use strict';

const https = require('https');
const _Error = require('./Errors');
const _Version = require('../package.json').version;

class HttpsClient {

    constructor(_nb) {
        this._nb = _nb;
    }

    request(params, data) {
        data = data || {};
        return new Promise((resolve, reject) => {

            data.access_token = this._nb.getConfig().apiKey;

            const query = JSON.stringify(data);

            const opts = this._nb.getRequestOpts(params);

            if (!opts.acceptedType)
                opts.acceptedType = 'application/json; charset=utf-8';

            let headers = {
                'Content-Type' : 'application/json; charset=utf-8',
                'Content-Length': query.length,
                'authorization': this._nb.getConfig().apiKey
            };

            opts.headers = headers;

            let responseData = '';
            let req = https.request(opts, (res) => {

                if (res.statusCode >= 400 && res.statusCode < 500) {
                    if (res.statusCode === 401) {
                        return reject(
                            new _Error(
                                _Error.AuthError,
                                'An error occurred while executing the request. '
                                + `${res.statusCode} ${res.statusMessage}`
                                + '\n\n(auth_failure)'
                            )
                        );
                    }
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'An error occurred while executing the request. '
                            + `\n\n(Request error [status ${res.statusCode}])`
                        )
                    );
                }

                // Handle 5xx HTTP codes
                if (res.statusCode >= 500) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'An error occurred while executing the request. '
                            + `\n\n(Internal error [status ${res.statusCode}])`
                        )
                    );
                }

                res.on('data', (data) => {
                    responseData += data;
                });

                res.on('end', () => {
                    this.parseResponse(opts, responseData, res.headers, res.statusCode).then(
                        success => {
                            resolve(success);
                        },
                        error => {
                            reject(error);
                        })
                })
            });
            req.write(query);
            req.end();
            req.on('error', function(e) {
                reject(e);
            });
        })
    }

    parseResponse(opts, chunks, headers, code) {
        return new Promise((resolve, reject) => {

            if (headers['content-type'] == 'application/vnd.api+json; charset=utf-8')
                headers['content-type'] = 'application/json; charset=utf-8';

            // Parse response as json
            
            if (headers['content-type'] === 'application/json; charset=utf-8') {
                let decoded;

                try {
                    decoded = JSON.parse(chunks);
                    
                    if (decoded.data)
                        decoded = decoded.data;

                } catch (err) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'The response from TrueMail was unable '
                            + 'to be parsed as json. Try again later. '
                        )
                    );
                }

                // Check if response was able to be decoded

                if (!decoded) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'The response from TrueMail was unable '
                            + 'to be parsed as json. Try again later. '
                        )
                    );
                }

                // Check status

                if (decoded.status === undefined || (decoded.status !== 'success' && decoded.message === undefined)) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'The response from server is corrupted. Missing \'status\' parameter.'
                        )
                    );
                }
                

                return resolve(decoded);
            }

            if (headers['content-type'] === 'application/download; charset=utf-8') {
                if (code === 200) {
                    return resolve(chunks.toString());
                } else {
                    return reject(
                        new _Error(
                            errorType,
                            'We were unable to complete your request. '
                        )
                    );
                }
            }

            return resolve(chunks);
        });
    }
}

module.exports = HttpsClient;