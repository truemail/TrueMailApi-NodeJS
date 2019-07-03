'use strict';

const HttpsClient = require('./HttpsClient');

class Tasks extends HttpsClient {
    
    create(file, filename) {
        return this.request({
            method: 'POST',
            path: '/api/v1/tasks/bulk'
        }, {
            'file': file,
            'filename': filename,
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    download(taskId, query) {
        return this.request({
            acceptedType: 'application/download; charset=utf-8',
            method: 'GET',
            path: '/api/v1/tasks/' + taskId + '/download'
        },
            query
        ).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }
}

Tasks.remote = 'remote_url';
Tasks.supplied = 'supplied';

/**
 * @since 4.1.4
 */
Tasks.helpers = {
    inputType: {
        remote: Tasks.remote,
        supplied: Tasks.supplied
    },
    status: {
        under_review: 'under_review',
        queued: 'queued',
        failed: 'failed',
        complete: 'complete',
        running: 'running',
        parsing: 'parsing',
        waiting: 'waiting',
        waiting_analyzed: 'waiting_analyzed',
        uploading: 'uploading'
    }
};

module.exports = Tasks;