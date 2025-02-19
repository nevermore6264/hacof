// src/app/hackathon/[id]/page.tsx
import { Metadata } from "next";

type HackathonProps = {
  params: { id: string }; //Keep this to access the dynamic route param
};

async function getHackathonData(id: string) {
  const res = await fetch(`http://localhost:3000/api/hackathon/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch hackathon data");
  return res.json();
}

//`params` is necessary here for fetching metadata dynamically, SEO purposes
export async function generateMetadata({
  params,
}: HackathonProps): Promise<Metadata> {
  // Await the params object
  const id = (await params).id;
  const hackathon = await getHackathonData(id);
  return {
    title: hackathon.name,
    description: hackathon.description,
  };
}

export default async function HackathonDetail({ params }: HackathonProps) {
  // Await the params object
  const id = (await params).id;
  const hackathon = await getHackathonData(id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{hackathon.name}</h1>
      <p className="text-gray-600">{hackathon.date}</p>
      <p>{hackathon.description}</p>
    </div>
  );
}
