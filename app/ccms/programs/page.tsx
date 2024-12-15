"use client";
import React from "react";
import ProgramCard from "./components/ProgramCard";

const ProgramsPage = () => {
  const programs = [
    {
      imageSrc: "/innovative-librarian.png", // Replace with your image URL
      title: "Bachelor of Library Information Science",
      coachCount: 5,
    },
    {
      imageSrc: "/full-stack-developer.png", // Replace with your image URL
      title: "Associate in Computer Technology",
      coachCount: 8,
    },
    {
      imageSrc: "/technology-expert.png", // Replace with your image URL
      title: "Bachelor of Science in Information Technology",
      coachCount: 3,
    },
    {
      imageSrc: "/computing-innovator.png", // Replace with your image URL
      title: "Bachelor of Science in Computer Science",
      coachCount: 3,
    },
  ];

  const handleView = (title: string) => {
    alert(`Viewing details for ${title}`);
  };

  return (
    <div className="flex flex-col flex-1 gap-4 bg-gray-200 scroll-m-1 p-4 rounded-b-none rounded-tl-2xl overflow-y-auto">
      {/* Header */}
      <div className="px-8">
        <h1 className="font-semibold text-xl">Programs</h1>
      </div>
      <div className="flex flex-col gap-4 bg-white shadow-sm px-8 py-8 rounded-2xl">
        <div className="px-8 text-center">
          <h1 className="font-semibold text-primary-500 text-xl">
            SCHOOL OF COMPUTER IN INFORMATION SCIENCES
          </h1>
        </div>
        <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3 p-4">
          {programs.map((program, index) => (
            <ProgramCard
              key={index}
              imageSrc={program.imageSrc}
              title={program.title}
              coachCount={program.coachCount}
              onView={() => handleView(program.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
