import React from "react";
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

type IndividualEnrollmentModalProps = {
  registrations: IndividualRegistrationRequest[];
  onClose: () => void;
};

export default function IndividualEnrollmentModal({
  registrations,
  onClose,
}: IndividualEnrollmentModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Individual Enrollment</h2>
        {registrations.length > 0 ? (
          <ul className="space-y-2">
            {registrations.map((registration) => (
              <li key={registration.id} className="p-2 border rounded">
                <p className="font-medium">Status: {registration.status}</p>
                {registration.reviewedBy && (
                  <p className="text-sm text-gray-600">
                    Reviewed by: {registration.reviewedBy.firstName}{" "}
                    {registration.reviewedBy.lastName}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No individual enrollment found.</p>
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
