const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const z = require('zod');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const WEATHER_API_KEY = "9193e8a8f1b149b88fdca8240dd1ec2a";
const WEATHER_API_URL = 'https://api.weatherbit.io/v2.0';

async function getCurrentWeather(lat, lon) {
    return axios.get(`${WEATHER_API_URL}/current?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`);
}

async function getForecastWeather(lat, lon) {
    return axios.get(`${WEATHER_API_URL}/forecast/daily?lat=${lat}&lon=${lon}&days=16&key=${WEATHER_API_KEY}`);
}

async function getGeonames(zipcode) {
    const API_URL = 'http://api.geonames.org';
    const USERNAME = 'xfgan';
    return axios.get(`${API_URL}/postalCodeLookupJSON?postalcode=${zipcode}&country=US&username=${USERNAME}`);
}

async function getImage(q) {
    const API_KEY = "48921487-5e8c412c3283afe00e49cffcb";
    const PIXABAY_URL = "https://pixabay.com/api/"
    return axios.get(`${PIXABAY_URL}?key=${API_KEY}&q=${encodeURIComponent(q)}`);
}

app.get('/trip', async function (req, res) {

    // validate the user input
    const TripSchema = z.object({
        zipcode: z.coerce.number(),
        date: z.coerce.date(),
    });
    const parsed = TripSchema.safeParse(req.query);
    if (parsed.success === false) {
        res.send({ error: 'Invalid request', cause: parsed.error }, 400);
        return;
    }
    // get zipcode and date from the input after validation
    const { zipcode, date } = parsed.data;

    // get lat and lng from the zipcode
    const geonames = await getGeonames(zipcode);
    const { lat, lng, placeName, adminName1, countryCode } = geonames.data.postalcodes[0];

    const one_week = new Date();
    one_week.setDate(one_week.getDate() + 7);
    const isForecast = date > one_week;

    const { data: weather } = isForecast
        ? await getForecastWeather(lat, lng)
        : await getCurrentWeather(lat, lng)

    const image = await getImage(`${placeName}, ${adminName1} ${countryCode}`);
    const randomIndex = Math.floor(Math.random() * image.data.hits.length);

    const imageUrl = (image.data.hits[randomIndex].largeImageURL);

    // the data could have an array of dates so we need to get the correct date for the weather

    res.send({ imageUrl, weather });
});


// http://api.geonames.org/postalCodeLookupJSON?postalcode=6600&country=AT&username=xfgan

// POST Route
app.post('/api', async (req, res) => {
    try {
        res.send({ ok: true });
    } catch (error) {
        res.send({ ok: false, error: error.message });
    }
});

// Designates what port the app will listen to for incoming requests
app.listen(8000, function () {
    console.log('Capstone app listening on http://localhost:8000');
});


