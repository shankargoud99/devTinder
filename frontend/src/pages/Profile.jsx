import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { updateUser } from "../redux/slices/userSlice";
import UserCard from "../components/UserCard";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skillsInput, setSkillsInput] = useState((user?.skills || []).join(", "));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const previewUser = {
    ...user,
    firstName,
    lastName,
    age: age === "" ? undefined : Number(age),
    gender,
    about,
    skills: skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  const handleSave = async () => {
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const body = {
        firstName,
        lastName,
        about,
        skills: previewUser.skills,
      };
      if (age !== "") body.age = Number(age);
      if (gender) body.gender = gender;

      const res = await api.patch("/profile/edit", body);
      dispatch(updateUser(res.data.data));
      setMessage("Profile saved");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await api.post("/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser(res.data.data));
    } catch (err) {
      setError(err?.response?.data?.message || "Could not upload photo");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8 py-4">
      <div className="dc-card p-6">
        <h1 className="font-display text-xl font-semibold mb-4">Edit profile</h1>

        <div className="flex items-center gap-4 mb-5">
          <div className="avatar">
            <div className="w-16 rounded-full">
              <img src={user.photoUrl} alt={user.firstName} />
            </div>
          </div>
          <label
            className="btn btn-sm border cursor-pointer"
            style={{ background: "transparent", borderColor: "var(--dc-border)", color: "var(--dc-text-muted)" }}
          >
            {uploading ? "Uploading..." : "Change photo"}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First name"
              className="input w-1/2"
              style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last name"
              className="input w-1/2"
              style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Age"
              min={18}
              max={100}
              className="input w-1/2"
              style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <select
              className="select w-1/2"
              style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <textarea
            placeholder="About you"
            rows={3}
            maxLength={500}
            className="textarea w-full"
            style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <input
            type="text"
            placeholder="Skills, comma-separated (e.g. React, Node.js, Go)"
            className="input w-full"
            style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          />

          {error && (
            <p className="text-sm" style={{ color: "var(--dc-danger)" }}>
              {error}
            </p>
          )}
          {message && (
            <p className="text-sm" style={{ color: "var(--dc-accent)" }}>
              {message}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn mt-2 border-none self-start px-6"
            style={{ background: "var(--dc-accent)", color: "#06170d" }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide mb-3" style={{ color: "var(--dc-text-muted)" }}>
          Live preview
        </p>
        <UserCard user={previewUser} />
      </div>
    </div>
  );
};

export default Profile;
