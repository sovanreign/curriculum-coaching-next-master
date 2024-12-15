"use client";

import Button from "@/app/components/Button";
import Dropdown from "@/app/components/Dropdown";
import { RoleEnum } from "@/validation/authSchema";
import React from "react";

const roleOptions = [
  { value: RoleEnum.Values.ADMIN, label: "Admin" },
  { value: RoleEnum.Values.STUDENT, label: "Student" },
  { value: RoleEnum.Values.COACH, label: "Coach" },
];

export default function SignInForm({
  formData,
  handleSubmit,
  loading,
  handleInputChange,
}: {
  formData: { role: RoleEnum; username: string; password: string };
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="flex flex-col flex-1 justify-center bg-[#E3DCDC] sm:px-6 py-12 border border-l-black">
      <div className="mx-auto w-full lg:w-96 max-w-sm">
        <div className="flex flex-col">
          <span className="mt-8 font-bold text-2xl text-gray-900 tracking-tight">
            Welcome Back
          </span>
          <span className="mt-1 text-gray-500 text-sm">
            Welcome back! Please enter your details
          </span>
        </div>

        <div className="mt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="role"
                className="block font-medium text-gray-900 text-sm"
              >
                Login as
              </label>
              <div className="mt-2">
                <Dropdown
                  name="role"
                  onChange={handleInputChange}
                  data={roleOptions}
                  placeholder="Select your role"
                  className="block shadow-sm py-3 pl-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-primary-500 ring-inset w-full sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block font-medium text-gray-900 text-sm"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  autoComplete="email"
                  className="block border-0 shadow-sm py-3 pl-2 rounded-md ring-1 ring-gray-300 focus:ring-2 focus:ring-primary-500 ring-inset w-full placeholder:text-gray-400 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-900 text-sm"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="block shadow-sm py-3 pl-2 rounded-md focus:ring-2 focus:ring-primary-500 ring-inset w-full placeholder:text-gray-400 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="border-gray-300 checked:bg-primary-500 rounded focus:ring-primary-500 w-3 h-3"
                />

                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-gray-700 text-sm"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-primary-500 hover:text-primary-400"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                isLoading={loading}
                variant="primary"
                className="w-full"
                buttonLoadingText="Signing In"
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
