import React from "react";
import { User } from "./types";
import Button from "./Button";

interface UserModalProps {
  isOpen: boolean;
  editUser: User | null;
  viewUser: boolean;
  onClose: () => void;
  onSave: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function UserModal({ isOpen, editUser, viewUser, onClose, onSave }: UserModalProps) {
  if (!isOpen) return null;

  const getModalTitle = () => {
    if (viewUser) return "User Details";
    if (editUser) return "Edit User";
    return "Create User";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 relative z-10 w-full max-w-2xl max-h-screen overflow-y-auto p-6">
        <div className="border-b border-white/10 pb-2">
          <h2 className="text-base/7 text-white">{getModalTitle()}</h2>
        </div>
        <form onSubmit={onSave} className="mt-6 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-4">
          {/* First Name */}
          <div className="sm:col-span-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-white">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={editUser?.firstName || ""}
              disabled={viewUser}
              autoComplete="given-name"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* Last Name */}
          <div className="sm:col-span-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-white">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={editUser?.lastName || ""}
              disabled={viewUser}
              autoComplete="family-name"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={editUser?.email || ""}
              disabled={viewUser}
              autoComplete="email"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* City */}
          <div className="sm:col-span-2">
            <label htmlFor="city" className="block text-sm font-medium text-white">City</label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={editUser?.city || ""}
              disabled={viewUser}
              autoComplete="address-level2"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* Age */}
          <div className="sm:col-span-2">
            <label htmlFor="age" className="block text-sm font-medium text-white">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              defaultValue={editUser?.age || ""}
              disabled={viewUser}
              autoComplete="age"
              className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-500 focus:outline-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-4 border-t border-white/10 mt-6 pt-4 flex justify-end gap-x-4">
            <Button variant="secondary" type="button" onClick={onClose}>
              {viewUser ? "Close" : "Cancel"}
            </Button>
            {!viewUser && (
              <Button type="submit" variant="primary">
                {editUser ? "Save Changes" : "Save"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
