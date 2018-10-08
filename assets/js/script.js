//keys for api request

// denis
//const apiKey = `cyYr3Sjnlgx3TaMpYDca8ZXB8wqd8QJF`;

// sarmat
const apiKey = `0miOqEUeJnV7om3LvxsFghUDAl1jEoB8`;

const localLang = `uk-ua`;

const sliderContainerElement = document.querySelector('.slider-container');
const contentSectionElement = document.querySelector('.content-section');
const burgerContainerElement = document.querySelector('.burger-continer');
const switchButtons = document.querySelectorAll('.switch-button');
const menuElement = document.querySelector('.menu');

const sliderNavElement = document.querySelector('.slider-nav');

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
            const timePeriod = targetClass.slice(0, targetClass.indexOf(' '));
            timePeriod === 'five-days' ? sliderNavElement.style.display = 'flex' : sliderNavElement.style.display = 'none'
            if (targetWeatherBlock.style.display === 'none' || targetWeatherBlock.style.display === '') {
                for (let block of weatherBlocks) {
                    block.style.display = 'none';
                }
                targetWeatherBlock.style.display = 'block';
            }
        })
    }
}

const createSlidesAction = (sliderWrapper) => {
    let i = 0;
    let currentPosition = 0;
    let nextPosition = 0;

    let touchStartX = 0;
    let touchEndX = 0;

    const slidesElements = sliderWrapper.children;

    const styles = window.getComputedStyle(slidesElements[i], null);
    const marginRigth = styles.marginRight.slice(0, styles.marginRight.indexOf('p'));

    next.addEventListener('click', event => {
        if (i < slidesElements.length - 1) {
            const offsetWidth = slidesElements[i].offsetWidth;
            currentPosition = offsetWidth + parseInt(marginRigth);
            nextPosition += currentPosition;
            sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
            i++;
        }
        else {
            sliderWrapper.style.transform = `translateX(${0}px)`
            i = 0;
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
            for (let j = 1; j < slidesElements.length; j++) {
                allOffsetWidth += slidesElements[j].offsetWidth;
                styles = window.getComputedStyle(slidesElements[j], null);
                allMargins += parseInt(styles.marginRight.slice(0, styles.marginRight.indexOf('p')));
            }
            nextPosition = allOffsetWidth + allMargins
            sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
            i = slidesElements.length - 1;
        }
    });
    sliderWrapper.addEventListener('touchstart', event => {

        touchStartX = event.changedTouches[0].screenX;
    }, false)

    sliderWrapper.addEventListener('touchend', event => {

        touchEndX = event.changedTouches[0].screenX;
        if (touchStartX >= touchEndX) {
            if (i < slidesElements.length - 1) {
                const offsetWidth = slidesElements[i].offsetWidth;
                currentPosition = offsetWidth + parseInt(marginRigth);
                nextPosition += currentPosition;
                sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
                i++;
            }
            else {
                sliderWrapper.style.transform = `translateX(${0}px)`
                i = 0;
                currentPosition = slidesElements[0].offsetWidth + parseInt(marginRigth);
                nextPosition = 0;
            }
        }
        else {
            if (i > 0) {
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
                for (let j = 1; j < slidesElements.length; j++) {
                    allOffsetWidth += slidesElements[j].offsetWidth;
                    styles = window.getComputedStyle(slidesElements[j], null);
                    allMargins += parseInt(styles.marginRight.slice(0, styles.marginRight.indexOf('p')));
                }
                nextPosition = allOffsetWidth + allMargins
                sliderWrapper.style.transform = `translateX(-${nextPosition}px)`;
                i = slidesElements.length - 1;
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
    const createCurrentWeatherMarkup = (currentData) =>
        `
            <div class='current-location-block'>
                <div class='current-location-country'>${currentData.curentCountry},</div>
                <div class='current-location-city'>${currentData.currentCity}</div>
            </div>
            <div class='сurrent-weather-block'>
                <div class='current-weather-icon'>
                    <img 
                        src='https://developer.accuweather.com/sites/default/files/${currentData.WeatherIcon < 10 ? `0${currentData.WeatherIcon}` : currentData.WeatherIcon}-s.png'
                        alt='${currentData.WeatherText}' />
                </div>
                <div class='current-weather-temperature'>
                <span>
                    <?xml version="1.0"?>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="-184 0 581 581.55153" width="40px"><g transform="matrix(0.762267 0 0 0.762267 25.3186 69.1271)"><path d="m107.15625 0c-37.46875.0429688-67.832031 30.40625-67.875 67.875v325.101562c-28.816406 23.519532-43.148438 60.460938-37.734375 97.261719 8.230469 58.328125 62.191406 98.9375 120.515625 90.703125 52.707031-7.441406 91.859375-52.601562 91.75-105.828125.097656-31.824219-14.148438-61.992187-38.785156-82.136719v-325.101562c-.039063-37.46875-30.402344-67.8320312-67.871094-67.875zm87.265625 475.113281c.0625 48.191407-38.953125 87.316407-87.148437 87.378907-48.195313.066406-87.320313-38.953126-87.382813-87.148438-.035156-27.507812 12.898437-53.421875 34.90625-69.925781 2.441406-1.832031 3.878906-4.707031 3.878906-7.757813v-29.207031h19.390625v-19.390625h-19.390625v-29.089844h19.390625v-19.390625h-19.390625v-29.089843h19.390625v-19.390626h-19.390625v-29.089843h19.390625v-19.390625h-19.390625v-29.089844h19.390625v-19.390625h-19.390625v-29.089844h19.390625v-19.390625h-19.390625v-38.785156c0-26.777344 21.703125-48.480469 48.480469-48.480469 26.773438 0 48.480469 21.703125 48.480469 48.480469v329.804688c0 3.050781 1.4375 5.925781 3.878906 7.753906 22.019531 16.382812 34.96875 42.234375 34.90625 69.679687zm0 0" data-original="#000000" class="active-path" fill="#000000"/><path d="m116.851562 427.601562v-340.335937h-19.390624v340.335937c-26.234376 5.355469-43.160157 30.960938-37.804688 57.195313s30.960938 43.160156 57.195312 37.804687c26.234376-5.355468 43.160157-30.960937 37.804688-57.195312-3.886719-19.042969-18.765625-33.917969-37.804688-37.804688zm-9.695312 76.597657c-16.066406 0-29.089844-13.023438-29.089844-29.085938 0-16.066406 13.023438-29.089843 29.089844-29.089843s29.089844 13.023437 29.089844 29.089843c0 16.0625-13.023438 29.085938-29.089844 29.085938zm0 0" data-original="#000000" class="active-path" fill="#000000"/></g> </svg>

                </span>
                <span>${currentData.Temperature.Metric.Value}  ${currentData.Temperature.Metric.Unit}<sup>o</sup></span>
                </div>
            </div>
    `
    const currentConditionsBlock = document.createElement('div');
    currentConditionsBlock.classList.add('current-conditions-block');

    if(currentLocalDate.hours > 5 && currentLocalDate.hours < 11) {
        document.body.style.backgroundImage = "url('assets/img/sunrise.jpg')";
    }
    if(currentLocalDate.hours > 10 && currentLocalDate.hours < 18) {
        document.body.style.backgroundImage = "url('assets/img/day.jpg')";
    }
    if(currentLocalDate.hours > 17 && currentLocalDate.hours < 20) {
        document.body.style.backgroundImage = "url('assets/img/sunset.jpg')";
    }
    if(currentLocalDate.hours > 19 && currentLocalDate.hours < 23 && currentLocalDate.hours > 0 && currentLocalDate.hours < 5) {
        document.body.style.backgroundImage = "url('assets/img/night.jpg')";
    }
    
    currentConditionsBlock.innerHTML = createCurrentWeatherMarkup(currentData)
    contentSectionElement.insertBefore(currentConditionsBlock, contentSectionElement.firstChild);
}

const createDailyForecastsMarkup = (dailyForecasts) =>
    `       <div class='forecast-wrapper'>
                        <div class='forecasts-date'>
                            ${createLocalDate(dailyForecasts.Date).dayName}
                        </div>
                        <div class='forecast-container'>
                            ${createForecasts(dailyForecasts, 'Day')}
                            ${createForecasts(dailyForecasts, 'Night')}
                        </div>
            </div>
        `

const createForecasts = (data, time) =>
    `
     <div class='daily-forecasts-data'>
        <div class='daily-forecasts-data-description'>
        <img class='daily-forecasts-data-condition-icon' 
                src='https://developer.accuweather.com/sites/default/files/${data[time].Icon < 10 ? `0${data[time].Icon}` : data[time].Icon}-s.png'
                alt='${data[time].IconPhrase}' />
            <div class='daily-forecasts-data-temperature'>
                ${time === 'Day' ? data.Temperature.Maximum.Value : data.Temperature.Minimum.Value} ${data.Temperature.Maximum.Unit}<sup>o</sup>
            </div> 
        <div class='daily-forecasts-precipitation'>
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

const createTwelveHoursForecast = (data) => {
    const createMarkup = forecast =>
        `
        <div class='twelve-hours forecast-container'>
        <div class='date-hour'>
            ${createLocalDate(forecast.DateTime).hours < 10 ? 
            `0${createLocalDate(forecast.DateTime).hours}`
             : createLocalDate(forecast.DateTime).hours} : 0${createLocalDate(forecast.DateTime).minutes} 
        </div>
        <div class='hours-weather-block'>
                <span>
                    <?xml version="1.0"?>
                    <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="-184 0 581 581.55153" width="40px"><g transform="matrix(0.762267 0 0 0.762267 25.3186 69.1271)"><path d="m107.15625 0c-37.46875.0429688-67.832031 30.40625-67.875 67.875v325.101562c-28.816406 23.519532-43.148438 60.460938-37.734375 97.261719 8.230469 58.328125 62.191406 98.9375 120.515625 90.703125 52.707031-7.441406 91.859375-52.601562 91.75-105.828125.097656-31.824219-14.148438-61.992187-38.785156-82.136719v-325.101562c-.039063-37.46875-30.402344-67.8320312-67.871094-67.875zm87.265625 475.113281c.0625 48.191407-38.953125 87.316407-87.148437 87.378907-48.195313.066406-87.320313-38.953126-87.382813-87.148438-.035156-27.507812 12.898437-53.421875 34.90625-69.925781 2.441406-1.832031 3.878906-4.707031 3.878906-7.757813v-29.207031h19.390625v-19.390625h-19.390625v-29.089844h19.390625v-19.390625h-19.390625v-29.089843h19.390625v-19.390626h-19.390625v-29.089843h19.390625v-19.390625h-19.390625v-29.089844h19.390625v-19.390625h-19.390625v-29.089844h19.390625v-19.390625h-19.390625v-38.785156c0-26.777344 21.703125-48.480469 48.480469-48.480469 26.773438 0 48.480469 21.703125 48.480469 48.480469v329.804688c0 3.050781 1.4375 5.925781 3.878906 7.753906 22.019531 16.382812 34.96875 42.234375 34.90625 69.679687zm0 0" data-original="#000000" class="active-path" fill="#000000"/><path d="m116.851562 427.601562v-340.335937h-19.390624v340.335937c-26.234376 5.355469-43.160157 30.960938-37.804688 57.195313s30.960938 43.160156 57.195312 37.804687c26.234376-5.355468 43.160157-30.960937 37.804688-57.195312-3.886719-19.042969-18.765625-33.917969-37.804688-37.804688zm-9.695312 76.597657c-16.066406 0-29.089844-13.023438-29.089844-29.085938 0-16.066406 13.023438-29.089843 29.089844-29.089843s29.089844 13.023437 29.089844 29.089843c0 16.0625-13.023438 29.085938-29.089844 29.085938zm0 0" data-original="#000000" class="active-path" fill="#000000"/></g> </svg>
                </span>
            <span class='temperature'>${forecast.Temperature.Value} ${forecast.Temperature.Unit}<sup>o</sup></span>
            <img src='https://developer.accuweather.com/sites/default/files/${forecast.WeatherIcon< 10 ? `0${forecast.WeatherIcon}` : forecast.WeatherIcon}-s.png'
             alt='${forecast.IconPhrase}' />
        </div>
        </div>
        `
    const twelveHoursForecastElement = document.createElement('div');
    twelveHoursForecastElement.classList.add('daily-forecast-block', 'weather-block');
    twelveHoursForecastElement.innerHTML = data.map(createMarkup).join('');
    contentSectionElement.appendChild(twelveHoursForecastElement);
    twelveHoursForecastElement.addEventListener('click', event => {
        twelveHoursForecastElement.classList.toggle('open');
    })
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

const apiGetTwelveHoursForecast = (currentLocation) => {
    return new Promise(async (resolve) => {
        const { Key } = currentLocation;
        const response = await fetch(`https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${Key}?apikey=${apiKey}&language=${localLang}&details=false&metric=true`)
        const data = await response.json();
        createTwelveHoursForecast(data);
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
        await apiGetTwelveHoursForecast(data[0]);
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
        createSlidesAction(sliderWrapperElement);
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