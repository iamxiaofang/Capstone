// Replace checkForName with a function that checks the URL
const z = require('zod');

// If working on Udacity workspace, update this with the Server API URL e.g. `https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api`
// const serverURL = 'https://wfkdhyvtzx.prod.udacity-student-workspaces.com/api'

function handleSubmit(event) {
    event.preventDefault();

    const zipcode = document.getElementById('zipcode');
    const date = document.getElementById('date');

    const TripSchema = z.object({
        zipcode: z.coerce.number(),
        date: z.coerce.date(),
    });
    const parsed = TripSchema.safeParse({ zipcode: zipcode.value, date: date.value });
    if (parsed.success === false) {
        alert('Invalid request');
        return;
    }

    // If the URL is valid, send it to the server using the serverURL constant above
    getTrip({ zipcode: zipcode.value, date: date.value })
        .then(response => response.json())
        .then((result) => {
            const { weather, imageUrl } = result;
            if (!weather || !imageUrl) {
                alert('Something went wrong, please try again');
                return;
            }
            updateHTML(imageUrl, weather);
        })
        .catch(() => {
            alert('Something went wrong, please try again');
        })

}

function updateHTML(imageUrl, weather) {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.classList.add('city-image');

    const h2 = document.createElement('h2');
    h2.textContent = ` ${weather.city_name} Weather`;

    const div = document.createElement('div');
    div.appendChild(h2);

    for (const day of weather.data) {
        const p = document.createElement('p');
        p.textContent = `${day.datetime} - ${day.high_temp}°C - ${day.weather.description}`;
        div.appendChild(p);
    }

    div.appendChild(image);

    const results = document.getElementById('results');
    results.innerHTML = div.outerHTML;
}

// http://localhost:8000/trip?zipcode=86305&date=03-05-2025
const serverURL = 'http://localhost:8000'
async function getTrip({ zipcode, date }) {
    return fetch(`${serverURL}/trip?${new URLSearchParams({
        zipcode,
        date
    }).toString()}`);
}
// Export the handleSubmit function
export { handleSubmit, updateHTML, getTrip };

