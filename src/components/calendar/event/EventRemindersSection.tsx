// src/components/calendar/event/EventRemindersSection.tsx
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { ScheduleEventReminder } from "@/types/entities/scheduleEventReminder";

interface EventRemindersSectionProps {
  reminders: ScheduleEventReminder[];
  setReminders: (reminders: ScheduleEventReminder[]) => void;
  scheduleEventId?: string;
}

const EventRemindersSection: React.FC<EventRemindersSectionProps> = ({
  reminders,
  setReminders,
  scheduleEventId,
}) => {
  const { user } = useAuth();
  const [remindAt, setRemindAt] = useState("");

  const handleAddReminder = () => {
    if (!user || !remindAt) return;

    const newReminder: ScheduleEventReminder = {
      id: `reminder-${Date.now()}`,
      scheduleEventId: scheduleEventId,
      userId: user.id,
      remindAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReminders([...reminders, newReminder]);
    setRemindAt("");
  };

  const handleRemoveReminder = (reminderId: string) => {
    setReminders(reminders.filter((r) => r.id !== reminderId));
  };

  return (
    <div className="mt-6">
      <h6 className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
        My Reminders
      </h6>

      <div className="flex mb-4 space-x-2">
        <input
          type="datetime-local"
          value={remindAt}
          onChange={(e) => setRemindAt(e.target.value)}
          className="flex-1 h-10 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
        <button
          type="button"
          onClick={handleAddReminder}
          disabled={!remindAt}
          className="px-4 py-2 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {reminders.length > 0 ? (
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
            >
              <div className="flex items-center">
                <div className="text-brand-500 mr-3">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Reminder at {new Date(reminder.remindAt).toLocaleString()}
                  </p>
                  {reminder.user && (
                    <p className="text-xs text-gray-500">
                      For {reminder.user.firstName} {reminder.user.lastName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveReminder(reminder.id)}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No reminders set.</p>
      )}
    </div>
  );
};

export default EventRemindersSection;
