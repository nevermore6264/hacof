// src/app/hackathon/[id]/_components/HackathonOverview.tsx

type HackathonOverviewProps = {
  title: string;
  subtitle: string;
  date: string;
  enrollmentCount: number;
};

export default function HackathonOverview({
  title,
  subtitle,
  date,
  enrollmentCount,
}: HackathonOverviewProps) {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-1">📅 {date}</p>
      <p className="mt-4 text-gray-700">{subtitle}</p>
      <div className="mt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition">
          Enroll
        </button>
        <p className="mt-2 text-gray-500 text-sm">
          {enrollmentCount === 1
            ? "1 person has registered to participate"
            : `${enrollmentCount} people have registered to participate`}
        </p>
      </div>
    </div>
  );
}
