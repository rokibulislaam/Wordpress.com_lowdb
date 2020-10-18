const fetch = require('node-fetch');
const FormData = require('form-data');
const settings = require('./settings');
const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('envfile');
const { prompt } = require('enquirer');
const initialPrompt = prompt([
  {
    type: 'input',
    name: 'client_id',
    message: 'Enter "Client ID" from https://developer.wordpress.com/apps',
    required: true,
  },
  {
    type: 'input',
    name: 'client_secret',
    message: 'Enter "Client Secret" from https://developer.wordpress.com/apps',
    required: true,
  },
  {
    type: 'input',
    name: 'port',
    message: 'Enter the port you want to run your server at',
    required: true,
    default: 3001,
  },
]);
initialPrompt
  .then(async (response) => {
    try {
      fs.readFile(
        '.env',
        { encoding: 'utf8', flag: 'a+' },
        async (error, data) => {
          try {
            if (!data || typeof data == 'undefined') {
              data = {};
            }
            const envData = parse(data);
            envData.WP_COM_APP_CLIENT_ID = response.client_id;
            envData.WP_COM_APP_CLIENT_SECRET = response.client_secret;
            envData.PORT = response.port;
            fs.writeFileSync(path.join(__dirname, '.env'), stringify(envData), {
              encoding: 'utf8',
              flag: 'w+',
            });
          } catch (err) {
            console.error('\n\n\n ERROR ENCOUNTERED! \n\n\n');
            console.error(err);
            return;
          }
        }
      );
    } catch (err) {
      console.error('\n\n\n ERROR ENCOUNTERED! \n\n\n');
      console.error(err);
      return;
    }
  })
  .then(() => {
    console.log(
      'Enter your wordpress.com username and password \nWondering why username and password required? visit: https://developer.wordpress.com/docs/oauth2/ and take a look at "Testing an application as the client owner"\n'
    );

    const userCredentialsPrompt = prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Enter Username',
        required: true,
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter Password',
        required: true,
      },
    ]);
    userCredentialsPrompt
      .then(async (userInput) => {
        const dotenv = require('dotenv').config();
        const formdata = new FormData();
        formdata.append(
          'client_id',
          dotenv.parsed['WP_COM_APP_CLIENT_ID'] || ''
        );
        formdata.append(
          'client_secret',
          dotenv.parsed['WP_COM_APP_CLIENT_SECRET'] || ''
        );
        formdata.append('grant_type', 'password');
        formdata.append('username', userInput['username']);
        formdata.append('password', userInput['password']);

        const requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow',
        };

        console.log('\nRequesting for access token...');

        fetch('https://public-api.wordpress.com/oauth2/token', requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(`Access Token: ${result.access_token}`);
            try {
              fs.readFile(
                '.env',
                { encoding: 'utf8', flag: 'a+' },
                async (error, data) => {
                  try {
                    if (!data || typeof data == 'undefined') {
                      data = {};
                    }
                    const envData = parse(data);
                    envData.WP_COM_ACCESS_TOKEN =
                      (result && result.access_token && result.access_token) ||
                      '';
                    fs.writeFileSync(
                      path.join(__dirname, '.env'),
                      stringify(envData),
                      {
                        encoding: 'utf8',
                        flag: 'w+',
                      }
                    );
                  } catch (err) {
                    console.error('\n\n\n ERROR ENCOUNTERED! \n\n\n');
                    console.error(err);
                    return;
                  }
                }
              );
            } catch (err) {
              console.error('\n\n\n ERROR ENCOUNTERED! \n\n\n');
              console.error(err);
              return;
            }
          })
          .catch((error) => console.error('\n\nERROR ENCOUNTERED\n\n', error));
      })
      .catch(console.error);
  });
