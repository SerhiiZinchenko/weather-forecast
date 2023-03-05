'use strict'

const cityInput = document.getElementById('city-input');
const cityList = document.getElementById('city-list');

cityInput.addEventListener('input', function () {
    const query = this.value;
    if (query.length > 0) {
        const XHR = new XMLHttpRequest();
        XHR.open('GET', `http://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=8144ea5ad0a23d10dc61228957515eee`);
        XHR.onload = function () {
            if (XHR.status === 200) {
                const data = JSON.parse(XHR.responseText);
                let results = '';
                data.forEach(city => {
                    results += `<li><button>${city.name}</button></li>`;
                });
                cityList.innerHTML = results;
            } else {
                console.error(XHR.statusText);
            }
        };
        XHR.onerror = function () {
            console.error(XHR.statusText);
        };
        XHR.send();
    } else {
        cityList.innerHTML = '';
    }
});