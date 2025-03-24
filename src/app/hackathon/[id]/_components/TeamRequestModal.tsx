import React from "react";
import { TeamRequest } from "@/types/entities/teamRequest";

type TeamRequestModalProps = {
  requests: TeamRequest[];
  onClose: () => void;
};

export default function TeamRequestModal({
  requests,
  onClose,
}: TeamRequestModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Team Requests</h2>
        {requests.length > 0 ? (
          <ul className="space-y-2">
            {requests.map((request) => (
              <li key={request.id} className="p-2 border rounded">
                <p className="font-medium">{request.note}</p>
                <p className="text-sm text-gray-600">
                  Status: {request.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No team requests found.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
