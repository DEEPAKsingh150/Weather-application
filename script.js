const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function() {
    // Set default city
    weatherFn('Noida');
    
    // Add event listener for Enter key
    $('#city-input').keypress(function(e) {
        if (e.which === 13) {
            const city = $(this).val().trim();
            if (city) {
                weatherFn(city);
            }
        }
    });
    
    // Add click event for search button
    $('#city-input-btn').click(function() {
        const city = $('#city-input').val().trim();
        if (city) {
            weatherFn(city);
        }
    });
});

async function weatherFn(cName) {
    $('#error-message').hide();
    $('#weather-info').hide();
    
    const temp = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
    try {
        const res = await fetch(temp);
        const data = await res.json();
        
        if (res.ok) {
            weatherShowFn(data);
        } else {
            showError(data.message || 'City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please check your connection.');
    }
}

function weatherShowFn(data) {
    // Update basic info
    $('#city-name').text(data.name + ', ' + data.sys.country);
    $('#date').text(moment().format('dddd, MMMM Do YYYY | h:mm A'));
    $('#temperature').html(`${Math.round(data.main.temp)}°C`);
    $('#temp-max').html(`${Math.round(data.main.temp_max)}°C`);
    $('#temp-min').html(`${Math.round(data.main.temp_min)}°C`);
    $('#description').text(data.weather[0].description);
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    $('#weather-icon').attr('src', `https://openweathermap.org/img/wn/${iconCode}@4x.png`);
    
    // Update additional details
    $('#wind-speed').text(`${data.wind.speed} m/s`);
    $('#humidity').text(`${data.main.humidity}%`);
    $('#pressure').text(`${data.main.pressure} hPa`);
    $('#visibility').text(`${(data.visibility / 1000).toFixed(1)} km`);
    
    // Set body class based on weather condition
    setWeatherTheme(data.weather[0].main.toLowerCase());
    
    // Show weather info with animation
    $('#weather-info').fadeIn(500);
}

function setWeatherTheme(weatherCondition) {
    // Remove all weather classes
    document.body.className = '';
    
    // Add appropriate weather class
    const validConditions = ['clear', 'clouds', 'rain', 'thunderstorm', 'snow', 'mist', 'fog', 'haze'];
    if (validConditions.includes(weatherCondition)) {
        document.body.classList.add(weatherCondition);
    } else {
        document.body.style.background = 'linear-gradient(135deg, #4361ee, #3f37c9)';
    }
}

function showError(message) {
    $('#error-message').text(message).fadeIn();
}