// src/app/hackathon/page.tsx
"use client";
import { Metadata } from "next";
import HackathonList from "./_components/HackathonList";
import Filters from "./_components/Filters";
import SearchSortBar from "./_components/SearchSortBar";
import Pagination from "./_components/Pagination";
import { Hackathon } from "@/types/entities/hackathon";
import { useQuery } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Hackathon Page",
  description:
    "This is the hackathon page where users can participate in hackathons.",
};

async function getHackathons(): Promise<Hackathon[]> {
  const res = await fetch(`http://localhost:3000/api/hackathon`);
  if (!res.ok) {
    throw new Error("Failed to fetch hackathons");
  }
  return res.json();
}

// TODO: {lv3} Should I Enable Refetching
export default function HackathonPage() {
  const {
    data: hackathons,
    error,
    isLoading,
  } = useQuery<Hackathon[]>({
    queryKey: ["hackathons"],
    queryFn: getHackathons,
    staleTime: 60 * 1000, // 1 minute before refetch
    refetchOnWindowFocus: false, // Disable automatic refetching when the window regains focus to avoid unnecessary API calls
  });

  if (isLoading) return <p>Loading hackathons...</p>;
  if (error) return <p>Failed to load hackathons.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        {/* Sidebar Filters */}
        <div className="w-1/4">
          <Filters />
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <SearchSortBar />
          {/* Safely fallback to empty array if hackathons is undefined */}
          <HackathonList hackathons={hackathons ?? []} />
          <Pagination />
        </div>
      </div>
    </div>
  );
}
