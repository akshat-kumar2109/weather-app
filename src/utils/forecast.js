const request = require("request");

const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=8610486724fd70a446cd073cd700fecb&query=" +
    longitude +
    "," +
    latitude +
    "&units=f";

  request({ url: url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location.", undefined);
    } else {
      callback(
        undefined,
        `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. And it feelslike ${body.current.feelslike}.`
      );
    }
  });
};

module.exports = forecast;
