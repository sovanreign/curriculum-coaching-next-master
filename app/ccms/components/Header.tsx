import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface HeaderProps {
  firstName?: string;
  lastName?: string;
  uniqueId?: string;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  firstName,
  lastName,
  uniqueId,
  isLoading = false,
}) => {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    <header className="w-full">
      <div className="flex justify-end items-center gap-2 mx-auto px-8 h-16">
        {isLoading ? (
          // Loading Skeleton
          <div className="flex flex-col items-end animate-pulse">
            <div className="bg-gray-300 rounded w-20 h-4"></div>
            <div className="bg-gray-200 mt-1 rounded w-16 h-3"></div>
          </div>
        ) : (
          (fullName || uniqueId) && (
            <div className="flex flex-col items-end">
              {fullName && (
                <span className="font-semibold text-gray-700 text-sm">
                  {fullName}
                </span>
              )}
              {uniqueId && (
                <span className="text-gray-500 text-xs">{uniqueId}</span>
              )}
            </div>
          )
        )}
        {isLoading ? (
          <div className="bg-gray-300 rounded-full w-8 h-8 animate-pulse" />
        ) : (
          <Image
            src="/sample_profile.jpg"
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
