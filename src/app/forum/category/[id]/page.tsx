// src/app/forum/category/[id]/page.tsx
import Link from "next/link";
import { mockForumSubcategories } from "@/mocks/forumSubcategory.mock";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categorySubcategories = mockForumSubcategories.filter(
    (sub) => sub.categoryId === params.id
  );

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
