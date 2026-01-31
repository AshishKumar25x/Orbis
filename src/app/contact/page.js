"use client";

import { useEffect, useState } from "react";

export default function ProfileInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({
    username: "",
    avatar: "",
    bio: "",
    basicInfo: {
      name: "",
      gender: "",
      birthday: "",
      location: { country: "", state: "", city: "" },
      work: [],
      education: [],
    },
    account: {
      github: "",
      linkedin: "",
      leetcode: "",
      gmail: "",
      portfolio: "",
    },
  });

  // Fetch logged-in user
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle input changes
  const handleChange = (section, field, value, index = null) => {
    if (section === "basicInfo") {
      if (field === "work" || field === "education") {
        const arr = [...user.basicInfo[field]];
        arr[index] = value;
        setUser((prev) => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, [field]: arr },
        }));
      } else if (field === "location") {
        setUser((prev) => ({
          ...prev,
          basicInfo: {
            ...prev.basicInfo,
            location: { ...prev.basicInfo.location, ...value },
          },
        }));
      } else {
        setUser((prev) => ({
          ...prev,
          basicInfo: { ...prev.basicInfo, [field]: value },
        }));
      }
    } else if (section === "account") {
      setUser((prev) => ({
        ...prev,
        account: { ...prev.account, [field]: value },
      }));
    } else {
      setUser((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Add/remove work or education
  const addEntry = (field) => {
  if (user.basicInfo[field].length >= 4) return;

  setUser((prev) => ({
    ...prev,
    basicInfo: {
      ...prev.basicInfo,
      [field]: [...prev.basicInfo[field], ""],
    },
  }));
};

// Remove work or education
const removeEntry = (field, index) => {
  setUser((prev) => ({
    ...prev,
    basicInfo: {
      ...prev.basicInfo,
      [field]: prev.basicInfo[field].filter((_, i) => i !== index),
    },
  }));
};

  // Save profile
  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basicInfo: user.basicInfo,
          account: user.account,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      setSuccess("Profile updated successfully!");
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Profile Info
      </h2>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
      )}

      {/* Username & Bio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            value={user.username}
            onChange={(e) => handleChange(null, "username", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <input
            value={user.bio}
            onChange={(e) => handleChange(null, "bio", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Basic Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              value={user.basicInfo.name}
              onChange={(e) =>
                handleChange("basicInfo", "name", e.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              value={user.basicInfo.gender}
              onChange={(e) =>
                handleChange("basicInfo", "gender", e.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Birthday
            </label>
            <input
              type="date"
              value={user.basicInfo.birthday?.split("T")[0] || ""}
              onChange={(e) =>
                handleChange("basicInfo", "birthday", e.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <input
              value={user.basicInfo.location.country}
              onChange={(e) =>
                handleChange("basicInfo", "location", { country: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State
            </label>
            <input
              value={user.basicInfo.location.state}
              onChange={(e) =>
                handleChange("basicInfo", "location", { state: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              value={user.basicInfo.location.city}
              onChange={(e) =>
                handleChange("basicInfo", "location", { city: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
            />
          </div>
        </div>

        {/* Work */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Work Experience (max 4)
          </label>
          {user.basicInfo.work.map((w, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={w}
                onChange={(e) => handleChange("basicInfo", "work", e.target.value, idx)}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
              />
              <button
                onClick={() => removeEntry("work", idx)}
                type="button"
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {user.basicInfo.work.length < 4 && (
            <button
              onClick={() => addEntry("work")}
              type="button"
              className="text-blue-500 hover:underline text-sm"
            >
              + Add Work
            </button>
          )}
        </div>

        {/* Education */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Education (max 4)
          </label>
          {user.basicInfo.education.map((e, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={e}
                onChange={(evt) => handleChange("basicInfo", "education", evt.target.value, idx)}
                className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
              />
              <button
                onClick={() => removeEntry("education", idx)}
                type="button"
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {user.basicInfo.education.length < 4 && (
            <button
              onClick={() => addEntry("education")}
              type="button"
              className="text-blue-500 hover:underline text-sm"
            >
              + Add Education
            </button>
          )}
        </div>
      </div>

      {/* Account Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Contact & Account Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(user.account).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                value={value}
                onChange={(e) => handleChange("account", key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-lg bg-black dark:bg-white py-2.5 text-sm font-medium text-white dark:text-black disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
