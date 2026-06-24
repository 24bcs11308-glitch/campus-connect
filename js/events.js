document.addEventListener("DOMContentLoaded", function () {
    let events = JSON.parse(localStorage.getItem("events")) || [];

    const eventsList = document.getElementById("events-list");

    if (events.length === 0) {
        eventsList.innerHTML = "<p>No events added yet.</p>";
    } else {
        events.forEach(event => {
            const eventCard = document.createElement("div");

            eventCard.innerHTML = `
                <h3>${event.eventName}</h3>
                <p>Date: ${event.date}</p>
                <p>Venue: ${event.venue}</p>
                <hr>
            `;

            eventsList.appendChild(eventCard);
        });
    }
});