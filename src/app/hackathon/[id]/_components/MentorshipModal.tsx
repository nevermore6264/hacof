const MentorshipModal = ({
  mentorshipData,
  onClose,
}: {
  mentorshipData:
    | { type: "MentorTeam"; data: MentorTeam[] }
    | { type: "MentorshipRequest"; data: MentorshipRequest[] }
    | { type: "none"; data: [] };
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Mentorship Requests</h2>

        {mentorshipData.type === "MentorTeam" && (
          <ul>
            {mentorshipData.data.map((mentorTeam) => (
              <li key={mentorTeam.id} className="border-b py-2">
                Mentor: {mentorTeam.mentor?.firstName}{" "}
                {mentorTeam.mentor?.lastName}
              </li>
            ))}
          </ul>
        )}

        {mentorshipData.type === "MentorshipRequest" && (
          <ul>
            {mentorshipData.data.map((request) => (
              <li key={request.id} className="border-b py-2">
                Status: {request.status}
              </li>
            ))}
          </ul>
        )}

        {mentorshipData.type === "none" && <p>No mentorship data available.</p>}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};
