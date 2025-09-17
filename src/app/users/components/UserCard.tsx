import React from "react";
import { User } from "./types";
import DropdownMenu from "./DropdownMenu";
import Button from "./Button";

interface UserCardProps {
  user: User;
  openDropdownId: string | null;
  setOpenDropdownId: (id: string | null) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onView: (user: User) => void;
}

export default function UserCard({ user, openDropdownId, setOpenDropdownId, onEdit, onDelete, onView }: UserCardProps) {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="relative flex justify-end px-4 pt-4">
        <button onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-700 rounded-lg text-sm p-1.5">
          <span className="sr-only">Open dropdown</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 3">
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        {openDropdownId === user.id && <DropdownMenu onEdit={() => onEdit(user)} onDelete={() => onDelete(user.id)} />}
      </div>

      <div className="flex flex-col items-center pb-6 px-4 text-center ">
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</h5>
        <p className="text-slate-600 leading-normal font-light">📧 {user.email}</p>
        <p className="text-slate-600 leading-normal font-light">📍 {user.city}</p>
        <div className="w-full flex justify-center mt-8 mb-1">
          <Button variant="secondary" onClick={() => onView(user)}>Show more</Button>
        </div>
      </div>
    </div>
  );
}
