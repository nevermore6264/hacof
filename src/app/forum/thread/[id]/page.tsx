// src/app/forum/thread/[id]/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum Thread",
  description: "Read and participate in discussions.",
};

// Dummy Data
const posts = {
  "1001": [
    {
      id: "p1",
      author: "admin",
      content: "The next hackathon is in June 2025!",
      createdAt: "Today",
    },
    {
      id: "p2",
      author: "user123",
      content: "Looking forward to it!",
      createdAt: "1 hour ago",
    },
  ],
};

export default function ThreadPage({ params }: { params: { id: string } }) {
  const threadId = params.id;
  const threadPosts = posts[threadId] || [];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Thread Discussion
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {threadPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 shadow rounded-lg">
            <p className="text-gray-900 font-semibold">{post.author}</p>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-gray-500 text-sm">{post.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
