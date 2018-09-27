//keys for api request

// denis.diachenko@outlook.com
//const apiKey = `cyYr3Sjnlgx3TaMpYDca8ZXB8wqd8QJF`

// sarmat4ever@gmail.com
const apiKey = `0miOqEUeJnV7om3LvxsFghUDAl1jEoB8`;

const localLang = `uk-ua`;

const sliderContainerElement = document.querySelector('.slider-container');
const contentSectionElement = document.querySelector('.content-section');
const burgerContainerElement = document.querySelector('.burger-continer');
const switchButtons = document.querySelectorAll('.switch-button');
const menuElement = document.querySelector('.menu');

const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

const addEventListenerForButtons = (switchButtons) => {
    for (const button of switchButtons) {
        button.addEventListener('click', event => {
            const targetButton = event.target;
            const targetClass = event.target.className;
            const targetBlockClassName = `.${targetClass.slice(0, targetClass.indexOf(' '))}-forecast-block`;
            const targetWeatherBlock = document.querySelector(targetBlockClassName);
            const weatherBlocks = document.querySelectorAll('.weather-block')
            if (targetWeatherBlock.style.display === 'none' || targetWeatherBlock.style.display === '') {
                for (let button of switchButtons) {
                    button.removeAttribute('disabled')
                }
                targetButton.setAttribute('disabled', true)

                for (let block of weatherBlocks) {
                    block.style.display = 'none';
                }
                targetWeatherBlock.style.display = 'block';
            }
        })
    }
}

const createSlidesAction = (sliderWrapper, slidesElements) => {
    let i = 1;
    let currentPosition = 0;
    let nextPosition = 0;

    let touchStartX = 0;
    let touchEndX = 0;

    const styles = window.getComputedStyle(slidesElements[i], null);
    const marginRigth = styles.marginRight.slice(0, styles.marginRight.indexOf('p'));

    next.addEventListener('click', event => {
        if (i < slidesElements.length - 2) {
            const offsetWidth = slidesElements[i].offsetWidth;
            currentPosition = offsetWidth + parseInt(marginRigth);
            nextPosition += currentPosition;
            sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
            i++;
        }
        else {
            sliderWrapper.style.transform = `translateX(${0}px)`
            i = 1;
            currentPosition = slidesElements[0].offsetWidth + parseInt(marginRigth);
            nextPosition = 0;
        }
    });
    prev.addEventListener('click', event => {
        if (i > 1) {
            const offsetWidth = slidesElements[i].offsetWidth;
            currentPosition = offsetWidth + parseInt(marginRigth);
            nextPosition -= currentPosition;
            sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
            i--;
        }
        else {
            let allOffsetWidth = 0;
            let allMargins = 0;
            let styles;
            for (let j = 1; j < slidesElements.length - 2; j++) {
                allOffsetWidth += slidesElements[j].offsetWidth;
                styles = window.getComputedStyle(slidesElements[j], null);
                allMargins += parseInt(styles.marginRight.slice(0, styles.marginRight.indexOf('p')));
            }
            nextPosition = allOffsetWidth + allMargins
            sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
            i = slidesElements.length - 2
        }
    });
    sliderWrapper.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].screenX;
        console.log('start ' + touchStartX);
    }, false)

    sliderWrapper.addEventListener('touchend', event => {
        touchEndX = event.changedTouches[0].screenX;
        console.log('end ' + touchEndX)
    }, false)

    sliderWrapper.addEventListener('touchmove', event => {
        if (touchStartX >= touchEndX) {
            if (i < slidesElements.length - 2) {
                const offsetWidth = slidesElements[i].offsetWidth;
                currentPosition = offsetWidth + parseInt(marginRigth);
                nextPosition += currentPosition;
                sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
                i++;
            }
            else {
                sliderWrapper.style.transform = `translateX(${0}px)`
                i = 1;
                currentPosition = slidesElements[0].offsetWidth + parseInt(marginRigth);
                nextPosition = 0;
            }
        }
        else {
            if (i > 1) {
                const offsetWidth = slidesElements[i].offsetWidth;
                currentPosition = offsetWidth + parseInt(marginRigth);
                nextPosition -= currentPosition;
                sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
                i--;
            }
            else {
                let allOffsetWidth = 0;
                let allMargins = 0;
                let styles;
                for (let j = 1; j < slidesElements.length - 2; j++) {
                    allOffsetWidth += slidesElements[j].offsetWidth;
                    styles = window.getComputedStyle(slidesElements[j], null);
                    allMargins += parseInt(styles.marginRight.slice(0, styles.marginRight.indexOf('p')));
                }
                nextPosition = allOffsetWidth + allMargins
                sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
                i = slidesElements.length - 2
            }
        }
    }, false)
}

