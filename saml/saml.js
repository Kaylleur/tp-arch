const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const app = express();
const port = 3000;
const realm = 'ynov';
const samlIssuer = 'tp2';
const samlCallbackUrl = 'http://localhost:3000/saml/callback';
const samlEntryPoint = 'http://localhost:8081/realms/ynov/protocol/saml';
const clientId = 'tp2';
const samlIdpCert = 'MIIClzCCAX8CBgGD70cvFTANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDAR5bm92MB4XDTIyMTAxOTA4MDQyM1oXDTMyMTAxOTA4MDYwM1owDzENMAsGA1UEAwwEeW5vdjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALqqEKFJzBoBikf+I8fQ937bcoO5Qz+xC7muTKM0njMyu6etMtGBUHiTnUb4/6b3KsDmTPTqHMXV6iyWeHc1vFwcRve5Dlg9+H6/fzdMWMLxyWWvzZoVCtErVpHq3WjArA8HVtF7+YOuKY8uSSN+P1uMYXeMRC1fPV1c/D/S+XnTfcbZsMyow5zOreifaQ5/lNRMPfiXlPQLiPcI0rUlKxgRDwISgoXbFopEL+mos4K4vOfPsYYK/PEpImlKdAM6eK2U3VwnshDT6ARB31NotOJGoXGaHAD4u0ZYYWHHI6eiFX8Tatb8T1xnQiLQ4HPguhJphw06KM9jsFKiazRpoVsCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAlhyb7dcbljRtvYF6v7AVfDiKOzSzOIRZZ2HKVebxfAgYpRCmkyuAeXgE/D+rumqWJtfpT72RAt52mS3IXFUHZ7NWF9KddshFjMCJ47kYbw/wr6WrhYxWIgLeYzx3igzoe3hYGFaqdg1wI71fh5RfNmqfq4ksLc3iqJpWWqXi904XoCDxLqqEofuuMdijylMUevRWLM9rockCYUYzoFldn7njtvFZryK3NDaNgFFgCB1egvZpflerOxvrftaA4bAH4rJ79jCePPhp8Q9/gHJv81f/4dILvlJj7JdAuRRoK1M7GvJq3/1ApdAn24BSJyCnQeQtopFy+qxe0KVUKTNnDA==';
const samlSpPrivateKey = 'MIIEwQIBADANBgkqhkiG9w0BAQEFAASCBKswggSnAgEAAoIBAgDDP0FI5VxSIv5vBwvYRoCmMIoUNs0sRG4iy3UPoj4l3/Yr4pMeu1mVHqUB2cfXmZN9eso19N1jRPrefeukQI4FR+gsj5Hu7NqONUGE9Dcz4ErOFsoy7nBraRYovnozJtEHCiyx7aYxMrv/b0EoKA1+BMJugHy9RIHqJ0VdKbF5uObbiAbdAR3l/djLLCZnt/4+kv/cNPzsUlNcbSm1phd2qLD5zEkO2VRPd8y+pF6salwwzmDLGZt6GIzVUGguKLwjgZkLcomK+LFDwXX8QVEIj9Mq1GSA36fAglR7xWI3N8wXxdYjmfi3aC+csLzxiWaxysxiJS1tZolmMjdcERpMbQIDAQABAoIBAQ1HOwBjINExMg6I8yRFPzCOMoXHaFKvYLIbFh33EbTvs0UuxoSbhy8eA2jJz8540lABTsk2muvKYClLdQAZp87yIfcN2IXgM8jiFE+fcDWl9lBnul6WWqzjW69vrM3XwPVymrGLEPddlO19OngpqSk9158+O71/cDpla1E3qas2hws7V7YV5u8Am3oVv032R66jM8Hzn7YnSY17EInpNyyhhAk0yERlp0P0EU6m7/GeeBAA7Np/eclbaySXziBZtoBx+0DuFaEPNYc+JrCq37+hyhrqirqLU0n+fHNWrzRFom5hLAiXg8Lhv9LpPRQNNGCXYMrkLvRFw0s/oSBISqrBAoGBD5oBOS2oiSUm38hm9PT8+4Eahgy9Eb5FDaFn3O+tYoeew0mngO346FrLGarfbGi1KiFFBoMKR9r2nRYXpeAkNwnZmHbHgiCRWUGmXfQDh+RL2g9zymSMTts7D0EDNCvOpmdg9YDJAfBcAr/sVsdPTfaRRfUgkYCeqL+xUYXQF3RRAoGBDIO65xry+PzUwzWW/afxFH49AUwWHx3MCj0GN8Ck17/1J7dVdjY/gCOVBSv+dvic6uz1sD3RKaTsB/wqh9L+yN4ffXSZMO9S62zJP7tqKUNsXe1VIoU0Kwq9n8LvhkV9Uy3NrXj4WJI7or5+cMY2Kox8BBWKrXmE/MtTVAHwqJtdAoGBDP9pu4AdY7yO6Wrk03jy9nk1Zq5gKdMRZmyswfTvxyFjlCDdqt0XPES/5e9kWcXWAHZdMjKjsv9p668HHotgwHW1UX7Lcc6+KNU3zBhJhMIeq1mqRtiDyAJ+7pNkHufMLvf7YCzdyX68uRG5zQYZPMOJffXdHzs/cyjYiiloFtIxAoGBCzIJkVgNh2t/10bo1fFY/bFVWAS+QYYBlCM1ncjMb2p9odMkNEWhlzu9w8uwsLQGhTAJN2qF5NByi04uqiW64u27lBssNJfVQWGnxEkgVtvHZVu9bs1ldx/7taHJcABYdoIiXw86dNoVWak7Kh5YNMZK58hxsHFm5FPtLtkxd1TNAoGBAOjDT9+Zb8moU0EcvUhUND2nsCke/g34kRY/CfOa0xpw6SDGnKX7DWcF2otLldRZ4ya90AaZ/ou6ba8ye3lpujgX9DWeTbo41A0TDnvf1NIKDZKq4KgqGDn/cNR49bU8pzTz0EC8DfjXjxMlMgqJoautq0Tbc8+5Ql/orQ9898wZ';
const samlSpCert = 'MIIDdTCCAlygAwIBAgIBADANBgkqhkiG9w0BAQ0FADBUMQswCQYDVQQGEwJmcjESMBAGA1UECAwJT2NjaXRhbmllMRUwEwYDVQQKDAxKdW1wL0Jpem5lc3MxGjAYBgNVBAMMEWlkZWEuanVtcC1iaXouY29tMB4XDTIxMDYwODEwMjcwM1oXDTIyMDYwODEwMjcwM1owVDELMAkGA1UEBhMCZnIxEjAQBgNVBAgMCU9jY2l0YW5pZTEVMBMGA1UECgwMSnVtcC9CaXpuZXNzMRowGAYDVQQDDBFpZGVhLmp1bXAtYml6LmNvbTCCASMwDQYJKoZIhvcNAQEBBQADggEQADCCAQsCggECAMM/QUjlXFIi/m8HC9hGgKYwihQ2zSxEbiLLdQ+iPiXf9ivikx67WZUepQHZx9eZk316yjX03WNE+t5966RAjgVH6CyPke7s2o41QYT0NzPgSs4WyjLucGtpFii+ejMm0QcKLLHtpjEyu/9vQSgoDX4Ewm6AfL1EgeonRV0psXm45tuIBt0BHeX92MssJme3/j6S/9w0/OxSU1xtKbWmF3aosPnMSQ7ZVE93zL6kXqxqXDDOYMsZm3oYjNVQaC4ovCOBmQtyiYr4sUPBdfxBUQiP0yrUZIDfp8CCVHvFYjc3zBfF1iOZ+LdoL5ywvPGJZrHKzGIlLW1miWYyN1wRGkxtAgMBAAGjUDBOMB0GA1UdDgQWBBTwtTjfU9INf7/HZCBrfsAtbSRLOzAfBgNVHSMEGDAWgBTwtTjfU9INf7/HZCBrfsAtbSRLOzAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBDQUAA4IBAgB9lYm0UWjeRTr2qRSs4It0kqkjujm5hje91IyRfBxUOHeePlhjEhqg56hBDs7wDGgfxv0mgU3/bqpSTyjsRVVJbZ7hnakYDxPeYRByRuARaAxxErOYsEhLhy3UQuUK8TCQYOdlgGoGe7SWJKqH2eMHWwyHz90+1F4Uk4jBZJgsMhJ0V9W1vwWLlTtIE9lCi8ZJJnybPDYDGOY2PmO/XKg7+lNwmnhuQ06bAwpGD7MPhKkoCrDER6N7AtITQepErLgpgCeaoA8EMkQH5Ss40EMihfKmeJ/pdQgNBHpCTdybbkcVE6VDBQnCIjTIL0I8FXVr15anXBjraU8kOaF3nDzXtQ==';

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

const samlStrategy = new SamlStrategy({
    path: samlCallbackUrl,
    entryPoint: samlEntryPoint,
    issuer: samlIssuer,
    cert: samlIdpCert,
    privateKey: samlSpPrivateKey,
  },
  function (profile, done) {
    console.log(profile);
    return done(null, profile);
  })

//use passport saml to protect route
passport.use('samlStrategy', samlStrategy);

app.use(passport.initialize({
  session: false
}));

app.get('/saml/metadata', (req, res) => {
  res.type('application/xml');
  res.send(samlStrategy.generateServiceProviderMetadata(samlSpPrivateKey,samlSpCert));
});

app.get('/saml/login', passport.authenticate('samlStrategy'));

app.get('/saml/callback', passport.authenticate('samlStrategy'), (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
