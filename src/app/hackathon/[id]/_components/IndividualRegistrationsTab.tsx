import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

type IndividualRegistrationsTabProps = {
  individualRegistrations: IndividualRegistrationRequest[];
  hackathonId: string;
};

export default function IndividualRegistrationsTab({
  individualRegistrations,
  hackathonId,
}: IndividualRegistrationsTabProps) {
  // Create individual registration
  const createIndividualRegistration = async () => {
    // Check if user already has an individual registration that's not rejected
    const activeRegistration = individualRegistrations.find(
      (reg) =>
        reg.status === "PENDING" ||
        reg.status === "UNDER_REVIEW" ||
        reg.status === "APPROVED"
    );

    if (activeRegistration) {
      alert(
        `You already have an individual registration for this hackathon with status: ${activeRegistration.status}.`
      );
      return;
    }

    try {
      console.log(
        `Creating individual registration for hackathon: ${hackathonId}`
      );

      const requestBody = {
        hackathonId,
        status: "PENDING",
      };

      console.log("Request body:", requestBody);

      // Simulate successful creation
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert("Individual registration created successfully!");
      // In a real implementation, you would refresh the data here
    } catch (error) {
      console.error("Error creating individual registration:", error);
      alert("Failed to create individual registration");
    }
  };

  const deleteIndividualRegistration = async (
    registrationId: string,
    status: string
  ) => {
    // Only allow deletion of PENDING registrations
    if (status !== "PENDING") {
      alert(
        `You can only delete registrations with PENDING status. Current status: ${status}`
      );
      return;
    }

    try {
      console.log(`Deleting individual registration: ${registrationId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Individual registration ${registrationId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting individual registration:", error);
      alert("Failed to delete individual registration");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Your Individual Registrations</h4>
        {/* Always show the register button */}
        <button
          onClick={createIndividualRegistration}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          <Plus size={16} /> Register as Individual
        </button>
      </div>

      {individualRegistrations.length === 0 ? (
        <p className="text-gray-500 italic mb-4">
          No individual enrollments found. Click the button above to register as
          an individual.
        </p>
      ) : (
        <ul className="space-y-3">
          {individualRegistrations.map((reg) => (
            <li
              key={reg.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold">
                    Registration for {reg.hackathon.title}
                  </h5>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reg.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : reg.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : reg.status === "UNDER_REVIEW"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Submitted:</span>{" "}
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </p>
                  {reg.reviewedBy && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reviewed by:</span>{" "}
                      {reg.reviewedBy.firstName} {reg.reviewedBy.lastName}
                    </p>
                  )}
                </div>
                {/* Only show delete button for PENDING status */}
                {reg.status === "PENDING" && (
                  <button
                    onClick={() =>
                      deleteIndividualRegistration(reg.id, reg.status)
                    }
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete registration"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
