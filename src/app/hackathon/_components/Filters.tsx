"use client";
import { useState } from "react";

const categories = [
  "Coding Hackathons",
  "External Hackathons",
  "Internal Hackathons",
  "Design Hackathons",
  "Others",
];

const organizations = [
  "FPTU",
  "NASA",
  "IAI HACKATHON",
  "CE Hackathon",
  "Others",
];

export default function Filters() {
  const [selectedStatus, setSelectedStatus] = useState<string>("open");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>(
    []
  );

  const toggleSelection = (
    value: string,
    state: string[],
    setter: (val: string[]) => void
  ) => {
    setter(
      state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value]
    );
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="font-bold mb-2">Filter</h3>

      {/* Category Filter */}
      <div>
        <h4 className="font-semibold">Category</h4>
        {categories.map((cat) => (
          <label key={cat} className="block">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() =>
                toggleSelection(cat, selectedCategories, setSelectedCategories)
              }
            />
            {cat}
          </label>
        ))}
      </div>

      {/* Status Filter */}
      <div className="mt-4">
        <h4 className="font-semibold">Status</h4>
        <label className="block">
          <input
            type="radio"
            value="open"
            checked={selectedStatus === "open"}
            onChange={() => setSelectedStatus("open")}
          />
          Registration Open
        </label>
        <label className="block">
          <input
            type="radio"
            value="closed"
            checked={selectedStatus === "closed"}
            onChange={() => setSelectedStatus("closed")}
          />
          Closed
        </label>
      </div>

      {/* Organization Filter */}
      <div className="mt-4">
        <h4 className="font-semibold">Organization</h4>
        {organizations.map((org) => (
          <label key={org} className="block">
            <input
              type="checkbox"
              checked={selectedOrganizations.includes(org)}
              onChange={() =>
                toggleSelection(
                  org,
                  selectedOrganizations,
                  setSelectedOrganizations
                )
              }
            />
            {org}
          </label>
        ))}
      </div>
    </div>
  );
}
