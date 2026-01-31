"use client";
import { useState, useEffect } from "react";
import DebounceSearch from "@/components/DebounceSearch";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function ProfileSkills() {

    const isLoading = useAuthRedirect({ requireAuth: true });
  
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all skills (for search)
  const fetchSkills = async (query) => {
    const res = await fetch(`/api/user/skills?q=${query}`);
    if (!res.ok) throw new Error("Failed to fetch skills");
    return res.json();
  };

  const fetchUserSkills = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUserSkills(data.skills || []);
    } catch (err) {
      setError("Failed to load user skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  // Add or remove skill
  const updateSkill = async (skill, action) => {
    try {
      const res = await fetch("/api/user/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update skill");
      setUserSkills(data.skills);
    } catch (err) {
      setError(err.message);
    }
  };
  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Your Skills
      </h2>

      {/* Show error */}
      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-500">{error}</p>
      )}

      {/* Skill search input */}
      <DebounceSearch
        placeholder="Add a skill..."
        fetchOptions={fetchSkills}
        onSelect={(skill) => updateSkill(skill, "add")}
        disabledOptions={userSkills} // can't add existing skills
      />

      {/* List of user skills */}
      <ul className="mt-4 space-y-2">
        {userSkills.map((skill) => (
          <li
            key={skill}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg text-gray-900 dark:text-gray-100"
          >
            <span>{skill}</span>
            <button
              onClick={() => updateSkill(skill, "remove")}
              className="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
        {userSkills.length === 0 && (
          <li className="text-gray-500 dark:text-gray-400 text-sm">
            No skills added yet.
          </li>
        )}
      </ul>
    </div>
  );
}
