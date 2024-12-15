"use client";

import React, { useEffect, useMemo, useState } from "react";
import Button from "@/app/components/Button";
import Dropdown from "@/app/components/Dropdown";
import CoachTable from "./CoachTable"; // Renamed from StudentTable
import Modal from "../../components/Modal";
import axios from "axios";
import { useCourse } from "../../contexts/CourseContext";
import Alert from "@/app/components/Alert";
import { coachSchema } from "@/validation/coachSchema";
import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

/**
 * Helper: convert empty or null fields to "N/A"
 */
const defaultToNA = (value?: string | null): string => (!value ? "N/A" : value);

/** Coach Data Interface */
interface CoachData {
  address: string;
  bio: string;
  contactNumber: string | null;
  courseId: number | null; // If your "Coach" model doesn't need `courseId`, feel free to remove it
  createdAt: string;
  departmentId: number | null; // Same note here
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  role: string;
  uniqueId: string;
  updatedAt: string;
  username: string;
  yearLevel: string | null; // If coaches don't have year levels, remove this
}

interface CoachProfileProps {
  coachData: CoachData[];
  onSearch?: (query: string | null) => void;
}

const CoachTableSection: React.FC<CoachProfileProps> = ({
  coachData,
  onSearch,
}) => {
  const [rows, setRows] = useState<CoachData[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");

  // Alert for success/error
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // "Add Coach" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation errors for the "Add Coach" form
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // "View/Edit Coach" modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<CoachData | null>(null);
  const [viewFormData, setViewFormData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  // States for the "Add Coach" fields
  const [modalYearLevel, setModalYearLevel] = useState<string | null>(null);
  const [modalCourseId, setModalCourseId] = useState<number | null>(null);

  // If your context is specifically for courses, rename if needed
  const { course } = useCourse();

  /**
   * Load initial data into 'rows'
   */
  useEffect(() => {
    if (Array.isArray(coachData)) {
      setRows(coachData);
    }
  }, [coachData]);

  /**
   * Filter rows based on selected year & course
   * (If coaches don't have year/course, remove this logic)
   */
  useEffect(() => {
    if (!Array.isArray(coachData)) return;

    let filteredData = [...coachData];

    if (selectedYear !== "ALL") {
      filteredData = filteredData.filter(
        (coach) => coach.yearLevel === selectedYear
      );
    }

    if (selectedCourse !== "ALL") {
      const courseId = parseInt(selectedCourse, 10);
      filteredData = filteredData.filter(
        (coach) => coach.courseId === courseId
      );
    }

    setRows(filteredData);
  }, [coachData, selectedYear, selectedCourse]);

  /**
   * Table selection logic
   */
  const handleSelectionChange = (newSelectedIds: number[]) => {
    setSelectedIds(newSelectedIds);
  };

  /**
   * Search logic
   */
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (onSearch) onSearch(null);
  };

  /**
   * Delete selected logic
   */
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm("Are you sure you want to delete the selected rows?")) {
      setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      setSelectedIds([]);
    }
  };

  /**
   * "Add Coach" Modal logic
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalYearLevel("FIRST");
    setModalCourseId(course[0]?.id ?? null);
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCoach = (newCoach: CoachData) => {
    setRows((prevRows) => [
      ...prevRows,
      {
        ...newCoach,
        id: newCoach.id,
        createdAt: newCoach.createdAt,
        updatedAt: newCoach.updatedAt,
      },
    ]);
  };

  /** Submit logic for "Add Coach" modal */
  const handleSubmitModal = async () => {
    setIsSubmitting(true);

    const inputFirstName = (
      document.querySelector('input[name="firstName"]') as HTMLInputElement
    )?.value;
    const inputLastName = (
      document.querySelector('input[name="lastName"]') as HTMLInputElement
    )?.value;
    const inputAddress = (
      document.querySelector('input[name="address"]') as HTMLInputElement
    )?.value;
    const inputEmail = (
      document.querySelector('input[name="email"]') as HTMLInputElement
    )?.value;
    const inputCoachId = (
      document.querySelector('input[name="coachId"]') as HTMLInputElement
    )?.value;

    // Validate "Add Coach" fields with Zod
    const validationResult = coachSchema.safeParse({
      firstName: inputFirstName,
      lastName: inputLastName,
      address: inputAddress,
      email: inputEmail,
      coachId: inputCoachId,
      yearLevel: modalYearLevel || undefined,
      courseId: modalCourseId ?? undefined,
      departmentId: course.find(
        (c: { id: number | null }) => c.id === modalCourseId
      )?.departmentId,
    });

    if (!validationResult.success) {
      const zodErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const fieldName = err.path.join(".");
        zodErrors[fieldName] = err.message;
      });
      setFormErrors(zodErrors);
      setIsSubmitting(false);
      return;
    }

    // Construct payload for new coach
    const payload = {
      username: inputCoachId || "defaultUsername",
      password: "password",
      firstName: inputFirstName || "",
      lastName: inputLastName || "",
      uniqueId: inputCoachId || `COACH-${Date.now()}`,
      bio: "",
      contactNumber: null,
      email: inputEmail || "",
      departmentId: course.find(
        (c: { id: number | null }) => c.id === modalCourseId
      )?.departmentId,
      courseId: modalCourseId,
      yearLevel: modalYearLevel,
      address: inputAddress || "",
      role: "COACH",
    };

    try {
      const response = await axios.post("/api/coaches", payload);

      if (response.data.success) {
        setAlert({ message: "Coach added successfully", type: "success" });
        handleAddCoach({
          ...payload,
          id: response.data.data.id,
          createdAt: response.data.data.createdAt,
          updatedAt: response.data.data.updatedAt,
        });
        handleCloseModal();
      } else {
        setAlert({ message: "Error adding coach", type: "error" });
        console.error("Error adding coach:", response.data.message);
      }
    } catch (error: any) {
      // Check for 409 (Conflict) or any other status
      if (error.response) {
        if (error.response.status === 409) {
          // Conflict error (duplicate entry, etc.)
          setAlert({
            message: `Conflict Error: ${
              error.response.data?.message || "Already exists."
            }`,
            type: "error",
          });
        } else {
          // Other error statuses
          setAlert({
            message: `Error adding coach: ${
              error.response.data?.message || "Unknown error"
            }`,
            type: "error",
          });
        }
        console.error("Server Error:", error.response.data);
      } else {
        // Network or other errors
        setAlert({ message: "Network error occurred.", type: "error" });
        console.error("Error submitting form:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * "View/Edit" Coach
   */
  const handleViewCoach = (id: number) => {
    const coach = rows.find((r) => r.id === id);
    if (!coach) return;

    // Convert null/empty fields to "N/A"
    const initialViewData: Record<string, string> = {
      firstName: defaultToNA(coach.firstName),
      lastName: defaultToNA(coach.lastName),
      email: defaultToNA(coach.email),
      address: defaultToNA(coach.address),
      contactNumber: defaultToNA(coach.contactNumber || ""),
      yearLevel: defaultToNA(coach.yearLevel),
      courseId: coach.courseId ? coach.courseId.toString() : "N/A",
    };

    setSelectedCoach(coach);
    setViewFormData(initialViewData);
    setIsEditing(false);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setViewFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasViewChanges = useMemo(() => {
    if (!selectedCoach) return false;
    const originalValues: Record<string, string> = {
      firstName: selectedCoach.firstName || "",
      lastName: selectedCoach.lastName || "",
      email: selectedCoach.email || "",
      address: selectedCoach.address || "",
      contactNumber: selectedCoach.contactNumber || "",
      yearLevel: selectedCoach.yearLevel || "",

      courseId: selectedCoach.courseId ? selectedCoach.courseId.toString() : "",
    };
    // Convert "N/A" to empty strings for comparison
    const currentValues = { ...viewFormData };
    for (const key in currentValues) {
      if (currentValues[key] === "N/A") currentValues[key] = "";
    }
    return JSON.stringify(currentValues) !== JSON.stringify(originalValues);
  }, [viewFormData, selectedCoach]);

  const handleViewSave = async () => {
    if (!selectedCoach) return;

    const changes: Partial<CoachData> = {};
    const finalData: Record<string, string> = { ...viewFormData };

    // Convert "N/A" back to empty or null
    Object.keys(finalData).forEach((key) => {
      if (finalData[key] === "N/A") finalData[key] = "";
    });

    // Compare finalData to the original coach
    if (finalData.firstName !== selectedCoach.firstName) {
      changes.firstName = finalData.firstName;
    }
    if (finalData.lastName !== selectedCoach.lastName) {
      changes.lastName = finalData.lastName;
    }
    if (finalData.email !== selectedCoach.email) {
      changes.email = finalData.email;
    }
    if (finalData.address !== selectedCoach.address) {
      changes.address = finalData.address;
    }
    if (finalData.contactNumber !== (selectedCoach.contactNumber || "")) {
      changes.contactNumber = finalData.contactNumber || null;
    }
    if (finalData.yearLevel !== (selectedCoach.yearLevel || "")) {
      changes.yearLevel = finalData.yearLevel || null;
    }
    if (
      finalData.courseId !== (selectedCoach.courseId?.toString() || "") &&
      finalData.courseId
    ) {
      changes.courseId = parseInt(finalData.courseId, 10) || null;
      changes.departmentId = course.find(
        (c: { id: number | null }) => c.id === changes.courseId
      )?.departmentId;
    }

    if (Object.keys(changes).length === 0) {
      console.log("No changes detected.");
      setIsEditing(false);
      setIsViewModalOpen(false);
      return;
    }

    try {
      const response = await axios.patch("/api/coaches", changes, {
        withCredentials: true,
        params: {
          id: selectedCoach.id,
        },
      });

      if (response.data.success) {
        setAlert({ message: "Coach updated successfully", type: "success" });
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedCoach.id ? { ...row, ...changes } : row
          )
        );
        setIsViewModalOpen(false);
      } else {
        setAlert({ message: "An error occurred", type: "error" });
        console.error("Error updating coach:", response.data.message);
      }
    } catch (err) {
      setAlert({ message: "An error occurred", type: "error" });
      console.error("Error updating coach:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* "Add Coach" Modal */}
      <Modal
        closeText="Cancel"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Coach"
        submitText={isSubmitting ? "Saving..." : "Save"}
        onSubmit={handleSubmitModal}
      >
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm">First Name</label>
            <input
              type="text"
              name="firstName"
              className="bg-white px-4 py-2 border rounded-lg text-gray-700"
            />
            {formErrors.firstName && (
              <p className="mt-1 text-red-500 text-xs">
                {formErrors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="bg-white px-4 py-2 border rounded-lg text-gray-700"
            />
            {formErrors.lastName && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.lastName}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col lg:col-span-2">
            <label className="text-gray-500 text-sm">Address</label>
            <input
              type="text"
              name="address"
              className="bg-white px-4 py-2 border rounded-lg text-gray-700"
            />
            {formErrors.address && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.address}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm">Email Address</label>
            <input
              type="email"
              name="email"
              className="bg-white px-4 py-2 border rounded-lg text-gray-700"
            />
            {formErrors.email && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.email}</p>
            )}
          </div>

          {/* Coach ID (like employee code) */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm">Coach ID</label>
            <input
              type="text"
              name="coachId"
              className="bg-white px-4 py-2 border rounded-lg text-gray-700"
            />
            {formErrors.coachId && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.coachId}</p>
            )}
          </div>

          {/* Year Level (If not needed, remove) */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm">Year Level</label>
            <Dropdown
              data={[
                { value: "FIRST", label: "1st Year" },
                { value: "SECOND", label: "2nd Year" },
                { value: "THIRD", label: "3rd Year" },
                { value: "FOURTH", label: "4th Year" },
                { value: "FIFTH", label: "5th Year" },
              ]}
              name="year"
              placeholder="Select Year"
              className="px-2 py-3 border rounded-md cursor-pointer"
              onChange={(val) => setModalYearLevel(val.target.value)}
            />
            {formErrors.yearLevel && (
              <p className="mt-1 text-red-500 text-xs">
                {formErrors.yearLevel}
              </p>
            )}
          </div>

          {/* Course (If not needed, remove) */}
          <div className="flex flex-col">
            <label className="text-gray-500 text-sm">Course</label>
            <Dropdown
              data={course.map((c: { id: any; code: any }) => ({
                value: c.id,
                label: c.code,
              }))}
              name="course"
              placeholder="Select Course"
              className="px-2 py-3 border rounded-md cursor-pointer"
              onChange={(selected) =>
                setModalCourseId(parseInt(selected.target.value, 10))
              }
            />
            {formErrors.courseId && (
              <p className="mt-1 text-red-500 text-xs">{formErrors.courseId}</p>
            )}
          </div>
        </div>
      </Modal>

      {/* "View/Edit Coach" Modal */}
      {selectedCoach && (
        <Modal
          closeText="Close"
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          title="View / Edit Coach"
          submitText={isEditing ? "Save" : "Edit"}
          onSubmit={() => {
            if (isEditing) {
              handleViewSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                className={`border rounded-lg px-4 py-2 text-gray-700 ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                value={viewFormData.firstName || ""}
                onChange={handleViewChange}
                readOnly={!isEditing}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                className={`border rounded-lg px-4 py-2 text-gray-700 ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                value={viewFormData.lastName || ""}
                onChange={handleViewChange}
                readOnly={!isEditing}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">Email</label>
              <input
                type="text"
                name="email"
                className={`border rounded-lg px-4 py-2 text-gray-700 ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                value={viewFormData.email || ""}
                onChange={handleViewChange}
                readOnly={!isEditing}
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                className={`border rounded-lg px-4 py-2 text-gray-700 ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                value={viewFormData.contactNumber || ""}
                onChange={handleViewChange}
                readOnly={!isEditing}
              />
            </div>

            {/* Year Level Dropdown (Remove if not needed) */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">Year Level</label>
              <Dropdown
                data={[
                  { value: "FIRST", label: "1st Year" },
                  { value: "SECOND", label: "2nd Year" },
                  { value: "THIRD", label: "3rd Year" },
                  { value: "FOURTH", label: "4th Year" },
                  { value: "FIFTH", label: "5th Year" },
                ]}
                name="yearLevel"
                placeholder="Select Year"
                className={`px-2 py-3 border rounded-md cursor-pointer ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                onChange={(val) =>
                  setViewFormData((prev) => ({
                    ...prev,
                    yearLevel: val.target.value,
                  }))
                }
                value={
                  viewFormData.yearLevel !== "N/A" ? viewFormData.yearLevel : ""
                }
                disabled={!isEditing}
              />
            </div>

            {/* Course Dropdown (Remove if not needed) */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-sm">Course</label>
              <Dropdown
                data={course.map((c: { id: any; code: any }) => ({
                  value: c.id.toString(),
                  label: c.code,
                }))}
                name="courseId"
                placeholder="Select Course"
                className={`px-2 py-3 border rounded-md cursor-pointer ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                onChange={(val) =>
                  setViewFormData((prev) => ({
                    ...prev,
                    courseId: val.target.value,
                  }))
                }
                value={
                  viewFormData.courseId !== "N/A" ? viewFormData.courseId : ""
                }
                disabled={!isEditing}
              />
            </div>

            {/* Address */}
            <div className="flex flex-col lg:col-span-2">
              <label className="text-gray-500 text-sm">Address</label>
              <input
                type="text"
                name="address"
                className={`border rounded-lg px-4 py-2 text-gray-700 ${
                  !isEditing ? "bg-gray-100" : "bg-white"
                }`}
                value={viewFormData.address || ""}
                onChange={handleViewChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <p className="mt-3 text-gray-500 text-sm">
            {isEditing
              ? "Make changes and click Save"
              : "Click Edit to update this coach's information."}
          </p>
        </Modal>
      )}

      {/* Search and Filters */}
      <div className="flex justify-between">
        <div className="relative w-full min-w-[200px] max-w-sm">
          <input
            className="border-slate-200 hover:border-slate-300 focus:border-slate-400 bg-transparent shadow-sm focus:shadow py-3 pr-28 pl-3 border rounded-md w-full text-slate-700 placeholder:text-slate-400 transition duration-300 ease focus:outline-none"
            placeholder="Search for coaches"
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
            <MagnifyingGlassIcon className="mr-2 w-5 h-5" />

            <span className="font-medium">Search</span>
          </Button>
        </div>

        {/* Filters (Remove if not needed for coaches) */}
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

      {/* Delete and Add Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex justify-end gap-1">
          {selectedIds.length > 0 && (
            <Button
              type="button"
              variant="primary"
              isLoading={false}
              buttonLoadingText="Deleting..."
              className={`flex items-center gap-1 px-4 py-2 bg-[#d9534f] text-white rounded-md hover:bg-[#d9534f] ${
                selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
            >
              <TrashIcon className="mr-2 w-5 h-5" />
              Delete <span className="font-semibold">
                {selectedIds.length}
              </span>{" "}
              Selected
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            isLoading={false}
            buttonLoadingText="Add Coach"
            className="flex items-center gap-2"
            onClick={handleOpenModal}
          >
            <PlusIcon className="w-5 h-5" />
            Add Coach
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={false}
            buttonLoadingText="Upload Coaches"
            className="flex items-center gap-2"
            onClick={() => {}}
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Upload Coaches
          </Button>
        </div>
      </div>

      {/* Coach Table */}
      <CoachTable
        pageSize={10}
        rows={rows || []}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onEdit={handleViewCoach}
      />
    </div>
  );
};

export default CoachTableSection;
