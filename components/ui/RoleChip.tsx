"use client";

import React from 'react';

interface RoleChipProps {
  role: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "text-purple-600 bg-purple-50 border-purple-100";
    case "VENDOR":
      return "text-blue-600 bg-blue-50 border-blue-100";
    case "CUSTOMER":
      return "text-gray-600 bg-gray-50 border-gray-100";
    default:
      return "text-gray-600 bg-gray-50 border-gray-100";
  }
};

export default function RoleChip({ role }: RoleChipProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(
        role
      )}`}
    >
      {role}
    </span>
  );
}
