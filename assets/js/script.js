//keys for api request
const apiKey = `cyYr3Sjnlgx3TaMpYDca8ZXB8wqd8QJF`
const localLang = `uk-ua`;

const contentSectionElement = document.querySelector('.content-section');
const burgerContainerElement = document.querySelector('.burger-continer')
const menuElement = document.querySelector('.menu')

const createCurrentLocalDate = (date) => {
    const localDate = new Date(date);
    const currentDate = {
        year: localDate.getFullYear(),
        month: localDate.getMonth() + 1 < 10 ? `0${localDate.getMonth() + 1}` : localDate.getMonth() + 1,
        day: localDate.getDate() < 10 ? `0${localDate.getDate()}` : localDate.getDate()
    }
    return currentDate;
}

const createCurrentWeather = (currentData) => {
    const currentLocalDate = createCurrentLocalDate(currentData.LocalObservationDateTime)
    const createCurrentWeatherMarkup = (currentLocalDate, currentData) =>
        `
        <div class='current-conditions-block'>
            <div class='current-location-block'>
                <div class='current-location-country'>${currentData.curentCountry}</div>
                <div class='current-location-city'>${currentData.currentCity}</div>
            </div>
            <div class='current-date'>${currentLocalDate.day}.${currentLocalDate.month}.${currentLocalDate.year}</div>
            <div class='сurrent-weather-block'>
                <div class='current-weather-temperature'>${currentData.Temperature.Metric.Value}  ${currentData.Temperature.Metric.Unit}</div>
                <div class='current-weather-text'>${currentData.WeatherText}</div>
                <div class='current-weather-icon'>
                    <img 
                        src=https://developer.accuweather.com/sites/default/files/${currentData.WeatherIcon < 10 ? `0${currentData.WeatherIcon}` : currentData.WeatherIcon}-s.png
                        alt='${currentData.WeatherText}'
                </div>
            </div>
        </div>
        `
        contentSectionElement.innerHTML = createCurrentWeatherMarkup(currentLocalDate, currentData);
}


const apiGetCurrentConditionsRequest = (currentLocation) => {
    const currentArea = {
        curentCountry: currentLocation.Country.LocalizedName,
        currentCity: currentLocation.LocalizedName
    };
    fetch(`https://dataservice.accuweather.com/currentconditions/v1/${currentLocation.Key}?apikey=${apiKey}&language=${localLang}&details=true`)
        .then(response => response.json())
        .then(data => {
            const currentData = {
                ...currentArea,
                ...data[0]
            };
            createCurrentWeather(currentData);
        })
}

const apiGetCurrentLocationRequest = (userPosition) => {
    fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${userPosition.coords.latitude}%2C%20${userPosition.coords.longitude}&language=${localLang}`)
        .then(response => response.json())
        .then(data => apiGetCurrentConditionsRequest(data[0]))
}

window.onload = function () {
    let userPosition;
    const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 5000
    }
    const geoSuccess = (position) => {
        userPosition = position;
        apiGetCurrentLocationRequest(userPosition)
    };
    const geoError = (error) => {
        alarm('Error occurred. Error code: ' + error.code)
    }
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions)
}

burgerContainerElement.addEventListener('click', event => {
    event.currentTarget.classList.toggle('change');
    menuElement.classList.toggle('open')
})