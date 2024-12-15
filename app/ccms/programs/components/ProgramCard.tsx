"use client";

import React from "react";

// Props for the ProgramCard
interface ProgramCardProps {
  imageSrc: string; // URL or path to the image
  title: string; // Title of the program
  coachCount: number; // Number of coaches
  onView: () => void; // Callback for the View button
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  imageSrc,
  title,
  coachCount,
  onView,
}) => {
  return (
    <div className="flex flex-col border-gray-50 bg-white shadow-md border rounded-lg transition-transform overflow-hidden hover:scale-105">
      {/* Program Image */}
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />

      {/* Program Details */}
      <div className="flex flex-col flex-1 justify-between p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        <p className="mt-2 text-gray-500 text-sm">
          Number of Coaches: <span className="font-medium">{coachCount}</span>
        </p>

        {/* View Button */}
        <button
          onClick={onView}
          className="bg-primary-500 hover:bg-primary-600 mt-4 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
