"use client";

import React, { useState } from "react";
import ProfileSection from "./components/ProfileSection";
import PersonalInfoSection from "./components/PersonalInfoSection";
import LoadingPage from "@/app/components/LoadingPage";
import { useProfile } from "../contexts/ProfileContext";
import axios from "axios";
import { userUpdateSchema } from "@/validation/userSchema";
import { z } from "zod";
import Alert from "@/app/components/Alert";

const ProfilePage: React.FC = () => {
  const { profile, setProfile } = useProfile();
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isLoading = !profile;

  const handleSave = async (updatedData: {
    firstName: string;
    lastName: string;
    department?: string;
    emailAddress?: string;
    password?: string;
    contactNumber?: string;
    address?: string;
  }): Promise<boolean> => {
    if (!profile) return false;

    const changes: Partial<typeof updatedData> = {};
    for (const key in updatedData) {
      const newValue = updatedData[key as keyof typeof updatedData];
      const originalValue = profile[key as keyof typeof profile];

      if (
        newValue !== undefined &&
        newValue !== "N/A" &&
        newValue !== originalValue
      ) {
        changes[key as keyof typeof updatedData] = newValue;
      }
    }

    if (Object.keys(changes).length === 0) {
      console.log("No changes detected, no PATCH request needed.");
      return false;
    }

    try {
      // Clear previous alerts
      setAlert(null);

      // Validate the changes using Zod
      userUpdateSchema.parse(changes);

      // Make PATCH request
      const response = await axios.patch("/api/users/profile", changes, {
        withCredentials: true,
        params: {
          id: profile.id,
        },
      });

      console.log("Profile updated successfully:", response.data);

      // Update the profile context state
      setProfile((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          ...changes,
        };
      });

      // Show success alert
      setAlert({ message: "Profile updated successfully!", type: "success" });
      return true;
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.errors.map((e) => e.message).join(", ");
        setAlert({ message: errorMessages, type: "error" });
      } else {
        setAlert({
          message: "An unexpected error occurred. Please try again.",
          type: "error",
        });
      }
      return false;
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!profile) {
    return <p>Error: Could not load profile data</p>;
  }

  return (
    <div className="flex flex-col flex-1 gap-4 bg-gray-200 scroll-m-1 p-4 rounded-b-none rounded-tl-2xl overflow-y-auto">
      {/* Floating Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)} // Remove the alert when clicked
        />
      )}

      {/* Header */}
      <div className="px-8">
        <h1 className="font-semibold text-xl">Personal Admin Information</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-4 bg-white shadow-sm px-8 py-8 rounded-2xl">
        <ProfileSection
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
        />
        <PersonalInfoSection
          firstName={profile.firstName}
          lastName={profile.lastName}
          password={profile.password}
          department={profile.department}
          emailAddress={profile.email}
          contactNumber={profile.contactNumber}
          address={profile.address}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
