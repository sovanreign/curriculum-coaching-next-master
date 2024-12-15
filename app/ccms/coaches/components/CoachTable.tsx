import React, { useState } from "react";

/** Coach Data Interface */
interface CoachData {
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
  role: string;
  uniqueId: string;
  updatedAt: string;
  username: string;
  yearLevel: string | null;
}

interface CoachTableProps {
  rows: CoachData[];
  selectedIds: number[];
  pageSize: number;
  onSelectionChange: (selectedIds: number[]) => void;
  onEdit: (id: number) => void; // calls handleViewCoach
}

const CoachTable: React.FC<CoachTableProps> = ({
  rows,
  selectedIds,
  onSelectionChange,
  onEdit,
  pageSize,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sort rows
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

  return (
    <div className="border rounded-lg text-center overflow-x-auto">
      <table className="table-fixed w-full">
        <thead className="bg-gray-200 text-center">
          <tr>
            {/* Narrow Checkbox Column */}
            <th className="py-3 w-[50px] text-center">
              <input
                type="checkbox"
                className="cursor-pointer accent-primary-500"
                checked={allSelected}
                onChange={handleSelectAll}
              />
            </th>

            {/* ID Column */}
            <th
              className="px-2 py-3 w-[80px] text-left cursor-pointer select-none"
              onClick={toggleSortOrder}
            >
              ID {sortOrder === "asc" ? "↑" : "↓"}
            </th>

            {/* Coach No. (uniqueId) */}
            <th className="px-2 py-3 w-[120px] text-left">Coach No.</th>

            {/* Coach Name */}
            <th className="px-2 py-3 w-3/12 text-left">Coach Name</th>

            {/* Email */}
            <th className="px-2 py-3 w-3/12 text-left">Email</th>

            {/* Actions */}
            <th className="px-2 py-3 w-[120px] text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedRows.map((row, index) => (
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
              <td className="px-2 py-3 w-[120px] text-left">{row.uniqueId}</td>
              <td className="px-2 py-3 w-3/12 text-left">
                {row.firstName} {row.lastName}
              </td>
              <td className="px-2 py-3 w-3/12 text-left">{row.email}</td>
              <td className="px-2 py-3 w-[120px] text-center">
                <button
                  onClick={() => onEdit(row.id)}
                  className="bg-transparent hover:bg-gray-100 px-2 py-1 border border-black rounded text-black"
                >
                  View / Edit
                </button>
              </td>
            </tr>
          ))}

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
  );
};

export default CoachTable;
