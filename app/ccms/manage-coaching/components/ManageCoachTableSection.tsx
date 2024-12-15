"use client";

import React, { useEffect, useState } from "react";
import Button from "@/app/components/Button";
import Dropdown from "@/app/components/Dropdown";
import Modal from "../../components/Modal";
import axios from "axios";
import { useCourse } from "../../contexts/CourseContext";
import Alert from "@/app/components/Alert";
import ManageCoachTable from "./ManageCoachTable";
import {
  ArrowsRightLeftIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

// StudentData interface
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

interface StudentProfileProps {
  studentData: StudentData[];
  onSearch?: (query: string | null) => void;
}

const ManageCoachTableSection: React.FC<StudentProfileProps> = ({
  studentData,
  onSearch,
}) => {
  const [rows, setRows] = useState<StudentData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");

  // Alert
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // "Assign Coach" modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Title of the Modal (e.g. "Assign Coach" or "Transfer Students")
  const [modalTitle, setModalTitle] = useState("Assign Coach");

  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);

  // States for the modal
  const [modalRows, setModalRows] = useState<StudentData[]>([]);
  const [modalSelectedIds, setModalSelectedIds] = useState<number[]>([]);

  const { course } = useCourse();

  /**
   * Load initial data into 'rows'
   */
  useEffect(() => {
    if (Array.isArray(studentData)) {
      setRows(studentData);
    }
  }, [studentData]);

  /**
   * Filter rows whenever selectedYear or selectedCourse changes
   */
  useEffect(() => {
    if (!Array.isArray(studentData)) return;

    let filteredData = [...studentData];
    if (selectedYear !== "ALL") {
      filteredData = filteredData.filter(
        (student) => student.yearLevel === selectedYear
      );
    }
    if (selectedCourse !== "ALL") {
      const courseId = parseInt(selectedCourse, 10);
      filteredData = filteredData.filter(
        (student) => student.courseId === courseId
      );
    }
    setRows(filteredData);
  }, [studentData, selectedYear, selectedCourse]);

  // Table selection logic
  const handleSelectionChange = (newSelectedIds: number[]) => {
    setSelectedIds(newSelectedIds);
  };

  // Search logic
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch(null);
  };

  // Modal open logic (two different "modes": Assign or Transfer)
  const handleOpenModal = (mode: "ASSIGN" | "TRANSFER") => {
    if (selectedIds.length === 0) return;

    // Prepare selected students for the modal
    const selectedStudents = rows.filter((row) => selectedIds.includes(row.id));
    setModalRows(selectedStudents);
    setModalSelectedIds([...selectedIds]);

    // Set the modal title based on the mode
    if (mode === "ASSIGN") {
      setModalTitle("Assign Coach");
    } else {
      setModalTitle("Transfer Students");
    }

    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
  };

  // Confirm assignment (or transfer)
  const handleConfirmAssign = async () => {
    // The final selection is whatever is left in modalSelectedIds
    console.log("Students:", modalSelectedIds, "Coach:", selectedCoachId);
    // Real logic: axios.post('/api/assign', { selectedIds: modalSelectedIds, selectedCoachId })
    setAlert({
      message: `${modalSelectedIds.length} student(s) processed. (Mode: ${modalTitle})`,
      type: "success",
    });
    setIsAssignModalOpen(false);

    // Optionally clear the main table selection or keep it. We'll clear here:
    setSelectedIds([]);
  };

  // Example coaches
  const coaches = [
    { id: 1, name: "Coach A" },
    { id: 2, name: "Coach B" },
    { id: 3, name: "Coach C" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        // Dynamically set the modal title
        title={modalTitle}
        closeText="Cancel"
        submitText="Confirm"
        onSubmit={handleConfirmAssign}
      >
        <div className="mb-4 border rounded-lg text-center overflow-x-auto md:overflow-x-visible">
          <ManageCoachTable
            rows={modalRows} // All originally selected rows
            pageSize={5}
            selectedIds={modalSelectedIds} // Local selection in the modal
            onSelectionChange={setModalSelectedIds}
            onEdit={() => {}}
          />
        </div>

        {/* Dropdown for selecting coach (still relevant if transferring, or you can adapt logic) */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500 text-sm">
            Assign/Transfer to Coach
          </label>
          <Dropdown
            data={coaches.map((coach) => ({
              value: coach.id.toString(),
              label: coach.name,
            }))}
            placeholder="Select a Coach"
            onChange={(e) => setSelectedCoachId(Number(e.target.value))}
            className="px-2 py-3 border rounded-md w-full cursor-pointer"
          />
        </div>
      </Modal>

      {/* Search and Filters */}
      <div className="flex justify-between">
        <div className="relative w-full min-w-[200px] max-w-sm">
          <input
            className="border-slate-200 hover:border-slate-300 focus:border-slate-400 bg-transparent shadow-sm focus:shadow py-3 pr-28 pl-3 border rounded-md w-full text-slate-700 placeholder:text-slate-400 transition duration-300 ease focus:outline-none"
            placeholder="Search for students"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              if (e.target.value === "") {
                handleClearSearch();
              }
              setSearchQuery(e.target.value);
            }}
          />
          <Button
            type="button"
            variant="primary"
            isLoading={false}
            buttonLoadingText="Loading"
            className="top-0 right-1 bottom-0 absolute flex items-center my-1 px-2.5 py-1"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </div>

        <div className="flex gap-4">
          <Dropdown
            data={[
              { value: "ALL", label: "All Years" },
              { value: "FIRST", label: "1st Year" },
              { value: "SECOND", label: "2nd Year" },
              { value: "THIRD", label: "3rd Year" },
              { value: "FOURTH", label: "4th Year" },
              { value: "FIFTH", label: "5th Year" },
            ]}
            name="year"
            placeholder="Filter by Year"
            className="py-2 border rounded-md w-full min-w-[200px] max-w-sm cursor-pointer"
            onChange={(val) => setSelectedYear(val.target.value)}
          />
          <Dropdown
            data={[
              { value: "ALL", label: "All Courses" },
              ...course.map((c: { id: any; code: any }) => ({
                value: c.id.toString(),
                label: c.code,
              })),
            ]}
            name="course"
            placeholder="Filter by Course"
            className="py-2 border rounded-md w-full min-w-[200px] max-w-sm cursor-pointer"
            onChange={(val) => setSelectedCourse(val.target.value)}
          />
        </div>
      </div>

      {/* Button to open the modal */}
      <div className="flex justify-between items-center">
        {selectedIds.length > 0 && (
          <h2 className="font-semibold text-md text-slate-900">
            Selected Students ({selectedIds.length})
          </h2>
        )}

        <div className="flex justify-end gap-1">
          <div className="flex justify-end gap-2">
            {selectedIds.length > 0 && (
              <Button
                type="button"
                variant="primary"
                isLoading={false}
                buttonLoadingText="Assigning Coach..."
                className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-md text-white"
                onClick={() => handleOpenModal("ASSIGN")}
              >
                <ClipboardIcon className="mr-2 w-5 h-5" />
                Assign Students
              </Button>
            )}
          </div>
          <div className="flex justify-end gap-1">
            {selectedIds.length > 0 && (
              <Button
                type="button"
                variant="primary"
                isLoading={false}
                buttonLoadingText="Transferring..."
                className="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-md text-white"
                onClick={() => handleOpenModal("TRANSFER")}
              >
                <ArrowsRightLeftIcon className="mr-2 w-5 h-5" />
                Transfer Students
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* The main table with all rows */}
      <ManageCoachTable
        rows={rows}
        pageSize={10}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onEdit={() => {}}
      />
    </div>
  );
};

export default ManageCoachTableSection;
