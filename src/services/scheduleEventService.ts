// src/services/scheduleEventService.ts
import { ScheduleEventLabel } from "@/types/entities/scheduleEvent";

interface CreateScheduleEventRequest {
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  eventLabel?: ScheduleEventLabel;
  scheduleId: string; // The ID of the schedule this event belongs to
}

interface ScheduleEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  eventLabel?: ScheduleEventLabel;
  scheduleId: string;
  createdAt: string;
}

/**
 * Creates a new schedule event
 * @param scheduleId - The ID of the schedule to add the event to
 * @param eventData - The event data
 * @returns The created schedule event
 */
export async function createScheduleEvent(
  scheduleId: string,
  eventData: Omit<CreateScheduleEventRequest, "scheduleId">
): Promise<ScheduleEvent> {
  try {
    // In a real application, this would be an API call
    // For now, we'll mock the creation of an event

    // Validate required fields
    if (!eventData.name || !eventData.startTime || !eventData.endTime) {
      throw new Error("Name, start time, and end time are required");
    }

    // Validate that end time is after start time
    if (new Date(eventData.endTime) <= new Date(eventData.startTime)) {
      throw new Error("End time must be after start time");
    }

    // Create the event with generated ID and current timestamp
    const newEvent: ScheduleEvent = {
      id: `event-${Date.now()}`, // Generate a unique ID
      ...eventData,
      scheduleId,
      eventLabel: eventData.eventLabel || "primary", // Default to "primary" if not specified
      createdAt: new Date().toISOString(),
    };

    // In a real application, you would save this to your backend
    console.log("Created new schedule event:", newEvent);

    return newEvent;
  } catch (error) {
    console.error("Failed to create schedule event:", error);
    throw error;
  }
}

/**
 * Integrates with the existing Calendar component to add a new event
 * @param scheduleId - The ID of the schedule
 * @param eventData - The event data to create
 * @returns The event in CalendarEvent format
 */
export async function addEventToCalendar(
  scheduleId: string,
  eventData: Omit<CreateScheduleEventRequest, "scheduleId">
): Promise<{
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    calendar: string;
    scheduleId: string;
    description: string;
    location: string;
  };
}> {
  const createdEvent = await createScheduleEvent(scheduleId, eventData);

  // Transform to the format expected by the Calendar component
  return {
    id: createdEvent.id,
    title: createdEvent.name,
    start: createdEvent.startTime,
    end: createdEvent.endTime,
    allDay: false,
    extendedProps: {
      calendar: createdEvent.eventLabel || "primary",
      scheduleId: createdEvent.scheduleId,
      description: createdEvent.description,
      location: createdEvent.location,
    },
  };
}
