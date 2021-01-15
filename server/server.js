/* This is only a Spotify token server */

console.clear();
const express = require("express");
const request = require("request");
const path = require("path");
const env = require("node-env-file");

const app = express();
const publicPath = path.resolve(__dirname, "../public");
env(".env");

const port = process.env.PORT | 3000;

app.use(express.static(publicPath));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res, next) => {
  res.sendFile(`${publicPath}/info.html`);
});

app.get("/spotyapp/:client_id/:client_secret", (req, res, next) => {
  const client_id = req.params.client_id;
  const client_secret = req.params.client_secret;
  const spotifyUrl = process.env.spotifyUrl;
  const authOptions = {
    url: spotifyUrl,
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  request.post(authOptions, (err, httpResponse, body) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "I can't obtain the token",
        err,
      });
    }

    res.json(body);
  });
});

app.listen(port, () => console.log(`Ready`));
