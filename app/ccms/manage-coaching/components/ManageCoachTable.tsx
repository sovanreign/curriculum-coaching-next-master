"use client";

import React, { useState } from "react";
import { useCourse } from "../../contexts/CourseContext";

interface StudentData {
  address: string;
  bio: string;
  contactNumber: string | null;
  courseId: number | null;
  createdAt: string;
  departmentId: number | null;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  password: string;
  role: string;
  uniqueId: string;
  updatedAt: string;
  username: string;
  yearLevel: string | null;
}

interface StudentTableProps {
  rows: StudentData[];
  selectedIds: number[];
  pageSize: number;
  onSelectionChange: (selectedIds: number[]) => void;
  onEdit: (id: number) => void; // Remove if not needed
}

const ManageCoachTable: React.FC<StudentTableProps> = ({
  rows,
  selectedIds,
  onSelectionChange,
  onEdit,
  pageSize,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { course } = useCourse();

  // Sort rows by ID
  const sortedRows = [...rows].sort((a, b) =>
    sortOrder === "asc" ? a.id - b.id : b.id - a.id
  );

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(rows.length / pageSize);

  // Checkbox logic
  const handleCheckboxChange = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === rows.length && rows.length > 0) {
      onSelectionChange([]);
    } else {
      onSelectionChange(rows.map((row) => row.id));
    }
  };
  const allSelected = selectedIds.length === rows.length && rows.length > 0;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // YearLevel / Course Code Mappings
  const yearLevelMap = new Map<string, string>([
    ["FIRST", "1st Year"],
    ["SECOND", "2nd Year"],
    ["THIRD", "3rd Year"],
    ["FOURTH", "4th Year"],
    ["FIFTH", "5th Year"],
  ]);

  const courseMap = course.map((c: { id: number; code: string }) => ({
    id: c.id,
    courseCode: c.code,
  }));

  return (
    <>
      {/* 
        "overflow-x-auto md:overflow-x-visible" means:
        - On screens smaller than MD (768px by default), show horizontal scroll if content overflows.
        - On MD and larger screens, revert to visible overflow. 
      */}
      <div className="border rounded-lg text-center overflow-x-auto md:overflow-x-visible">
        <table className="table-fixed w-full">
          <thead className="bg-gray-200 text-center">
            <tr>
              {/* Narrower column for the checkbox */}
              <th className="py-3 w-[30px] text-center">
                <input
                  type="checkbox"
                  className="cursor-pointer accent-primary-500"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              {/* ID column */}
              <th
                className="px-2 py-3 w-[30px] text-left cursor-pointer select-none"
                onClick={toggleSortOrder}
              >
                ID {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="px-2 py-3 w-3/12 text-left">Student Name</th>
              <th className="px-2 py-3 w-3/12 text-left">Email</th>
              <th className="px-2 py-3 w-2/12 text-center">Year Level</th>
              <th className="px-2 py-3 w-[40px] text-center">Course Code</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, index) => {
              const courseItem = courseMap.find(
                (c: { id: number | null }) => c.id === row.courseId
              );

              return (
                <tr
                  key={row.uniqueId}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t`}
                >
                  <td className="px-2 py-3 w-[50px] text-center">
                    <input
                      type="checkbox"
                      className="cursor-pointer accent-primary-500"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleCheckboxChange(row.id)}
                    />
                  </td>
                  <td className="px-2 py-3 w-[80px] text-left">{row.id}</td>
                  <td className="px-2 py-3 w-2/12 text-left">
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="px-2 py-3 w-3/12 text-left">{row.email}</td>
                  <td className="px-2 py-3 w-2/12 text-center">
                    {yearLevelMap.get(row.yearLevel ?? "") || "-"}
                  </td>
                  <td className="px-2 py-3 w-[80px] text-center">
                    {courseItem ? courseItem.courseCode : "-"}
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center p-4 text-white">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            Prev
          </button>
          <div className="text-gray-800">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ManageCoachTable;
