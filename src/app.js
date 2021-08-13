const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// console.log(__dirname);
// console.log(path.join(__dirname, '../public'));

const app = express();

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Home page
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Akshat Kumar",
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Akshat Kumar",
  });
});

// Help page
app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    message: "Please Help!",
    name: "Akshat Kumar",
  });
});

// Weather page
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide the address.",
    });
  }

  // Gets the latitude and longitude for the provided query
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      // If geocode throws an error
      if (error) {
        // Sends a JSON response to the browser
        return res.send({
          error: error,
        });
      }

      // Gets the forecast via API and using the above data
      forecast(latitude, longitude, (error, forecastData) => {
        // If forecast throws an error
        if (error) {
          // Sends a JSON response to the browser
          return res.send({
            error: error,
          });
        }

        // // Sends a JSON response to the browser
        res.send({
          location: location,
          forecast: forecastData,
          address: req.query.address,
        });
      });
    }
  );
});

// Products page
app.get("/products", (req, res) => {
  if (!req.query.search) {
    // Sends a JSON response to the browser
    return res.send({
      error: "You must provide a search term",
    });
  }

  // Sends a JSON response to the browser
  res.send({
    products: [],
  });
});

// Error page if user try to search help/something
app.get("/help/*", (req, res) => {
  res.render("error", {
    name: "Akshat Kumar",
    errorMsg: "404, Help article not found",
  });
});

// Error page if user try to search /something which is not taken care above
app.get("*", (req, res) => {
  res.render("error", {
    name: "Akshat Kumar",
    errorMsg: "404, Page not found.",
  });
});

// This listens to the server at port number 3000
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
