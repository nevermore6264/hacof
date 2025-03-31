// src/app/hackathon/[id]/_components/TeamsTab.tsx
import { Team } from "@/types/entities/team";

type TeamsTabProps = {
  teams: Team[];
};

export default function TeamsTab({ teams }: TeamsTabProps) {
  return (
    <div>
      <h4 className="font-medium mb-2">Your Teams</h4>
      {teams.length === 0 ? (
        <p className="text-gray-500 italic">No teams found.</p>
      ) : (
        <ul className="space-y-3">
          {teams.map((team) => (
            <li
              key={team.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-semibold text-lg">{team.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Team Leader:</span>{" "}
                    {team.teamLeader.firstName} {team.teamLeader.lastName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">
                      Members ({team.teamMembers.length}):
                    </span>{" "}
                    {team.teamMembers
                      .map((m) => `${m.user.firstName} ${m.user.lastName}`)
                      .join(", ")}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {team.teamHackathons[0]?.status || "Active"}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
