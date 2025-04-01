// src/app/hackathon/[id]/team/[teamId]/board/_components/BoardUserManagement.tsx
"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Board } from "@/types/entities/board";
import { BoardUser, BoardUserRole } from "@/types/entities/boardUser";
import { Team } from "@/types/entities/team";
import { useAuth } from "@/hooks/useAuth_v0";

interface BoardUserManagementProps {
  board: Board;
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BoardUserManagement({
  board,
  team,
  isOpen,
  onClose,
}: BoardUserManagementProps) {
  const { user } = useAuth();
  const [boardUsers, setBoardUsers] = useState<BoardUser[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<BoardUserRole>("MEMBER");

  useEffect(() => {
    // Initialize with board users that aren't deleted
    setBoardUsers(board.boardUsers?.filter((bu) => !bu.isDeleted) || []);
  }, [board]);

  // Filter team members who are not already board users
  const availableTeamMembers =
    team?.teamMembers?.filter(
      (tm) => !boardUsers.some((bu) => bu.user?.id === tm.user.id)
    ) || [];

  const handleAddUser = async () => {
    if (!selectedTeamMember) return;

    try {
      // Simulated API call to add user to board
      console.log("Adding user to board:", {
        boardId: board.id,
        userId: selectedTeamMember,
        role: selectedRole,
        isDeleted: false,
      });

      // Simulate successful API response - create a mock board user
      const teamMember = team?.teamMembers?.find(
        (tm) => tm.user.id === selectedTeamMember
      );
      if (teamMember) {
        const newBoardUser: BoardUser = {
          id: `bu-${Date.now()}`, // Generate a mock ID
          boardId: board.id,
          userId: selectedTeamMember,
          user: teamMember.user,
          role: selectedRole,
          isDeleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setBoardUsers([...boardUsers, newBoardUser]);
        setSelectedTeamMember("");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateRole = async (
    boardUser: BoardUser,
    newRole: BoardUserRole
  ) => {
    try {
      // Simulated API call to update user role
      console.log("Updating user role:", {
        ...boardUser,
        role: newRole,
      });

      // Update local state
      setBoardUsers(
        boardUsers.map((bu) =>
          bu.id === boardUser.id ? { ...bu, role: newRole } : bu
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleRemoveUser = async (boardUser: BoardUser) => {
    // Don't allow removing the owner/yourself
    if (
      boardUser.user?.id === board.owner?.id ||
      boardUser.user?.id === user?.id
    ) {
      return;
    }

    try {
      // Simulated API call to remove user
      console.log("Removing user from board:", {
        ...boardUser,
        isDeleted: true,
        deletedById: user?.id,
      });

      // Update local state
      setBoardUsers(boardUsers.filter((bu) => bu.id !== boardUser.id));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <Dialog.Title className="text-lg font-semibold">
              Manage Board Users
            </Dialog.Title>

            <div className="mt-4 space-y-6">
              {/* Current board users */}
              <div>
                <h3 className="font-medium mb-2">Current Users</h3>
                <div className="space-y-2">
                  {boardUsers.map((boardUser) => (
                    <div
                      key={boardUser.id}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            boardUser.user?.avatarUrl ||
                            "https://via.placeholder.com/40"
                          }
                          alt={`${boardUser.user?.firstName} ${boardUser.user?.lastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                        <span>
                          {boardUser.user?.firstName} {boardUser.user?.lastName}
                          {boardUser.user?.id === board.owner?.id && " (Owner)"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {boardUser.user?.id !== board.owner?.id && (
                          <select
                            value={boardUser.role}
                            onChange={(e) =>
                              handleUpdateRole(
                                boardUser,
                                e.target.value as BoardUserRole
                              )
                            }
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="MEMBER">Member</option>
                          </select>
                        )}

                        {boardUser.user?.id !== board.owner?.id &&
                          boardUser.user?.id !== user?.id && (
                            <button
                              onClick={() => handleRemoveUser(boardUser)}
                              className="px-2 py-1 text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add new user */}
              {availableTeamMembers.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Add Team Member</h3>
                  <div className="flex space-x-2">
                    <select
                      value={selectedTeamMember}
                      onChange={(e) => setSelectedTeamMember(e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
                    >
                      <option value="">Select team member</option>
                      {availableTeamMembers.map((member) => (
                        <option key={member.user.id} value={member.user.id}>
                          {member.user.firstName} {member.user.lastName}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedRole}
                      onChange={(e) =>
                        setSelectedRole(e.target.value as BoardUserRole)
                      }
                      className="border rounded px-3 py-2"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                    </select>

                    <button
                      onClick={handleAddUser}
                      disabled={!selectedTeamMember}
                      className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
