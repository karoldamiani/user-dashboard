import React from "react";

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function DropdownMenu({ onEdit, onDelete }: DropdownMenuProps) {
  return (
    <div className="absolute right-0 top-10 z-20 w-24 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <ul className="py-1">
        <li>
          <button onClick={onEdit} className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700">
            Edit
          </button>
        </li>
        <li>
          <button onClick={onDelete} className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300">
            Delete
          </button>
        </li>
      </ul>
    </div>
  );
}
