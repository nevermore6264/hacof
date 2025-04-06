// src/components/calendar/EditEventModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { CalendarEvent } from "./Calendar";
import { useAuth } from "@/hooks/useAuth_v0";
import { User } from "@/types/entities/user";
import { FileUrl } from "@/types/entities/fileUrl";
import { ScheduleEventAttendee } from "@/types/entities/scheduleEventAttendee";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";
import EventInformationSection from "./event/EventInformationSection";
import EventFilesSection from "./event/EventFilesSection";
import EventAttendeesSection from "./event/EventAttendeesSection";
import EventRemindersSection from "./event/EventRemindersSection";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: CalendarEvent;
  onUpdateEvent: (eventData: {
    name: string;
    startDate: string;
    endDate: string;
    eventLabel: string;
    description: string;
    location: string;
    files: FileUrl[];
    attendees: ScheduleEventAttendee[];
    reminders: ScheduleEventReminder[];
  }) => void;
  teamMembers: User[];
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  onUpdateEvent,
  teamMembers,
}) => {
  const { user } = useAuth();

  // Event basic information
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");

  // Event additional data
  const [files, setFiles] = useState<FileUrl[]>([]);
  const [attendees, setAttendees] = useState<ScheduleEventAttendee[]>([]);
  const [reminders, setReminders] = useState<ScheduleEventReminder[]>([]);

  // Current tab
  const [activeTab, setActiveTab] = useState("information");

  useEffect(() => {
    // Populate modal fields when selectedEvent changes
    if (selectedEvent) {
      // Basic event info
      setEventName(selectedEvent.name || "");
      setEventStartDate(
        selectedEvent.start
          ? (selectedEvent.start as Date).toISOString().split("T")[0]
          : ""
      );
      setEventEndDate(
        selectedEvent.end
          ? (selectedEvent.end as Date).toISOString().split("T")[0]
          : ""
      );
      setEventLevel(selectedEvent.extendedProps?.calendar || "");

      // Additional event info from extendedProps
      setEventDescription(selectedEvent.extendedProps?.description || "");
      setEventLocation(selectedEvent.extendedProps?.location || "");

      // For demo purposes, we'll initialize these arrays
      // In a real app, you would fetch this data from your backend
      setFiles(selectedEvent.extendedProps?.files || []);
      setAttendees(selectedEvent.extendedProps?.attendees || []);
      setReminders(selectedEvent.extendedProps?.reminders || []);
    }
  }, [selectedEvent, isOpen]);

  const handleSubmit = () => {
    onUpdateEvent({
      name: eventName,
      startDate: eventStartDate,
      endDate: eventEndDate || eventStartDate,
      eventLabel: eventLevel,
      description: eventDescription,
      location: eventLocation,
      files,
      attendees,
      reminders,
    });
    onClose();
  };

  // Tab navigation
  const tabs = [
    { id: "information", label: "Information" },
    { id: "attendees", label: "Attendees" },
    { id: "files", label: "Files" },
    { id: "reminders", label: "Reminders" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Edit Event
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Modify the details of your existing event
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === tab.id
                  ? "text-brand-500 border-b-2 border-brand-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "information" && (
            <EventInformationSection
              eventName={eventName}
              setEventName={setEventName}
              eventDescription={eventDescription}
              setEventDescription={setEventDescription}
              eventLocation={eventLocation}
              setEventLocation={setEventLocation}
              eventLevel={eventLevel}
              setEventLevel={setEventLevel}
              eventStartDate={eventStartDate}
              setEventStartDate={setEventStartDate}
              eventEndDate={eventEndDate}
              setEventEndDate={setEventEndDate}
            />
          )}

          {activeTab === "attendees" && (
            <EventAttendeesSection
              attendees={attendees}
              setAttendees={setAttendees}
              teamMembers={teamMembers}
              scheduleEventId={selectedEvent?.id}
            />
          )}

          {activeTab === "files" && (
            <EventFilesSection
              files={files}
              setFiles={setFiles}
              scheduleEventId={selectedEvent?.id}
            />
          )}

          {activeTab === "reminders" && (
            <EventRemindersSection
              reminders={reminders}
              setReminders={setReminders}
              scheduleEventId={selectedEvent?.id}
            />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
          <button
            onClick={onClose}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            Update Event
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditEventModal;
