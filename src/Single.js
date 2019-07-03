'use strict';

const HttpsClient = require('./HttpsClient');

const defaultInterval = 5000,
    limit = 80000;

class Single extends HttpsClient {

    check(email, address_info, timeout, interval) {
        let context = Promise;
        if (!interval)
            interval = defaultInterval;

        return new Promise((resolve, reject) => {
            this.request({
                method: 'GET',
                path: '/api/v1/verify/single'
            }, {
                email: email,
                address_info: address_info,
                timeout: timeout
            }).then(
                (response) => {
                    if (response.status === 'email_in_queue') {
                        setTimeout(() => {
                            this.status(response.email_id, address_info, interval * 2).then(
                                success => {
                                    resolve(response);
                                },
                                error => {
                                    reject(error);
                                }
                            )
                        }, interval * 2)
                    } else {
                        resolve(response)
                    }
                },
                (e) => reject(e)
            )
        })
    }

    status(emailId, address_info, interval) {
        let context = Promise;

        return new Promise((resolve, reject) => {
            this.request({
                method: 'GET',
                path: '/api/v1/verify/status'
            }, {
                email_id: emailId,
                address_info: address_info,
            }).then(
                (response) => {
                    if (response.status === 'email_in_queue') {
                        if (interval <= limit ) {
                            setTimeout(() => {
                                this.status(emailId, address_info, interval * 2)
                            }, interval * 2)
                        } else {
                            resolve(response);
                        }
                    } else {
                        resolve(response)
                    }
                },
                (e) => reject(e)
            )
        })
    }
}


module.exports = Single;