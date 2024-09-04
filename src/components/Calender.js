import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for draggable events

const MyCalendar = () => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={[
        { title: 'Event 1', date: '2024-09-01' },
        { title: 'Event 2', date: '2024-09-02' },
      ]}
    />
  );
};

export default MyCalendar;
