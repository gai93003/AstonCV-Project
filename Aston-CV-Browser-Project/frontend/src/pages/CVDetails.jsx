import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const CVDetails = () => {
  const { id } = useParams();
  const [cv, setCv] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/cv/${id}`);
        setCv(res.data);
      } catch (fetchError) {
        setError("Could not load CV details.");
      }
    };

    fetchDetails();
  }, [id]);

  if (error) return <p className="frosted Container rounded-2xl p-6 text-rose-700 animate-fade-up">{error}</p>;
  if (!cv) return <p className="frosted Container rounded-2xl p-6 text-slate-600 animate-fade-up">Loading CV details...</p>;

  return (
    <section className="ui-card Container animate-fade-up">
      <p className="text-xs uppercase tracking-[0.25em] text-teal-700">CV Details</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{cv.name}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="Container rounded-2xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
          <p className="mt-2 text-sm text-slate-900">{cv.email}</p>
        </div>
        <div className="Container rounded-2xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Key Programming Language</p>
          <p className="mt-2 text-sm text-slate-900">{cv.keyprogramming || "Not provided"}</p>
        </div>
        <div className="Container rounded-2xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Education</p>
          <p className="mt-2 text-sm text-slate-900">{cv.education || "Not provided"}</p>
        </div>
        <div className="Container rounded-2xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Profile</p>
          <p className="mt-2 text-sm text-slate-900">{cv.profile || "Not provided"}</p>
        </div>
      </div>

      <div className="Container mt-4 rounded-2xl border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">URL Links</p>
        <p className="mt-2 text-sm text-slate-900">
          {cv.urllinks ? (
            <a
              href={cv.urllinks}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:text-teal-600"
            >
              {cv.urllinks}
            </a>
          ) : (
            "Not provided"
          )}
        </p>
      </div>
    </section>
  );
};

export default CVDetails;
