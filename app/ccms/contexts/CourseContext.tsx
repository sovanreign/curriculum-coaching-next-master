import React, { createContext, useContext, useState } from "react";

interface CourseContextType {
  course: any;
  setCourse: React.Dispatch<React.SetStateAction<any>>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [course, setCourse] = useState<any>(null);

  return (
    <CourseContext.Provider value={{ course, setCourse }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within a CourseProvider");
  }
  return context;
};
