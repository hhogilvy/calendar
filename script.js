// script.js
const addButtons = document.querySelectorAll('.add-to-calendar');

addButtons.forEach(button => {
    button.addEventListener('click', showCalendarOptions);
});

function showCalendarOptions(event) {
    const eventData = JSON.parse(event.target.parentElement.getAttribute('data-event'));

    const startTime = new Date(eventData.start).toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(eventData.end).toISOString().replace(/-|:|\.\d+/g, '');

    const calendarEvent = {
        title: eventData.title,
        description: eventData.description,
        start: startTime,
        end: endTime
    };

    // Create the pop-up container
    const popup = document.createElement('div');
    popup.id = 'calendar-popup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100' ;
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.zIndex = '1000';

    // Create the pop-up content
    const popupContent = document.createElement('div');
    popupContent.style.backgroundColor = '#fff';
    popupContent.style.padding = '20px';
    popupContent.style.borderRadius = '5px';

    // Add calendar options
    popupContent.innerHTML = `
        <h2>Add to Calendar</h2>
        <p>Choose your preferred calendar:</p>
        <ul>
            <li><a href="${getGoogleCalendarUrl(calendarEvent)}" target="_blank">Google Calendar</a></li>
            <li><a href="${getOutlookOnlineUrl(calendarEvent)}" target="_blank">Outlook Online</a></li>
            <li><a href="#" onclick="downloadIcs(${JSON.stringify(calendarEvent)}); return false;">Download .ics File</a></li>
        </ul>
        <button onclick="closePopup()">Close</button>
    `;

    // Append the content to the pop-up and the pop-up to the body
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

function getGoogleCalendarUrl(eventData) {
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', eventData.title);
    googleCalendarUrl.searchParams.set('dates', `${eventData.start}/${eventData.end}`);
    googleCalendarUrl.searchParams.set('details', eventData.description);
    return googleCalendarUrl.toString();
}

function getOutlookOnlineUrl(eventData) {
    const outlookUrl = new URL('https://outlook.live.com/calendar/0/view/event');
    outlookUrl.searchParams.set('subject', eventData.title);
    outlookUrl.searchParams.set('body', eventData.description);
    outlookUrl.searchParams.set('startdt', eventData.start.slice(0, -3)); // Remove seconds
    outlookUrl.searchParams.set('enddt', eventData.end.slice(0, -3)); // Remove seconds
    return outlookUrl.toString();
}

function downloadIcs(eventData) {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${eventData.start}
DTEND:${eventData.end}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${eventData.title}.ics`;
    link.click();
    closePopup(); 

    // Revoke object URL to prevent memory leaks
    setTimeout(() => {
        window.URL.revokeObjectURL(link.href); 
    }, 100); 
}

function closePopup() {
    const popup = document.getElementById('calendar-popup');
    if (popup) {
        document.body.removeChild(popup);
    }
}
