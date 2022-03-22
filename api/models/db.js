/*require("dotenv").config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, {
  useNewUrlParse: true,
});
mongoose.connection
  .on("connected", () => {
    console.log(`Mongoose connection open on ${process.env.DATABASE}`);
  })
  .on("error", (err) => {
    console.log(`Connection error:${err.message}`);
  });
*/
var mongoose = require("mongoose");
var gracefulShutdown;
var dbURILOCAL = "mongodb://localhost/meanAUTH";
var dbURI =
  "mongodb+srv://admin:admin@cluster0.cfkgw.mongodb.net/mean-auth?retryWrites=true&w=majority";
if (process.env.NODE_ENV === "production") {
  dbURI = process.env.DATABASE;
}

// CONNECTION EVENTS
mongoose.connection.on("connected", function () {
  console.log("Mongoose connected to " + dbURI);
});
mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose disconnected");
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected through " + msg);
    callback();
  });
};

// For nodemon restarts
process.once("SIGUSR2", function () {
  gracefulShutdown("nodemon restart", function () {
    process.kill(process.pid, "SIGUSR2");
  });
});
// For app termination
process.on("SIGINT", function () {
  gracefulShutdown("app termination", function () {
    process.exit(0);
  });
});

// For Heroku app termination
process.on("SIGTERM", function () {
  gracefulShutdown("Heroku app termination", function () {
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
require('./users')
