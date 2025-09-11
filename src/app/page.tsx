"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const modalRef = useRef(modalIsOpen);

  useEffect(() => {
    modalRef.current = modalIsOpen;
  }, [modalIsOpen]);


  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalRef.current) {
        setModalIsOpen(false);

        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);


  useEffect(() => {
    fetch("https://uoc2zyn2f1.execute-api.us-east-1.amazonaws.com/users")
      .then((res) => res.json())
      .then((json) => {
        setUsers(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setLoading(false);
      });

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalIsOpen) {
        setModalIsOpen(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modalIsOpen]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newUser = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      city: formData.get("city"),
      age: formData.get("age"),
    };

    try {
      const res = await fetch("https://uoc2zyn2f1.execute-api.us-east-1.amazonaws.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar usuário");
      }

      const savedUser = await res.json();

      setUsers((prev) => [...prev, savedUser]);
      setModalIsOpen(false);
    } catch (err) {
      console.error("Erro no POST:", err);
    }
  };



  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <main className="max-w-5xl mx-auto p-4">
      {/* search + new user */}
      <div className="grid md:grid-cols-3 gap-4 mb-4 items-center">
        <div className="col-span-2 md:col-span-1">
          <div className="relative w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow w-full"
              placeholder="Search"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
            />
          </div>
        </div>
        <div className="col-span-2 justify-self-end">
          <button
            className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 text-white rounded-md hover:bg-gray-600 transition"
            onClick={() => setModalIsOpen(true)}
          >
            New user
          </button>
        </div>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="relative flex justify-end px-4 pt-4">
              <button
                onClick={() =>
                  setOpenDropdownId(openDropdownId === user.id ? null : user.id)
                }
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-700 rounded-lg text-sm p-1.5"
                type="button"
              >
                <span className="sr-only">Open dropdown</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 3">
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>
              {openDropdownId === user.id && (
                <div className="absolute right-0 top-10 z-20 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  <ul className="py-2">
                    <li>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                      >
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* card separado */}
            <div className="flex flex-col items-center pb-10">
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h5>
              <p className="text-slate-600 leading-normal font-light">
                📧 {user.email}
              </p>
              <p className="text-slate-600 leading-normal font-light">
                📍 {user.city}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* modal */}
      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setModalIsOpen(false)}
          />
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 relative z-10 w-full max-w-2xl max-h-screen overflow-y-auto p-6">
            <div className="border-b border-white/10 pb-2">
              <h2 className="text-base/7 text-white">Create user</h2>
            </div>
            <button
              className="absolute right-0 top-0 m-4 text-gray-400 transition-all hover:text-red-400"
              onClick={() => setModalIsOpen(false)}
            >
              X
            </button>

            <form onSubmit={handleSave} className="mt-10 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label htmlFor="firstName" className="block text-sm/6 font-medium text-white">First name</label>
                <div className="mt-2">
                  <input id="firstName" type="text" name="firstName" placeholder="First name" autocomplete="given-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="lastName" className="block text-sm/6 font-medium text-white">Last name</label>
                <div className="mt-2">
                  <input id="lastName" type="text" name="lastName" placeholder="Last name" autocomplete="family-name" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="email" className="block text-sm/6 font-medium text-white">Email address</label>
                <div className="mt-2">
                  <input id="email" type="email" name="email" placeholder="Email" autocomplete="email" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label htmlFor="city" className="block text-sm/6 font-medium text-white">City</label>
                <div className="mt-2">
                  <input id="city" type="text" name="city" placeholder="City" autocomplete="address-level2" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="region" className="block text-sm/6 font-medium text-white">Age</label>
                <div className="mt-2">
                  <input id="age" type="number" name="age" placeholder="Age" autocomplete="age" className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
              </div>

              <div className="sm:col-span-4 border-t border-white/10 mt-8 pt-4 flex justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold text-white"
                  onClick={() => setModalIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Save
                </button>
              </div>



            </form>

          </div>
        </div>
      )}
    </main>
  );
}