const createLocalDate = (date) => {
    const localDate = new Date(date);
    const currentDate = {
        year: localDate.getFullYear(),
        month: localDate.getMonth() + 1 < 10 ? `0${localDate.getMonth() + 1}` : localDate.getMonth() + 1,
        day: localDate.getDate() < 10 ? `0${localDate.getDate()}` : localDate.getDate(),
        hours: localDate.getHours(),
        minutes: localDate.getMinutes(),
        seconds: localDate.getSeconds(),
        dayName: localDate.toLocaleString('uk', { weekday: 'long' })[0].toUpperCase() + localDate.toLocaleString('uk', { weekday: 'long' }).slice(1)
    }
    return currentDate;
}

const createCurrentWeather = (currentData) => {
    const currentLocalDate = createLocalDate(currentData.LocalObservationDateTime)
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
    const currentConditionsBlock = document.createElement('div');
    currentConditionsBlock.classList.add('current-conditions-block');
    currentConditionsBlock.innerHTML = createCurrentWeatherMarkup(currentLocalDate, currentData)
    contentSectionElement.insertBefore(currentConditionsBlock, contentSectionElement.firstChild);
}

const createDailyForecastsMarkup = (dailyForecasts) =>
    `       <div class='forecast-wrapper'>
                        <div class='forecasts-date'>
                            ${createLocalDate(dailyForecasts.Date).dayName}
                        </div>
                    ${createForecasts(dailyForecasts, 'Day')}
                    ${createForecasts(dailyForecasts, 'Night')}
            </div>
        `

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
            <div class='daily-forecasts-data-temperature'>
                ${time === 'Day' ? data.Temperature.Maximum.Value : data.Temperature.Minimum.Value} ${data.Temperature.Maximum.Unit}<sup>o</sup>
            </div>
            <div class='daily-forecasts-wind-description'>
                <div class='daily-forecasts-wind'>
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
    const dailyForecastBlock = document.createElement('div');
    dailyForecastBlock.classList.add('daily-forecast-block', 'weather-block')
    dailyForecastBlock.innerHTML = createDailyForecastsMarkup(dailyForecasts);
    contentSectionElement.appendChild(dailyForecastBlock);
}

const createFiveDaysForecast = (dailyForecasts) => {
    const fiveDaysForecastBlock = document.createElement('div');
    const sliderWrapperElement = document.createElement('div');
    sliderWrapperElement.classList.add('slider-wrapper');
    fiveDaysForecastBlock.classList.add('five-days-forecast-block', 'weather-block');
    sliderWrapperElement.innerHTML = dailyForecasts.DailyForecasts.map(item => createDailyForecastsMarkup(item)).join('');
    fiveDaysForecastBlock.appendChild(sliderWrapperElement);
    sliderContainerElement.appendChild(fiveDaysForecastBlock);
}

const apiGetCurrentConditionsRequest = (currentLocation) => {
    return new Promise(async (resolve) => {
        const { Key } = currentLocation
        const currentArea = {
            curentCountry: currentLocation.Country.LocalizedName,
            currentCity: currentLocation.LocalizedName
        };
        const response = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${Key}?apikey=${apiKey}&language=${localLang}&details=true`)
        const data = await response.json();
        const currentData = {
            ...currentArea,
            ...data[0]
        }
        createCurrentWeather(currentData);
        resolve();
    })
}

const apiGetDailyForecastRequest = (currentLocation) => {
    return new Promise(async (resolve) => {
        const { Key } = currentLocation;
        const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/1day/${Key}?apikey=${apiKey}&language=${localLang}&details=true&metric=true`)
        const data = await response.json();
        createDailyForecasts(data.DailyForecasts[0]);
        resolve();
    })
}

const apiGetFiveDaysForecastRequest = (currentLocation) => {
    return new Promise(async (resolve) => {
        const { Key } = currentLocation;
        const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/daily/5day/${Key}?apikey=${apiKey}&language=${localLang}&details=true&metric=true`)
        const data = await response.json();
        createFiveDaysForecast(data);
        resolve();
    })
}

const apiGetCurrentLocationRequest = async (userPosition) => {
    return new Promise(async (resolve) => {
        const { latitude, longitude } = userPosition.coords;
        const response = await fetch(`https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${latitude}%2C%20${longitude}&language=${localLang}`)
        const data = await response.json();
        apiGetCurrentConditionsRequest(data[0]);
        await apiGetDailyForecastRequest(data[0]);
        await apiGetFiveDaysForecastRequest(data[0]);
        resolve();
    })
}


window.onload = () => {
    let userPosition;
    const geoOptions = {
        maximumAge: 5 * 60 * 1000,
        timeout: 5000
    }
    const geoSuccess = async (position) => {
        userPosition = position;
        await apiGetCurrentLocationRequest(userPosition);
        const sliderWrapperElement = document.querySelector('.slider-wrapper');
        const slidesElements = document.querySelectorAll('.forecast-wrapper');
        createSlidesAction(sliderWrapperElement, slidesElements);
    };
    const geoError = (error) => {
        console.log('Error occurred. Error code: ' + error.code)
    }
    switchButtons[0].setAttribute('disabled', true)
    addEventListenerForButtons(switchButtons);
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}

burgerContainerElement.addEventListener('click', event => {
    event.currentTarget.classList.toggle('change');
    menuElement.classList.toggle('open')
})