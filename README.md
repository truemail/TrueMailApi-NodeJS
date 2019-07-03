<p align="center"><img src="https://truemail.io/assets/img/logo/350x70.png"></p>

</p>
<br>
This is the official TrueMail API NodeJS wrapper. It provides helpful methods to quickly implement our API in your NodeJS applications.

**This package is not suitable for use in the browser! Only use it in server side applications!**

Installation
===

To install use the following command

```bash
$ npm install truemail-io --save
```

Basic Usage
---

>All requests to TrueMail Api required api key. To create new API credentials please go [here](https://truemail.io/app/apps).

```js
const trueMail = require('truemail-io');

// Initialize TrueMail client
const client = new trueMail({apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'});

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
```

For more information you can check out the `/examples` directory contained within the repository or visit our official documentation [here](https://developers.truemail.io/).

Examples
---

There a several examples contained within the `/examples` directory included in this repo. To run these examples; first create a `.env.js` file in the project root containing the following text (substituting in your own API key):

```js
module.exports = {
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};
```

Once that file has been created you can run the examples with the following command, replacing the script name with the specific example you intend to run.

```bash
node ./examples/single-verify.js
```
