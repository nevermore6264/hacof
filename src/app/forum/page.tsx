// src/app/forum/page.tsx
import Link from "next/link";
import { mockForumCategories } from "@/mocks/forumCategory.mock";

export default function ForumPage() {
  // Group categories by section
  const sections = mockForumCategories.reduce(
    (acc, category) => {
      if (!acc[category.section]) {
        acc[category.section] = [];
      }
      acc[category.section].push(category);
      return acc;
    },
    {} as Record<string, typeof mockForumCategories>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Forum
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join discussions, share ideas, and connect with other community
            members
          </p>
        </div>

        {/* Forum Sections */}
        <div className="space-y-8">
          {Object.entries(sections).map(([section, categories]) => (
            <div
              key={section}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 bg-indigo-600">
                <h2 className="text-xl font-semibold text-white">{section}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-6 hover:bg-gray-50 transition duration-150"
                  >
                    <Link
                      href={`/forum/category/${category.id}`}
                      className="group"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {/* Icon based on category name */}
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-lg flex items-center justify-center">
                            <span className="text-xl">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-indigo-600 group-hover:text-indigo-800 transition duration-150">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Forum Guidelines</h3>
            <p className="text-gray-600 text-sm">
              Make sure to read our community guidelines before posting.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600 text-sm">
              Check out the latest discussions and updates.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm">
              Contact our support team if you need assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
