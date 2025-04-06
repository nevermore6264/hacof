// src/app/forum/thread/[id]/_components/ReportButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThreadPostReport } from "@/types/entities/threadPostReport";

interface ReportButtonProps {
  postId: string;
  reports: ThreadPostReport[];
  isLoading: boolean;
  currentUsername?: string;
  onReportAdded: () => void;
}

export default function ReportButton({
  postId,
  reports,
  isLoading,
  currentUsername,
  onReportAdded,
}: ReportButtonProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reason, setReason] = useState("");

  // Check if current user has reported the post
  const userReport = reports.find(
    (report) =>
      report.createdByUserName === currentUsername &&
      report.status === "PENDING"
  );

  const handleShowReportForm = () => {
    if (!currentUsername) {
      alert("You need to be logged in to report posts");
      return;
    }

    if (userReport) {
      alert("You've already reported this post");
      return;
    }

    setShowReportForm(true);
  };

  const handleCancelReport = () => {
    setShowReportForm(false);
    setReason("");
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) return;

    setIsReporting(true);

    try {
      // Create new report
      const newReport = {
        threadPostId: postId,
        reason: reason.trim(),
        status: "PENDING" as const,
        createdByUserName: currentUsername,
      };

      // Mock create request
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Creating report:", newReport);

      setReason("");
      setShowReportForm(false);
      onReportAdded();
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setIsReporting(false);
    }
  };

  // Handle report deletion (only for PENDING reports by current user)
  const handleDeleteReport = async () => {
    if (!userReport) return;

    setIsReporting(true);

    try {
      // Mock delete request
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Deleting report:", userReport.id);
      onReportAdded();
    } catch (error) {
      console.error("Failed to delete report:", error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div>
      {showReportForm ? (
        <form
          onSubmit={handleSubmitReport}
          className="mt-2 p-3 bg-gray-50 rounded-lg"
        >
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded text-sm"
            placeholder="Reason for reporting..."
            rows={2}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancelReport}
              disabled={isReporting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={!reason.trim() || isReporting}
            >
              {isReporting ? (
                <span className="flex items-center">
                  <div className="h-3 w-3 mr-1 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Submitting
                </span>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
      ) : userReport ? (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-red-500"
          onClick={handleDeleteReport}
          disabled={isLoading || isReporting}
        >
          {isLoading || isReporting ? (
            <span className="flex items-center">
              <div className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              Processing
            </span>
          ) : (
            <>
              <span className="mr-1">🚩</span>
              <span>Reported - Cancel</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center text-gray-500 hover:text-red-500"
          onClick={handleShowReportForm}
          disabled={isLoading}
        >
          <span className="mr-1">🚩</span>
          <span>
            {reports.length > 0 ? `${reports.length} Reports` : "Report"}
          </span>
        </Button>
      )}
    </div>
  );
}
