'use strict'

const input = document.getElementById('city');
const button = document.getElementById('btn');
const cityList = document.getElementById('cityList');
let chart = null;

input.addEventListener('input', function () {
    const inputValue = input.value;
    if (inputValue.length > 0) {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=20&appid=8144ea5ad0a23d10dc61228957515eee`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const cities = data.map(city => city.name);
                const uniqueCities = [...new Set(cities)];
                cityList.innerHTML = '';
                uniqueCities.forEach(city => {
                    const li = document.createElement('li');
                    li.textContent = city;
                    li.addEventListener('click', function () {
                        input.value = city;
                        cityList.innerHTML = '';
                    });
                    cityList.prepend(li);
                });
            })
            .catch(error => console.log(error));
    }
    else {
        cityList.innerHTML = '';
    }
});

button.addEventListener('click', function () {
    const selectedCity = input.value;
    if (chart) {
        chart.destroy();
    }
    getChartData(selectedCity);
});

function getChartData(selectedCity) {
    const apiKey = '8144ea5ad0a23d10dc61228957515eee';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.weather-city').textContent = selectedCity;
            document.querySelector('.weather-description').textContent = data.weather[0].description;
            document.querySelector('.weather-temp').textContent = `${data.main.temp.toFixed()}°C`;

            const currentDay = new Date().toISOString().slice(0, 10);
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=metric`;
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    const temps = data.list.map(item => item.main.temp);
                    const hours = data.list.map(item => new Date(item.dt_txt).getHours());

                    chart = new Chart(document.querySelector('#chart'), {
                        type: 'line',
                        data: {
                            labels: hours,
                            datasets: [
                                {
                                    label: 'Температура',
                                    data: temps,
                                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                                    borderColor: 'blue',
                                    borderWidth: 1
                                }
                            ]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}