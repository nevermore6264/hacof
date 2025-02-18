// src/app/hackathon/page.tsx
import { Metadata } from "next";
import HackathonList from "./_components/HackathonList";
import Filters from "./_components/Filters";
import SearchSortBar from "./_components/SearchSortBar";
import Pagination from "./_components/Pagination";

export const metadata: Metadata = {
  title: "Hackathon Page",
  description:
    "This is the hackathon page where users can participate in hackathons.",
};

export default function HackathonPage() {
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
          <HackathonList />
          <Pagination />
        </div>
      </div>
    </div>
  );
}
