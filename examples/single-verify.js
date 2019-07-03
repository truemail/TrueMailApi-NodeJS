const TrueMail = require('../src/TrueMail.js');

const client = new TrueMail(require('../.env'));

// Verify an email
client.single.check('support@truemail.io', false).then(
    res => {
        console.log(res);

        //  { result: 'valid',
        //   status: 'success',
        //   email_id: 10441490,
        //   fqdn: 'google.com',
        //   suggested_correction: '',
        //   verification_time: 1456 }
    },
    err => {
        console.log(err);
    }
);