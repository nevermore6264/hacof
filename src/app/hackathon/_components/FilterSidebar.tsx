// src/app/hackathon/_components/FilterSidebar.tsx
export default function FilterSidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-semibold">Filter</h2>
      <div>
        <h3 className="font-medium mt-4">Category</h3>
        <ul>
          <li>
            <input type="checkbox" /> Coding Hackathons
          </li>
          <li>
            <input type="checkbox" /> External Hackathons
          </li>
        </ul>
      </div>
    </div>
  );
}
