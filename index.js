const express = require('express');
const queryString = require('query-string');
const request = require('request');

const keys = require('./config/keys');

const app = express();

const redirect_uri = process.env.REDIRECT_URI || 'https://localhost:3001/callback';

app.get('/login', (req, res) => {
  let scope = 'user-read-currently-playing';
  res.redirect('https://accounts.spotify.com/authorize?' + 
    queryString.stringify({
      response_type: 'code',
      client_id: keys.spotifyClientId,
      redirect_uri
    }))
})

app.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, (error, response, body) => {
    let access_token = body.access_token;
    let uri = process.env.FRONTEND_URI || 'https://localhost:3000/'
    res.redirect(`${uri}?access_token=${access_token}`);
  })
})

app.get('/done', (req,res) => {
  res.send('done');
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(keys.spotifyClientId)
})
