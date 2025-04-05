// src/app/hackathon/[id]/team/[teamId]/board/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import KanbanBoard from "./_components/KanbanBoard";
import Calendar from "@/components/calendar/Calendar";
import SubmissionAndResultTab from "./_components/SubmissionAndResultTab";
import { Round } from "@/types/entities/round";
import { fetchMockRounds } from "./_mock/fetchMockRounds";
import { fetchMockTeams } from "./_mock/fetchMockTeams";
import { Team } from "@/types/entities/team";
import { Board } from "@/types/entities/board";
import { fetchMockBoard } from "./_mock/fetchMockBoard";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

const TABS = ["Task Board", "Submission and Result", "Schedule", "Analytics"];

export default function HackathonBoardPage() {
  const { id, teamId } = useParams();
  const hackathonId = Array.isArray(id) ? id[0] : id;
  const teamIdValue = Array.isArray(teamId) ? teamId[0] : teamId;

  const [rounds, setRounds] = useState<Round[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [loading, setLoading] = useState(true);
  const [boardLoading, setBoardLoading] = useState(true);

  // Use the API modal hook
  const { modalState, hideModal, showError } = useApiModal();

  // Only fetch the basic board data initially
  useEffect(() => {
    if (!hackathonId || !teamIdValue) return;

    // Start with essential data only
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        // Fetch team data
        const teamsData = await fetchMockTeams(teamIdValue);
        if (teamsData.length > 0) {
          setTeam(teamsData[0]);
        }

        // Fetch basic board data (without detailed lists and tasks)
        const boardsData = await fetchMockBoard(teamIdValue, hackathonId);
        setBoards(boardsData);
        setBoardLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showError("Error", "Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [hackathonId, teamIdValue, showError]);

  // Fetch rounds data only when the "Submission and Result" tab is active
  useEffect(() => {
    if (
      activeTab === "Submission and Result" &&
      rounds.length === 0 &&
      hackathonId
    ) {
      const fetchRounds = async () => {
        try {
          const data = await fetchMockRounds(hackathonId);
          setRounds(data);
        } catch (error) {
          console.error("Error fetching rounds:", error);
          showError("Error", "Failed to load rounds data");
        }
      };

      fetchRounds();
    }
  }, [activeTab, rounds.length, hackathonId, showError]);

  return (
    <div className="p-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 border rounded-lg bg-white shadow">
        {activeTab === "Task Board" && (
          <KanbanBoard
            board={boards.length > 0 ? boards[0] : null}
            team={team}
            isLoading={boardLoading}
          />
        )}
        {activeTab === "Submission and Result" && (
          <SubmissionAndResultTab
            rounds={rounds}
            loading={loading || rounds.length === 0}
            hackathonId={hackathonId}
            teamId={teamIdValue}
          />
        )}
        {activeTab === "Schedule" && <Calendar />}
        {activeTab === "Analytics" && <p>Placeholder for analytics.</p>}
      </div>

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
