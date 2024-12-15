"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CoachTableSection from "./components/CoachTableSection";

const CoachesPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<any>([]);

  const fetchCoaches = async (query: string | null = null) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/coaches", {
        params: { q: query },
      });
      setCoaches(response.data.data);
    } catch (err: any) {
      console.error("Error fetching coaches data:", err.response);
      setError(err.response?.data?.message || "Failed to fetch coaches data");
    } finally {
      setLoading(false);
    }
  };

  // Callback to handle search functionality
  const handleSearch = (query: string | null) => {
    fetchCoaches(query);
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 bg-gray-200 scroll-m-1 p-4 rounded-b-none rounded-tl-2xl overflow-y-auto">
      {/* Header */}
      <div className="px-8">
        <h1 className="font-semibold text-xl">List of Coaches</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 bg-white shadow-sm px-8 py-8 rounded-2xl">
        <CoachTableSection coachData={coaches} onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default CoachesPage;
