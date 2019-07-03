const TrueMail = require('../src/TrueMail.js');

// Initialize TrueMail client
const client = new TrueMail(require('../.env'));

const query = [];

// Download a list
client.tasks.download(87, {
    'valids': 1,
    'invalids': 1,
    'catchalls': 1,
    'disposables': 1,
    'unknowns': 1
}).then(
    resp => {
        console.log(resp);

        // "support@truemail.io,Jonh,Doe,support@truemail.com,valid"
    },
    err => console.log('ERROR: ' + JSON.stringify(err))
)