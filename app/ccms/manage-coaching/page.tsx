"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ManageCoachTableSection from "./components/ManageCoachTableSection";

const ManageCoachPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any>([]);

  const fetchStudents = async (query: string | null = null) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/students", {
        params: { q: query },
      });
      setStudents(response.data.data);
    } catch (err: any) {
      console.error("Error fetching students data:", err.response);
      setError(err.response?.data?.message || "Failed to fetch students data");
    } finally {
      setLoading(false);
    }
  };

  // This callback is passed down to StudentTableSection
  const handleSearch = (query: string | null) => {
    fetchStudents(query);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="flex flex-col flex-1 gap-4 bg-gray-200 scroll-m-1 p-4 rounded-b-none rounded-tl-2xl overflow-y-auto">
      {/* Header */}
      <div className="px-8">
        <h1 className="font-semibold text-xl">Manage Coaching</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 bg-white shadow-sm px-8 py-8 rounded-2xl">
        <ManageCoachTableSection
          studentData={students}
          onSearch={handleSearch} // Pass the callback here
        />
      </div>
    </div>
  );
};

export default ManageCoachPage;
