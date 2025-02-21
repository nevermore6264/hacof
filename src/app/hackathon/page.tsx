// src/app/hackathon/page.tsx
import { Metadata } from "next";
import HackathonList from "./_components/HackathonList";
import Filters from "./_components/Filters";
import SearchSortBar from "./_components/SearchSortBar";
import Pagination from "./_components/Pagination";
import { Hackathon } from "@/types/entities/hackathon";

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

export default async function HackathonPage() {
  const hackathons: Hackathon[] = await getHackathons();
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
          <HackathonList hackathons={hackathons} />
          <Pagination />
        </div>
      </div>
    </div>
  );
}
