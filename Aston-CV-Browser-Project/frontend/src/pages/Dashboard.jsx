import { useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [education, setEducation] = useState("");
  const [profile, setProfile] = useState("");
  const [keyprogramming, setKeyprogramming] = useState("");
  const [urllinks, setUrllinks] = useState("");


  const updateCV = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await API.post(
        "/cv/update",
        { education, profile, keyprogramming, urllinks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("CV updated!");
    }
    catch (err) {
      alert(err.response?.data?.message || "Error updating CV");
    }
  };

  return (
    <section className="ui-card Container animate-fade-up">
      <p className="text-xs uppercase tracking-[0.25em] text-teal-700">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Update Your CV</h1>
      <p className="mt-2 text-sm text-slate-600">Keep your profile current so recruiters can find the right fit.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          className="ui-input"
        />

        <input
          placeholder="Key Programming Language"
          value={keyprogramming}
          onChange={(e) => setKeyprogramming(e.target.value)}
          className="ui-input"
        />

        <input
          placeholder="Profile Summary"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="ui-input sm:col-span-2"
        />

        <input
          placeholder="Portfolio / GitHub / LinkedIn URL"
          value={urllinks}
          onChange={(e) => setUrllinks(e.target.value)}
          className="ui-input sm:col-span-2"
        />
      </div>

      <button onClick={updateCV} className="ui-btn-primary mt-6 px-6">
        Save CV
      </button>
    </section>
  );
}

export default Dashboard;