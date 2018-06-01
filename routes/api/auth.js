const epxress = require('express');
const router = epxress.Router();
const queryString = require("query-string");
const request = require("request");

const keys = require("../../config/keys");
const redirect_uri = process.env.REDIRECT_URI || "http://localhost:3001/auth/callback";

// @route   GET auth/login
// @desc    Redirect the 'server-user' to the spotify login
// @access  Public route
router.get("/login", (req, res) => {
  let scope =
    "user-read-playback-state user-read-currently-playing";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: keys.spotifyClientId,
        redirect_uri,
        scope
      })
  );
});

// @route   GET auth/callback
// @desc    The URI spotify redirects too on login completion
// @access  Public route
router.get("/callback", (req, res) => {
  let code = req.query.code || null;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          keys.spotifyClientId + ":" + keys.spotifyClientSecret
        ).toString("base64")
    },
    json: true
  };
  request.post(authOptions, (error, response, body) => {
    let access_token = body.access_token;
    let refresh_token = body.refresh_token;
    let uri = process.env.FRONTEND_URI || "http://localhost:3000/";
    console.log(body);
    res.redirect(`${uri}?access_token=${access_token}`);
  });
});

module.exports = router;
