"use client";

import { useEffect, useState, useRef } from "react";
import { User } from "./components/types";
import SearchBar from "./components/SearchBar";
import Button from "./components/Button";
import UserCard from "./components/UserCard";
import UserModal from "./components/UserModal";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState(false);

  const modalRef = useRef(modalIsOpen);

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase())
  );

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
  }, []);

  const handleCreate = () => {
    setEditUser(null);
    setModalIsOpen(true);
    setViewUser(false);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setModalIsOpen(true);
    setViewUser(false);
  };

  const handleView = (user: User) => {
    setEditUser(user);
    setViewUser(true);
    setModalIsOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      const confirmed = window.confirm("Tem certeza que deseja excluir este usuário?");
      if (!confirmed) return;

      const res = await fetch(`https://uoc2zyn2f1.execute-api.us-east-1.amazonaws.com/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao excluir usuário.");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      city: formData.get("city") as string,
      age: Number(formData.get("age")),
    };

    let url = "https://uoc2zyn2f1.execute-api.us-east-1.amazonaws.com/users";
    let method = "POST";

    if (editUser) {
      url += `/${editUser.id}`;
      method = "PUT";
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error(`Erro ao ${editUser ? "editar" : "salvar"} usuário.`);

      const savedUser: User = await res.json();

      if (editUser) {
        setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
      } else {
        setUsers((prev) => [...prev, savedUser]);
      }

      setModalIsOpen(false);
      setEditUser(null);
    } catch (err) {
      console.error("Erro na requisição:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-3 gap-4 mb-4 items-center">
        <div className="col-span-2 md:col-span-1">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <div className="col-span-2 justify-self-end">
          <Button onClick={handleCreate}>New user</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        ))}
      </div>

      <UserModal
        isOpen={modalIsOpen}
        editUser={editUser}
        viewUser={viewUser}
        onClose={() => setModalIsOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
}
