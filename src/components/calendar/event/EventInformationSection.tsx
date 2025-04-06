// src/components/calendar/event/EventInformationSection.tsx
import React from "react";

interface EventInformationSectionProps {
  eventName: string;
  setEventName: (value: string) => void;
  eventDescription: string;
  setEventDescription: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  eventLevel: string;
  setEventLevel: (value: string) => void;
  eventStartDate: string;
  setEventStartDate: (value: string) => void;
  eventEndDate: string;
  setEventEndDate: (value: string) => void;
}

const calendarsEvents = {
  Danger: "danger",
  Success: "success",
  Primary: "primary",
  Warning: "warning",
};

const EventInformationSection: React.FC<EventInformationSectionProps> = ({
  eventName,
  setEventName,
  eventDescription,
  setEventDescription,
  eventLocation,
  setEventLocation,
  eventLevel,
  setEventLevel,
  eventStartDate,
  setEventStartDate,
  eventEndDate,
  setEventEndDate,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Event Name
        </label>
        <input
          id="event-name"
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Description
        </label>
        <textarea
          id="event-description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          rows={3}
          className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Location
        </label>
        <input
          id="event-location"
          type="text"
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
          className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        />
      </div>

      <div>
        <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
          Event Color
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          {Object.entries(calendarsEvents).map(([key, value]) => (
            <div key={key} className="n-chk">
              <div
                className={`form-check form-check-${value} form-check-inline`}
              >
                <label
                  className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                  htmlFor={`modal-${key}`}
                >
                  <span className="relative">
                    <input
                      className="sr-only form-check-input"
                      type="radio"
                      name="event-level"
                      value={key}
                      id={`modal-${key}`}
                      checked={eventLevel === key}
                      onChange={() => setEventLevel(key)}
                    />
                    <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                      <span
                        className={`h-2 w-2 rounded-full bg-white ${
                          eventLevel === key ? "block" : "hidden"
                        }`}
                      ></span>
                    </span>
                  </span>
                  {key}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          Start Date
        </label>
        <div className="relative">
          <input
            id="event-start-date"
            type="date"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
            className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
          End Date
        </label>
        <div className="relative">
          <input
            id="event-end-date"
            type="date"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
      </div>
    </div>
  );
};

export default EventInformationSection;
