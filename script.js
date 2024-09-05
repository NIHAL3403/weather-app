// API Key and URL
const API_KEY = '2e142f2489ccefe0e7cd20fd83ed1028';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM elements
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const forecastContainer = document.getElementById('extended-forecast');
const locationBtn = document.getElementById('current-location-btn');

// Event Listener for form submission (search by city)
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city !== '') {
    fetchWeatherData(city);
    fetchExtendedForecast(city);
  }
});

// Event Listener for "Get Current Location" button (search by live location)
locationBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (navigator.geolocation) {
    // Attempt to get the user's current location
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Function to handle success in getting the location
function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  
  console.log('Latitude:', lat, 'Longitude:', lon); // Debugging: Check coordinates

  fetchWeatherDataByCoords(lat, lon);
  fetchExtendedForecastByCoords(lat, lon);
}

// Function to handle errors in getting the location
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

// Fetch weather data by city name
async function fetchWeatherData(city) {
  try {
    const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    if (data.cod === 200) {
      displayWeatherData(data);
    } else {
      alert('City not found');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Fetch weather data by latitude and longitude (live location)
async function fetchWeatherDataByCoords(lat, lon) {
  try {
    const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    
    console.log('Weather data for live location:', data); // Debugging: Check if data is returned
    
    if (data.cod === 200) {
      displayWeatherData(data);
    } else {
      alert('Weather data not found');
    }
  } catch (error) {
    console.error('Error fetching weather data by coordinates:', error);
  }
}

// Fetch extended forecast by city name
async function fetchExtendedForecast(city) {
  try {
    const response = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    if (data.cod === '200') {
      displayExtendedForecast(data);
    }
  } catch (error) {
    console.error('Error fetching extended forecast:', error);
  }
}

// Fetch extended forecast by latitude and longitude (live location)
async function fetchExtendedForecastByCoords(lat, lon) {
  try {
    const response = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    
    console.log('Extended forecast data for live location:', data); // Debugging: Check if forecast data is returned
    
    if (data.cod === '200') {
      displayExtendedForecast(data);
    }
  } catch (error) {
    console.error('Error fetching extended forecast by coordinates:', error);
  }
}

// Display current weather data
function displayWeatherData(data) {
  const { name, main, weather } = data;
  weatherContainer.innerHTML = `
    <h2 class="text-2xl font-bold mb-4">${name}</h2>
    <p class="text-lg">Temperature: ${main.temp}°C</p>
    <p class="text-lg">Humidity: ${main.humidity}%</p>
    <p class="text-lg">Weather: ${weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather-icon" class="weather-icon w-16 h-16">
  `;
}

// Display extended weather forecast data (5-day forecast)
function displayExtendedForecast(data) {
  const forecastGrid = document.getElementById('forecast-grid');
  forecastGrid.innerHTML = '';
  const days = data.list.filter(item => item.dt_txt.includes('12:00:00'));
  
  days.forEach(day => {
    const { dt_txt, main, weather } = day;
    const date = new Date(dt_txt).toDateString();
    forecastGrid.innerHTML += `
      <div class="bg-white bg-opacity-10 p-4 rounded-lg text-center">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather-icon" class="weather-icon w-12 h-12 mx-auto">
        <p>${main.temp}°C</p>
        <p>${main.humidity}% Humidity</p>
      </div>
    `;
  });
  forecastContainer.classList.remove('hidden');
}
