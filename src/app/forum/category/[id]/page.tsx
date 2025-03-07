// src/app/forum/category/[id]/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forum Category",
  description: "Explore topics within this category.",
};

// Dummy Data
const subcategories = {
  "1": [
    {
      id: "101",
      name: "Official Announcements",
      description: "Updates from organizers.",
    },
    {
      id: "102",
      name: "Judges' Feedback",
      description: "Feedback on past hackathons.",
    },
  ],
  "2": [
    {
      id: "201",
      name: "Looking for Team",
      description: "Find teammates for hackathons.",
    },
    {
      id: "202",
      name: "Looking for Members",
      description: "Teams looking for members.",
    },
  ],
};

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id;
  const categorySubcategories = subcategories[categoryId] || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Category
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {categorySubcategories.map((sub) => (
          <div key={sub.id} className="bg-white p-4 shadow rounded-lg">
            <Link href={`/forum/subcategory/${sub.id}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {sub.name}
              </h2>
            </Link>
            <p className="text-gray-600">{sub.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
