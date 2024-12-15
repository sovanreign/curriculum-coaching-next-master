"use client";

import React, { useState } from "react";
import { z } from "zod";
import axios from "axios";

import { SignInSchema, signInSchema, RoleEnum } from "@/validation/authSchema";
import { useRouter } from "next/navigation";
import SignInImageSection from "./components/SignInImageSection";
import SignInForm from "./components/SignInForm";
import Alert from "../components/Alert";

const SignInPage = () => {
  const [formData, setFormData] = useState<SignInSchema>({
    role: RoleEnum.Enum.ADMIN,
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      signInSchema.parse(formData);

      // Send the request to the server
      const response = await axios.post("/api/auth/signin", formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setTimeout(() => {
          setLoading(false);
          router.push("/ccms/profile");
        }, 1000);
      } else {
        setLoading(false);
        setError("An unexpected error occurred");
      }
    } catch (err: any) {
      setLoading(false);

      if (err instanceof z.ZodError) {
        setError("Fields cannot be empty");
      } else if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError("Invalid username or password");
        } else {
          setError("Check your internet connection and try again");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-1 h-screen min-h-full">
      {loading && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div
            className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"
            role="status"
            aria-live="polite"
          ></div>
        </div>
      )}

      {/* Conditionally render the Alert if there's an error */}
      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      <SignInImageSection />
      <SignInForm
        formData={formData}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        loading={loading}
      />
    </div>
  );
};

export default SignInPage;
