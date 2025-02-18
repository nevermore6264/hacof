"use client";
import { useState } from "react";
import HackathonCard from "@/components/HackathonCard";

const dummyHackathons = [
  {
    id: 1,
    name: "HACKCOVY - Online hackathon 2024",
    date: "24/4/2024 - 26/4/2024",
  },
  {
    id: 2,
    name: "HACKCOVY - Online hackathon 2023",
    date: "24/4/2023 - 26/4/2023",
  },
  {
    id: 3,
    name: "IAI HACKATHON - Online hackathon",
    date: "24/4/2020 - 26/4/2020",
  },
];

export default function HackathonList() {
  const [hackathons] = useState(dummyHackathons);

  return (
    <div className="grid grid-cols-3 gap-4">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  );
}
