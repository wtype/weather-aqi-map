let lat;
let lon;

if ('geolocation' in navigator) {
  console.log('Geolocation available');
  navigator.geolocation.getCurrentPosition(async pos => {
    let lat;
    let lon;
    let weather;
    let air;
    try {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      document.querySelector('#latitude').textContent = lat.toFixed(2);
      document.querySelector('#longitude').textContent = lon.toFixed(2);

      const API_URL = `weather/${lat},${lon}`;
      const response = await fetch(API_URL);
      const data = await response.json();
      weather = data.weather.currently;
      air = data.air.results[0].measurements[0];

      document.querySelector('#summary').textContent = weather.summary;
      document.querySelector('#temperature').textContent = weather.temperature;
      document.querySelector('#particles').textContent = air.value;
    } catch (error) {
      console.log('Error', error);
      air = { value: -1 };
    }

    const info = { lat, lon };
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(info),
    };
    const res = await fetch('/api', options);
    const json = await res.json();
    console.log(json);
  });
} else {
  console.log('Geolocation not available');
}
