//keys for api request

// denis.diachenko@outlook.com
// const apiKey = `cyYr3Sjnlgx3TaMpYDca8ZXB8wqd8QJF`

// sarmat4ever@gmail.com
const apiKey = `0miOqEUeJnV7om3LvxsFghUDAl1jEoB8`;

const localLang = `uk-ua`;

const contentSectionElement = document.querySelector('.content-section');
const burgerContainerElement = document.querySelector('.burger-continer')
const menuElement = document.querySelector('.menu')

const createCurrentLocalDate = (date) => {
    const localDate = new Date(date);
    const currentDate = {
        year: localDate.getFullYear(),
        month: localDate.getMonth() + 1 < 10 ? `0${localDate.getMonth() + 1}` : localDate.getMonth() + 1,
        day: localDate.getDate() < 10 ? `0${localDate.getDate()}` : localDate.getDate(),
        hours: localDate.getHours(),
        minutes: localDate.getMinutes(),
        seconds: localDate.getSeconds()
    }
    return currentDate;
}

const createCurrentWeather = (currentData) => {
    const currentLocalDate = createCurrentLocalDate(currentData.LocalObservationDateTime)
    const createCurrentWeatherMarkup = (currentLocalDate, currentData) =>
    `
        <div class='current-conditions-block'>
            <div class='current-condition-title'>Зараз</div>
            <div class='current-location-block'>
                <div class='current-location-country'>${currentData.curentCountry}</div>
                <div class='current-location-city'>${currentData.currentCity}</div>
            </div>
            <div class='current-location-date'>
                <div class='current-date'>${currentLocalDate.day}.${currentLocalDate.month}.${currentLocalDate.year}</div>
                <div class='current-time'> Дані станом на ${currentLocalDate.hours}:${currentLocalDate.minutes}:${currentLocalDate.seconds}</div>
            </div>
            <div class='сurrent-weather-block'>
                <div class='current-weather-temperature'>${currentData.Temperature.Metric.Value}  ${currentData.Temperature.Metric.Unit}<sup>o</sup></div>
                <div class='current-weather-text'>${currentData.WeatherText}</div>
                <div class='current-weather-icon'>
                    <img 
                        src='https://developer.accuweather.com/sites/default/files/${currentData.WeatherIcon < 10 ? `0${currentData.WeatherIcon}` : currentData.WeatherIcon}-s.png'
                        alt='${currentData.WeatherText}' />
                </div>
            </div>
        </div>
    `    
    contentSectionElement.innerHTML = createCurrentWeatherMarkup(currentLocalDate, currentData);
}

const createForecasts = (data, time) =>
    `
     <div class='daily-forecasts-data'>
        <div class='daily-forecasts-data-condition-header'>
            <img class='daily-forecasts-data-condition-icon' 
                src='https://developer.accuweather.com/sites/default/files/${data[time].Icon < 10 ? `0${data[time].Icon}` : data[time].Icon}-s.png'
                alt='${data[time].IconPhrase}' />
            <span class='daily-forecasts-data-condition-text'>${data[time].LongPhrase}</span>
        </div>
        <div class='daily-forecasts-data-description>
            <div class='daily-forecasts-data-temperature>
                ${time === 'Day' ? data.Temperature.Maximum.Value : data.Temperature.Minimum.Value} ${data.Temperature.Maximum.Unit}<sup>o</sup>
            </div>
            <div class='daily-forecasts-wind-description>
                <div class='daily-forecasts-wind>
                    <div>Швидкість вітру: ${data[time].Wind.Speed.Value} ${data[time].Wind.Speed.Unit}</div>
                    <div>Напрямок: ${data[time].Wind.Direction.Localized}</div>
                </div>
            <div class='daily-forecasts-windGust'>
                Швидкість пориву: ${data[time].WindGust.Speed.Value} ${data[time].WindGust.Speed.Unit}
            </div> 
        <div class='daily-forecasts-precipitation'>
            <div>Ймовірність опадів: ${data[time].PrecipitationProbability}%</div>
                ${data[time].Rain.Value > 0 ?
        (`<div><span>Дощ:</span> ${data[time].Rain.Value} ${data[time].Rain.Unit}</div>`) :
        ''}
                ${data[time].Snow.Value > 0 ?
        (`<div><span>Сніг:</span> ${data[time].Snow.Value} ${data[time].Snow.Unit}</div>`) :
        ''}
                ${data[time].Ice.Value > 0 ?
        (`<div><span>Ожеледиця:</span> ${data[time].Ice.Value} ${data[time].Ice.Unit}</div>`) :
        ''}
            </div>
        </div>
    </div>
    `


const createDailyForecasts = (dailyForecasts) => {
    const createDailyForecastsMarkup = (dailyForecasts) =>
        `
        <div class='daily-forecasts-block'>
        <div class='daily-forecasts-title>Сьогодні</div>
            ${createForecasts(dailyForecasts, 'Day')}
            ${createForecasts(dailyForecasts, 'Night')}
        </div>
        `
    const dailyForecastBlock = document.createElement('div');
    dailyForecastBlock.innerHTML = createDailyForecastsMarkup(dailyForecasts)
    contentSectionElement.appendChild(dailyForecastBlock);
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

const apiGetDailyForecastRequest = (currentLocation) => {
    const { Key } = currentLocation;
    fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${Key}?apikey=${apiKey}&language=${localLang}&details=true&metric=true`)
        .then(response => response.json())
        .then(data => createDailyForecasts(data.DailyForecasts[0]))
}

const apiGetCurrentLocationRequest = (userPosition) => {
    const { latitude, longitude } = userPosition.coords;
    fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${latitude}%2C%20${longitude}&language=${localLang}`)
        .then(response => response.json())
        .then(data => {
            apiGetCurrentConditionsRequest(data[0])
            apiGetDailyForecastRequest(data[0])
        })
}


window.onload = function () {
    let userPosition;
    const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 5000
    }
    const geoSuccess = (position) => {
        userPosition = position;
        apiGetCurrentLocationRequest(userPosition);
    };
    const geoError = (error) => {
        console('Error occurred. Error code: ' + error.code)
    }
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions)
}

burgerContainerElement.addEventListener('click', event => {
    event.currentTarget.classList.toggle('change');
    menuElement.classList.toggle('open')
})