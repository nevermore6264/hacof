// src/app/hackathon/_components/Pagination.tsx
"use client";
import { useState } from "react";

export default function Pagination() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex justify-center mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 border rounded-l"
      >
        {"<"}
      </button>
      <span className="px-4 py-2 border">{page}</span>
      <button
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 border rounded-r"
      >
        {">"}
      </button>
    </div>
  );
}
