// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');

const app = express();
app.use(cookieParser());

const PORT = 3000;

// Variables that might change
const KEYCLOAK_URL = 'http://localhost:8080';
const REALM_NAME = 'myrealm';
const CLIENT_ID = 'myclient';
const CLIENT_SECRET = 'mysecret';
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const AUTHORIZATION_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM_NAME}/protocol/openid-connect/auth`;
const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM_NAME}/protocol/openid-connect/token`;
const USERINFO_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM_NAME}/protocol/openid-connect/userinfo`;


app.get('/', (req, res) => {
    console.log('Checking if user is connected');
    const accessToken = req.cookies['access_token'];

    console.log('Access token:', accessToken);
    if (!accessToken) {
        console.log('User is not connected');
        res.sendFile(__dirname + '/public/index.html');
    } else {
        // Decode the JWT to get user roles
        console.log('User is connected');
        const decodedToken = jwt.decode(accessToken, { complete: true });
        const roles = decodedToken.payload.realm_access.roles;

        console.log('Roles:', roles);

        // Fetch user info from Keycloak
        fetch(USERINFO_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(userInfo => {
                console.log('Info fetched:', userInfo);
                // Display user information
                res.send(`
          <h1>User Info</h1>
          <p><strong>Email:</strong> ${userInfo.email}</p>
          <p><strong>Name:</strong> ${userInfo.given_name} ${userInfo.family_name}</p>
          <p><strong>Username:</strong> ${userInfo.preferred_username}</p>
          <p><strong>Roles:</strong> ${roles.join(', ')}</p>
          <a href="/logout">Logout</a>
        `);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                res.redirect('/login');
            });
    }
});

app.get('/login', (req, res) => {
    console.log('redirecting user to Keycloak for login');
    const authorizationUrl = `${AUTHORIZATION_ENDPOINT}?` + querystring.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: 'openid profile email',
    });
    res.redirect(authorizationUrl);
});
app.get('/callback', (req, res) => {
    const code = req.query.code;
    console.log('Authorization code:', code);
    // show full url path
    console.log('Full url path:', req.originalUrl);

    if (!code) {
        res.status(400).send('Authorization code not found');
        return;
    }

    console.log('Fetching tokens')
    // Exchange code for tokens
    fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
        }),
    })
        .then(response => response.json())
        .then(tokenResponse => {
            if (tokenResponse.error) {
                throw new Error(tokenResponse.error_description);
            }
            console.log('Setting tokens in cookies');
            // Set access token and id token as cookies
            res.cookie('access_token', tokenResponse.access_token, { httpOnly: true });
            res.cookie('id_token', tokenResponse.id_token, { httpOnly: true });

            res.redirect('/');
        })
        .catch(error => {
            console.error('Error exchanging code for token:', error);
            res.status(500).send('Authentication failed');
        });
});


app.get('/logout', (req, res) => {
    const idToken = req.cookies['id_token'];

    // Clear the cookies
    res.clearCookie('access_token');
    res.clearCookie('id_token');

    // Construct the logout URL
    const logoutUrl =
        `${KEYCLOAK_URL}/realms/${REALM_NAME}/protocol/openid-connect/logout?` +
        querystring.stringify({
            id_token_hint: idToken,
            post_logout_redirect_uri: `http://localhost:${PORT}/`,
        });

    // Redirect the user to Keycloak's logout endpoint
    res.redirect(logoutUrl);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
