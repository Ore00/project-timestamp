// index.js
// where your node app starts

// init project
var express = require("express");
var path = require("path");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var moment = require("moment");
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/", function(req, res) {
  let resp = determineDate("");
  res.json(resp);
})
app.get("/api/:date", function(req, res) {
  try {
    if (isNaN(Number.parseInt(req.params.date))) {
      res.json({ error: "Invalid Date" });
    } else {
      let resp = determineDate(req.params.date);
      res.json(resp);
    }
  } catch (error) {
    console.error('error:', error);
  }

});
let determineDate = (str) => {
  let cDate;
  //can handle dates that can be successfully parsed by new Date(date_string)
  if (new Date(str) != "Invalid Date") {
    cDate = new Date(str);
    cDate = moment.utc(cDate);
  } else if (moment(str, "x").isValid()) {
    cDate = moment.utc(str, "x").startOf("day");
  } else if (str == "") {
    cDate = moment().utc();
  } else {
    cDate = moment().startOf("day").utc();
  }

  if (str != "") {
    cDate.utcOffset(0);
    cDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0, });
  }

  let json = {
    unix: cDate.valueOf(),
    utc: cDate.format("ddd, DD MMM YYYY HH:mm:ss [GMT]"),
  }
  return json;
}
app.use((req, res, next) => {
  res.status(404).send(
    "<h1>Page not found on the server</h1>")
})
// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
