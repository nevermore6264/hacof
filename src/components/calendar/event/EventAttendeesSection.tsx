// src/components/calendar/event/EventAttendeesSection.tsx
import React, { useState } from "react";
import { User } from "@/types/entities/user";
import {
  ScheduleEventAttendee,
  ScheduleEventStatus,
} from "@/types/entities/scheduleEventAttendee";
interface EventAttendeesSectionProps {
  attendees: ScheduleEventAttendee[];
  setAttendees: (attendees: ScheduleEventAttendee[]) => void;
  teamMembers: User[];
  scheduleEventId?: string;
}

const EventAttendeesSection: React.FC<EventAttendeesSectionProps> = ({
  attendees,
  setAttendees,
  teamMembers,
  scheduleEventId,
}) => {
  const [showMemberSelector, setShowMemberSelector] = useState(false);

  const handleAddAttendee = (user: User) => {
    // Check if user is already an attendee
    if (attendees.some((a) => a.userId === user.id)) {
      return;
    }

    const newAttendee: ScheduleEventAttendee = {
      id: `attendee-${Date.now()}`,
      scheduleEventId: scheduleEventId,
      user,
      userId: user.id,
      status: "INVITED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAttendees([...attendees, newAttendee]);
    setShowMemberSelector(false);
  };

  const handleRemoveAttendee = (attendeeId: string) => {
    setAttendees(attendees.filter((a) => a.id !== attendeeId));
  };

  const handleChangeStatus = (
    attendeeId: string,
    status: ScheduleEventStatus
  ) => {
    setAttendees(
      attendees.map((a) =>
        a.id === attendeeId
          ? { ...a, status, updatedAt: new Date().toISOString() }
          : a
      )
    );
  };

  // Filter out team members who are already attendees
  const availableTeamMembers = teamMembers.filter(
    (member) => !attendees.some((a) => a.userId === member.id)
  );

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-sm font-medium text-gray-700 dark:text-gray-400">
          Attendees
        </h6>
        <button
          type="button"
          onClick={() => setShowMemberSelector(!showMemberSelector)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          Add Attendee
        </button>
      </div>

      {showMemberSelector && (
        <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <h6 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-400">
            Select Team Member
          </h6>
          {availableTeamMembers.length === 0 ? (
            <p className="text-sm text-gray-500">
              All team members are already added as attendees.
            </p>
          ) : (
            <div className="max-h-40 overflow-y-auto space-y-2">
              {availableTeamMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleAddAttendee(member)}
                  className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                    {member.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {attendees.length > 0 ? (
        <div className="space-y-2">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg dark:bg-gray-800"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
                  {attendee.user?.firstName?.charAt(0) || "U"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {attendee.user?.firstName} {attendee.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {attendee.user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={attendee.status}
                  onChange={(e) =>
                    handleChangeStatus(
                      attendee.id,
                      e.target.value as ScheduleEventStatus
                    )
                  }
                  className="text-xs rounded-lg border border-gray-300 bg-transparent p-1 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="INVITED">Invited</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DECLINED">Declined</option>
                </select>
                <button
                  onClick={() => handleRemoveAttendee(attendee.id)}
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No attendees added yet.</p>
      )}
    </div>
  );
};

export default EventAttendeesSection;
