// src/app/forum/page.tsx
import Link from "next/link";
import { mockForumCategories } from "@/mocks/forumCategory.mock";

export default function ForumPage() {
  // Group categories by section
  const sections = mockForumCategories.reduce((acc, category) => {
    if (!acc[category.section]) {
      acc[category.section] = [];
    }
    acc[category.section].push(category);
    return acc;
  }, {} as Record<string, typeof mockForumCategories>);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-6">
        Forum
      </h1>
      <div className="max-w-4xl mx-auto space-y-8">
        {Object.entries(sections).map(([section, categories]) => (
          <div key={section}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {section}
            </h2>
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white p-4 shadow rounded-lg"
                >
                  <Link href={`/forum/category/${category.id}`}>
                    <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                      {category.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
