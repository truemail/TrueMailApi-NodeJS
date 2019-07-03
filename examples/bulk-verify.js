const TrueMail = require('../src/TrueMail.js');

// Initialize TrueMail client
const client = new TrueMail(require('../.env'));

// Start job
client.tasks.create(
    [
        {
            'email': 'support@truemail.io',
            'field_1': 'Dave',
            'field_n': 'Doe'
        }
    ],
    'Test.csv' // Task name
).then(
    resp => {
        console.log(JSON.stringify(resp));

        // {"status":"success","task_id":112}
    },
    err => console.log('ERROR: ' + err.message)

);