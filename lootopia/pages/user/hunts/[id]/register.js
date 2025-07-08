"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function RegisterHunt() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Vous devez être connecté pour vous inscrire.");
      return;
    }

    try {
      const res = await fetch(`/api/user/hunts/${id}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Inscription réussie ! Merci.");
        setRedirecting(true);
      } else {
        setMessage(data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      setMessage("Erreur réseau, veuillez réessayer.");
    }
  };

  // Effet pour rediriger après 3 secondes si inscription réussie
  useEffect(() => {
    if (redirecting) {
      const timer = setTimeout(() => {
        router.push("/home");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [redirecting, router]);

  return (
    <div className="max-w-md mx-auto p-4 mt-10 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Inscription à la chasse #{id}</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      {!message || !redirecting ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Nom complet"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            S'inscrire
          </button>
        </form>
      ) : null}
    </div>
  );
}
