function createCalendar(targetElementId) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();

    const container = document.getElementById(targetElementId);
    container.innerHTML = `
        <div class="calendar-container">
            <header class="calendar-header">
                <p class="calendar-current-date"></p>
                <div class="calendar-navigation">
                    <span id="calendar-prev" class="material-symbols-rounded">chevron_left</span>
                    <span id="calendar-next" class="material-symbols-rounded">chevron_right</span>
                </div>
            </header>

            <div class="calendar-body">
                <ul class="calendar-weekdays">
                    <li>Mån</li>
                    <li>Tis</li>
                    <li>Ons</li>
                    <li>Tor</li>
                    <li>Fre</li>
                    <li>Lör</li>
                    <li>Sön</li>
                </ul>
                <ul class="calendar-dates"></ul>
            </div>
        </div>

        <div class="modal" id="eventModal">
            <span id="closeModal" style="cursor: pointer;">✖</span>
            <div id="eventDetails"></div>
        </div>
    `;

    const day = container.querySelector(".calendar-dates");
    const currdate = container.querySelector(".calendar-current-date");
    const prenexIcons = container.querySelectorAll(".calendar-navigation span");

    const months = [
        "Januari",
        "Februari",
        "Mars",
        "April",
        "Maj",
        "Juni",
        "Juli",
        "Augusti",
        "September",
        "Oktober",
        "November",
        "December"
    ];

    const manipulate = () => {
        let dayone = new Date(year, month, 0).getDay();
        let lastdate = new Date(year, month + 1, 0).getDate();
        let dayend = new Date(year, month, lastdate).getDay();
        let monthlastdate = new Date(year, month, 0).getDate();
        let lit = "";

        for (let i = dayone; i > 0; i--) {
            lit += `<li class="inactive">${monthlastdate - i + 1}</li>`;
        }

        for (let i = 1; i <= lastdate; i++) {
            let isToday = i === date.getDate() && month === date.getMonth() && year === date.getFullYear() ? "active" : "";
            lit += `<li class="${isToday}">${i}</li>`;
        }

        for (let i = dayend; i < 6; i++) {
            lit += `<li class="inactive">${i - dayend + 1}</li>`;
        }

        currdate.innerText = `${months[month]} ${year}`;
        day.innerHTML = lit;
        hämtaOchVisaData();
    };

    prenexIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            month = icon.id === "calendar-prev" ? month - 1 : month + 1;

            if (month < 0) {
                month = 11;
                year--;
            } else if (month > 11) {
                month = 0;
                year++;
            }

            manipulate();
        });
    });

    function hämtaOchVisaData() {
        fetch('./events.json')
            .then(response => response.json())
            .then(data => {
                data.events.forEach(event => {
                    const eventDate = new Date(event.date);
                    const eventMonth = eventDate.getMonth();
                    const eventYear = eventDate.getFullYear();

                    if (eventMonth === month && eventYear === year) {
                        const dayElement = container.querySelector(`.calendar-dates li:nth-child(${eventDate.getDate()})`);
                        if (dayElement) {
                            dayElement.classList.add('event-marker');
                            dayElement.addEventListener('click', () => showEventModal(event, targetElementId));
                        }
                    }
                });
            })
            .catch(error => console.error('Ett fel uppstod:', error));
    }

    function showEventModal(event, targetElementId) {
        const modal = container.querySelector('#eventModal');
        const closeModalButton = container.querySelector('#closeModal');
        const eventDetails = container.querySelector('#eventDetails');

        eventDetails.innerHTML = `
            <p>${event.name}</p>
            <p>Tid: ${event.time}</p>
            <p>Plats: ${event.place}</p>
            <p>Arrangör: ${event.arrangör}</p>
        `;

        modal.style.display = 'block';

        closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Initialize the calendar for the first time
    manipulate();
}
