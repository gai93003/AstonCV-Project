import { useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [education, setEducation] = useState("");
  const [profile, setProfile] = useState("");
  const [keyprogramming, setKeyprogramming] = useState("");
  const [urllinks, setUrllinks] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("error");


  const updateCV = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setStatusType("error");
      setStatusMessage("You need to log in before saving CV changes.");
      return;
    }

    setStatusMessage("");

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

      setStatusType("success");
      setStatusMessage("Your CV has been updated successfully.");
    }
    catch (err) {
      setStatusType("error");
      setStatusMessage(
        err.response?.data?.message ||
          "We couldn't update your CV. Please check your input and ensure the API server is online."
      );
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

      {statusMessage && (
        <p
          className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
            statusType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </section>
  );
}

export default Dashboard;