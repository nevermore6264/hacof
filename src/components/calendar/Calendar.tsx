// src/components/calendar/Calendar.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal";
import { fetchMockSchedules } from "@/app/hackathon/[id]/team/[teamId]/board/_mock/fetchMockSchedules";
import { Schedule } from "@/types/entities/schedule";

export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    scheduleId?: string;
    description?: string;
    location?: string;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        // You might want to pass actual teamId, createdByUserName, and hackathonId
        const fetchedSchedules = await fetchMockSchedules();
        setSchedules(fetchedSchedules);

        // Transform schedules into calendar events
        const calendarEvents: CalendarEvent[] = fetchedSchedules.flatMap(
          (schedule) =>
            schedule.scheduleEvents.map((event) => ({
              id: event.id,
              title: event.name,
              start: event.startTime,
              end: event.endTime,
              allDay: false,
              extendedProps: {
                calendar: event.eventLabel || "primary",
                scheduleId: schedule.id,
                description: event.description,
                location: event.location,
              },
            }))
        );

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      }
    };

    loadSchedules();
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedEvent(null);
    openAddModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openEditModal();
  };

  const handleAddEvent = (eventData: {
    title: string;
    startDate: string;
    endDate: string;
    level: string;
  }) => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventData.title,
      start: eventData.startDate,
      end: eventData.endDate,
      allDay: true,
      extendedProps: {
        calendar: eventData.level,
        description: "",
        location: "",
      },
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    closeAddModal();
  };

  const handleUpdateEvent = (eventData: {
    title: string;
    startDate: string;
    endDate: string;
    level: string;
  }) => {
    if (!selectedEvent) return;

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: eventData.title,
              start: eventData.startDate,
              end: eventData.endDate,
              extendedProps: {
                ...event.extendedProps,
                calendar: eventData.level,
              },
            }
          : event
      )
    );
    closeEditModal();
  };

  const renderEventTooltip = (eventInfo: EventContentArg) => {
    const event = eventInfo.event;
    const extendedProps = event.extendedProps as CalendarEvent["extendedProps"];

    return (
      <div
        className={`event-tooltip event-fc-color flex fc-event-main fc-bg-${extendedProps.calendar.toLowerCase()} p-1 rounded-sm`}
      >
        <div className="flex flex-col">
          <div className="font-bold">{event.title}</div>
          {extendedProps.description && (
            <div className="text-xs">{extendedProps.description}</div>
          )}
          {extendedProps.location && (
            <div className="text-xs italic">
              Location: {extendedProps.location}
            </div>
          )}
          <div className="text-xs">
            {event.start?.toLocaleString()} - {event.end?.toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Team Schedule</h2>
        {schedules.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Schedules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-gray-100 p-3 rounded-lg">
                  <h4 className="font-medium">{schedule.name}</h4>
                  <p className="text-sm text-gray-600">
                    {schedule.description}
                  </p>
                  {schedule.team && (
                    <p className="text-xs text-gray-500">
                      Team: {schedule.team.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventTooltip}
          customButtons={{
            addEventButton: {
              text: "Add Event +",
              click: openAddModal,
            },
          }}
        />
      </div>
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddEvent={handleAddEvent}
      />
      {selectedEvent && (
        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          selectedEvent={selectedEvent}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </div>
  );
};

export default Calendar;
