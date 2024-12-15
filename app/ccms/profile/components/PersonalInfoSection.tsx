"use client";

import React, { useMemo, useState } from "react";
import { ScaleIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";
import Button from "@/app/components/Button";

interface PersonalInfoSectionProps {
  firstName: string;
  lastName: string;
  department?: string;
  emailAddress?: string;
  password?: string;
  contactNumber?: string;
  address?: string;
  onSave: (updatedData: {
    firstName: string;
    lastName: string;
    department?: string;
    emailAddress?: string;
    password?: string;
    contactNumber?: string;
    address?: string;
  }) => Promise<boolean>;
}

const defaultToNA = (value?: string): string =>
  value === undefined || value === "" || value === null ? "N/A" : value;

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  firstName,
  lastName,
  contactNumber,
  department,
  emailAddress,
  password,
  address,
  onSave,
}) => {
  const initialData = {
    firstName: defaultToNA(firstName),
    lastName: defaultToNA(lastName),
    contactNumber: defaultToNA(contactNumber),
    department: defaultToNA(department),
    emailAddress: defaultToNA(emailAddress),
    password: defaultToNA(password),
    address: defaultToNA(address),
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(formData).then((success) => {
      if (success) {
        setIsEditing(false);
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(initialData);
  };

  const isFieldReadOnly = (value: string, target?: boolean) =>
    !isEditing || (value === "N/A" && !!target);

  // Check if any field has changed compared to the initial data
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  return (
    <div className="flex flex-col gap-6 bg-white shadow-sm px-8 py-6 border rounded-2xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <span className="font-medium text-lg">Personal Information</span>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
        {/* First Name */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            readOnly={isFieldReadOnly(formData.firstName)}
            className={`border rounded-lg px-4 py-2 text-gray-700 ${
              isFieldReadOnly(formData.firstName) ? "bg-gray-100" : "bg-white"
            }`}
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            readOnly={isFieldReadOnly(formData.lastName)}
            className={`border rounded-lg px-4 py-2 text-gray-700 ${
              isFieldReadOnly(formData.lastName) ? "bg-gray-100" : "bg-white"
            }`}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            readOnly={isFieldReadOnly(formData.department, true)}
            className={`border rounded-lg px-4 py-2 text-gray-700 ${
              isFieldReadOnly(formData.department, true)
                ? "bg-gray-100"
                : "bg-white"
            }`}
          />
        </div>

        {/* Contact Number */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            readOnly={isFieldReadOnly(formData.contactNumber)}
            className={`border rounded-lg px-4 py-2 text-gray-700 ${
              isFieldReadOnly(formData.contactNumber)
                ? "bg-gray-100"
                : "bg-white"
            }`}
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">Email Address</label>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            readOnly={isFieldReadOnly(formData.emailAddress)}
            className={`border rounded-lg px-4 py-2 text-gray-700 ${
              isFieldReadOnly(formData.emailAddress)
                ? "bg-gray-100"
                : "bg-white"
            }`}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-gray-500 text-sm">Password</label>
          {isEditing && formData.password !== "N/A" ? (
            <input
              type="password"
              name="password"
              value={formData.password === "N/A" ? "" : formData.password}
              onChange={handleChange}
              readOnly={isFieldReadOnly(formData.password)}
              className={`border rounded-lg px-4 py-2 text-gray-700 ${
                isFieldReadOnly(formData.password) ? "bg-gray-100" : "bg-white"
              }`}
            />
          ) : (
            <div className="flex items-center">
              <span className="flex-1 bg-gray-100 px-4 py-2 border rounded-lg text-gray-700">
                {formData.password === "N/A" ? "N/A" : "-- hidden --"}
              </span>
              {formData.password !== "N/A" && (
                <a
                  href="#"
                  className="ml-2 text-primary-500 text-sm hover:underline"
                >
                  change password?
                </a>
              )}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col col-span-2">
          <label className="text-gray-500 text-sm">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            readOnly={isFieldReadOnly(formData.address)}
            className={`border rounded-lg px-4 py-2 text-gray-700 ${
              isFieldReadOnly(formData.address) ? "bg-gray-100" : "bg-white"
            }`}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 self-end">
        {isEditing ? (
          <>
            <Button
              onClick={handleSave}
              variant="primary"
              className="flex items-center gap-2"
              disabled={!hasChanges} // Disable if no changes
            >
              <ScaleIcon className="w-5 h-5" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={handleEdit}
            variant="primary"
            className="flex items-center gap-2"
          >
            <PencilIcon className="w-5 h-5" />
            Update Information
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
