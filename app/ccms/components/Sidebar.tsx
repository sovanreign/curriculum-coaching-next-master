"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarItem {
  label: string;
  link?: string;
  icon: React.ElementType;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col bg-white w-64 h-screen text-gray-800">
      {/* Logo Section */}
      <div className="flex flex-col justify-center items-center gap-2 border-gray-200 px-6 py-4 border-b w-64 font-bold text-lg">
        <Image
          src="/curriculum-logo.png"
          width={80}
          height={80}
          alt="App Logo"
        />
        <div className="flex flex-col justify-center items-center">
          <span>Curriculum Coaching</span>
          <span className="font-medium text-sm">Management System</span>
        </div>
      </div>

      {/* Sidebar Items */}
      <ul className="flex flex-col flex-1 space-y-2 px-4 py-6">
        {items.map((item, index) => {
          const isActive = item.link ? pathname === item.link : false;
          const liClasses = [
            "flex items-center space-x-4 p-2 rounded-lg cursor-pointer group",
            isActive
              ? "bg-primary-500 text-white"
              : "hover:bg-primary-500 hover:text-white text-gray-800",
          ].join(" ");

          const iconClasses = [
            "w-6 h-6",
            isActive ? "text-white" : "text-gray-400 group-hover:text-white",
          ].join(" ");

          return item.onClick ? (
            <li key={index} className={liClasses} onClick={item.onClick}>
              <item.icon className={iconClasses} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ) : item.link ? (
            <Link href={item.link} key={index}>
              <li className={liClasses}>
                <item.icon className={iconClasses} aria-hidden="true" />
                <span>{item.label}</span>
              </li>
            </Link>
          ) : (
            <li key={index} className={liClasses}>
              <item.icon className={iconClasses} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
