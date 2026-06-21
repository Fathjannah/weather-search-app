import "./App.css";
import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const latitude = geoData.results[0].latitude;
      const longitude = geoData.results[0].longitude;

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
      );

      const weatherData = await weatherResponse.json();

      setWeather(weatherData.current);
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Weather Search App</h1>

      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={searchWeather}>Search</button>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {weather && (
        <div>
          <h2>Weather Details</h2>
          <p>Temperature: {weather.temperature_2m} °C</p>
          <p>Wind Speed: {weather.wind_speed_10m} km/h</p>
          <p>Time: {weather.time}</p>
        </div>
      )}
    </div>
  );
}

export default App;