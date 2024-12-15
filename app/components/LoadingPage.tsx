"use client";

import React from "react";

const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 gap-4 bg-gray-200 scroll-m-1 p-4 rounded-b-none rounded-t-2xl overflow-y-auto">

      {/* Title Skeleton */}
      <div className="px-8">
        <div className="bg-gray-300 rounded w-1/4 h-6 animate-pulse" />
      </div>

      <div className="flex flex-col gap-4 bg-white shadow-sm px-8 py-8 rounded-2xl">

        {/* ProfileSection Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 px-12 py-3 border rounded-2xl">
            <div className="bg-gray-300 rounded w-28 h-28 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="bg-gray-300 rounded w-32 h-5 animate-pulse" />
              <div className="bg-gray-300 rounded w-20 h-4 animate-pulse" />
            </div>
          </div>
        </div>

        {/* PersonalInfoSection Skeleton */}
        <div className="flex flex-col gap-6 bg-white shadow-sm px-8 py-6 border rounded-2xl w-full">
          {/* Simulate a grid of form fields */}
          <div className="gap-4 grid grid-cols-2">
            {/* Each field skeleton */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="bg-gray-200 rounded w-1/3 h-4" />
                <div className="bg-gray-300 rounded h-8 animate-pulse" />
              </div>
            ))}
            {/* Address takes a full row (simulate col-span-2) */}
            <div className="flex flex-col gap-1 col-span-2">
              <div className="bg-gray-200 rounded w-1/3 h-4" />
              <div className="bg-gray-300 rounded h-8 animate-pulse" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingPage;
