"use client";
import { useState } from "react";
import HackathonCard from "@/components/HackathonCard";

const dummyHackathons = [
  {
    id: 1,
    name: "HACKCOVY - Online hackathon 2024",
    date: "24/4/2024 - 26/4/2024",
    image:
      "https://edison365.com/?seraph_accel_gi=wp-content%2Fuploads%2F2022%2F03%2FHow-do-hackathons-work-1024x576.png&n=4KfUhxpi4uNZ9Lci8eTREQ",
  },
  {
    id: 2,
    name: "HACKCOVY - Online hackathon 2023",
    date: "24/4/2023 - 26/4/2023",
    image:
      "https://edison365.com/?seraph_accel_gi=wp-content%2Fuploads%2F2022%2F03%2FHow-do-hackathons-work-1024x576.png&n=4KfUhxpi4uNZ9Lci8eTREQ",
  },
  {
    id: 3,
    name: "IAI HACKATHON - Online hackathon",
    date: "24/4/2020 - 26/4/2020",
    image:
      "https://edison365.com/?seraph_accel_gi=wp-content%2Fuploads%2F2022%2F03%2FHow-do-hackathons-work-1024x576.png&n=4KfUhxpi4uNZ9Lci8eTREQ",
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
