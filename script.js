// script.js
const addButtons = document.querySelectorAll('.add-to-calendar');

addButtons.forEach(button => {
    
    button.addEventListener('click', addToCalendar);
});

function addToCalendar(event) {
    const eventData = JSON.parse(event.target.parentElement.getAttribute('data-event'));

    const startTime = new Date(eventData.start).toISOString().replace(/-|:|\.\d+/g, '');
    const endTime = new Date(eventData.end).toISOString().replace(/-|:|\.\d+/g, '');

    const calendarEvent = {
        title: eventData.title,
        description: eventData.description,
        start: startTime,
        end: endTime
    };

    // Choose a method for adding to calendar:
    // 1. Download .ics file (simplest, but requires user action)
    //downloadIcs(calendarEvent);

    // 2. Open calendar app with pre-filled event (more complex, may not work on all devices/browsers)
     openCalendarApp(calendarEvent);
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
}

function openCalendarApp(eventData) {
    // Constructing the URL might require different approaches 
    // depending on the calendar app (Google Calendar, Outlook, etc.)
    // Here's a basic example for Google Calendar:
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', eventData.title);
    googleCalendarUrl.searchParams.set('dates', `${eventData.start}+${eventData.end}`);
    googleCalendarUrl.searchParams.set('details', eventData.description);

    window.open(googleCalendarUrl, '_blank');
}