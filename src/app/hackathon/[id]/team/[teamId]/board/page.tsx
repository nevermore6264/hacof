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
import { fetchMockBoardLabelsByBoardId } from "./_mock/fetchMockBoardLabels";
import { fetchMockBoardListsByBoardId } from "./_mock/fetchMockBoardLists";
import { fetchMockBoardUsers } from "./_mock/fetchMockBoardUsers";
import { fetchMockTasksByBoardListId } from "./_mock/fetchMockTasks";
import { fetchMockTaskFilesByTaskId } from "./_mock/fetchMockTaskFilesByTaskId";
import { fetchMockTaskLabelsByTaskId } from "./_mock/fetchMockTaskLabels";
import { fetchMockTaskCommentsByTaskId } from "./_mock/fetchMockTaskComments";
import { fetchMockTaskAssigneesByTaskId } from "./_mock/fetchMockTaskAssignees";
import { BoardLabel } from "@/types/entities/boardLabel";

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

  useEffect(() => {
    if (!hackathonId || !teamIdValue) return;

    setLoading(true);

    // Fetch rounds data
    fetchMockRounds(hackathonId)
      .then((data) => setRounds(data))
      .finally(() => setLoading(false));

    // Fetch team data
    fetchMockTeams(teamIdValue).then((teams) => {
      if (teams.length > 0) {
        setTeam(teams[0]);
      }
    });

    // Fetch board data using separate mock files
    fetchMockBoard(teamIdValue, hackathonId).then(async (boardsData) => {
      if (boardsData.length > 0) {
        const enhancedBoards = await Promise.all(
          boardsData.map(async (board) => {
            // Fetch board users
            const boardUsers = await fetchMockBoardUsers(board.id);

            // Fetch board labels
            const boardLabels = await fetchMockBoardLabelsByBoardId(board.id);

            // Create a map of board labels for quick lookup
            const boardLabelsMap = boardLabels.reduce(
              (map, label) => {
                map[label.id] = label;
                return map;
              },
              {} as Record<string, BoardLabel>
            );

            // Fetch board lists
            const boardLists = await fetchMockBoardListsByBoardId(board.id);

            // Fetch tasks for each board list with detailed information
            const enhancedBoardLists = await Promise.all(
              boardLists.map(async (list) => {
                const baseTasks = await fetchMockTasksByBoardListId(list.id);

                // Fetch detailed information for each task
                const enhancedTasks = await Promise.all(
                  baseTasks.map(async (task) => {
                    // Fetch files, labels, comments, and assignees for each task
                    const [fileUrls, taskLabels, comments, assignees] =
                      await Promise.all([
                        fetchMockTaskFilesByTaskId(task.id),
                        fetchMockTaskLabelsByTaskId(task.id),
                        fetchMockTaskCommentsByTaskId(task.id),
                        fetchMockTaskAssigneesByTaskId(task.id),
                      ]);

                    // Enhance taskLabels with their associated boardLabel information
                    const enhancedTaskLabels = taskLabels.map((taskLabel) => ({
                      ...taskLabel,
                      boardLabel: taskLabel.boardLabelId
                        ? boardLabelsMap[taskLabel.boardLabelId]
                        : undefined,
                    }));

                    // Combine task with its detailed information
                    return {
                      ...task,
                      fileUrls,
                      taskLabels: enhancedTaskLabels,
                      comments,
                      assignees,
                    };
                  })
                );

                return {
                  ...list,
                  tasks: enhancedTasks,
                };
              })
            );

            // Combine all data into a complete board
            return {
              ...board,
              boardUsers,
              boardLabels,
              boardLists: enhancedBoardLists,
            };
          })
        );

        setBoards(enhancedBoards);
      }
    });
  }, [hackathonId, teamIdValue]);

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
          />
        )}
        {activeTab === "Submission and Result" && (
          <SubmissionAndResultTab
            rounds={rounds}
            loading={loading}
            hackathonId={hackathonId}
            teamId={teamIdValue}
          />
        )}
        {activeTab === "Schedule" && <Calendar />}
        {activeTab === "Analytics" && <p>Placeholder for analytics.</p>}
      </div>
    </div>
  );
}
