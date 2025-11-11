const apiKey = "8266b306ad8ed837804e265300ddbfe5"

const cityInput = document.getElementById('city-name');
const getWeatherBtn = document.getElementById('get-weather-btn')
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const weatherDisplay = document.getElementById('weather-display')

const cityDisplay = document.getElementById('city-display');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const temperature = document.getElementById('temperature');
const temperatureFahrenheit = document.getElementById('temperature-fahrenheit');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const date = document.getElementById('date')

getWeatherBtn.addEventListener('click', fetchWeather);

const showDate = () => {
    const now = new Date();
    const day = now.getDate();
    const monthName = now.toLocaleString('en', {month: 'long'})
    date.innerHTML = `${day} ${monthName} `;
}

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});

async function fetchWeather() {
    const city = cityInput.value.trim()
    if (!city) {
        showError("Please enter a city name.");
        return;
    }
    
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.add('hidden');
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
            if (response.status === 401) {
                showError("Invalid API Key. Please check and try again.");
            } else if (response.status === 404) {
                showError(`City not found: "${city}"`);
            } else {
                showError(`Error: ${response.statusText} (Status ${response.status})`);
            }
            return; 
        }
        const data = await response.json();
        console.log(data);
        updateWeatherUI(data) 
    }catch (error) {
        console.error('Fetch Error:', error);
        showError("Error occured while fetching data. Try again");
    } 
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
}
function updateWeatherUI(data) {
    if (!data) return

    const cityName = data.name;
    const country = data.sys.country;
    const iconCode = data.weather[0].icon;
    const description = data.weather[0].description;
    const tempCelsius = data.main.temp;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    const feelsLikeCelsius = data.main.feels_like;
    const humidityValue = data.main.humidity;
    const windSpeedValue = data.wind.speed; 
    const pressureValue = data.main.pressure; 

    cityDisplay.textContent = `${cityName}, ${country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = description;
    weatherDescription.textContent = description;
    
    temperature.textContent = `${Math.round(tempCelsius)}°C`;
    temperatureFahrenheit.textContent = `${Math.round(tempFahrenheit)}°F`;
    
    feelsLike.textContent = `${Math.round(feelsLikeCelsius)}°C`;
    humidity.textContent = `${humidityValue}%`;
    windSpeed.textContent = `${windSpeedValue.toFixed(1)} m/s`;
    pressure.textContent = `${pressureValue} hPa`

    weatherDisplay.classList.remove('hidden');
    
}
showDate();