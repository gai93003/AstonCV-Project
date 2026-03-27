import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Home = () => {
  const [cvs, setCvs] = useState([]);
  const [keyword, setKeyword] = useState("");

  const normalizeCvs = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.cvs)) return payload.cvs;
    return [];
  };

  const fetchCVs = useCallback(async () => {
    try {
      const res = await API.get("/cv");
      setCvs(normalizeCvs(res.data));
    } catch (error) {
      console.error("Failed to fetch CVs", error);
      setCvs([]);
    }
  }, []);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  const search = async () => {
    try {
      const res = await API.get(`/cv/search?keyword=${encodeURIComponent(keyword)}`);
      setCvs(normalizeCvs(res.data));
    } catch (error) {
      console.error("Failed to search CVs", error);
      setCvs([]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="ui-card Container relative overflow-hidden" style={{ animationDelay: "80ms" }}>
        <p className="text-xs uppercase tracking-[0.25em] text-teal-700">Programmer Directory</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          Discover developer CVs and find the right profile in seconds.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          Browse public CVs, search by name or stack, and inspect full candidate details.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={keyword}
            placeholder="Search by name or key language"
            onChange={(e) => setKeyword(e.target.value)}
            className="ui-input"
          />
          <button
            onClick={search}
            className="ui-btn-primary"
          >
            Search
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cvs.map((cv, index) => (
          <article
            key={cv.id}
            className="frosted Container rounded-2xl p-5 transition hover:-translate-y-0.5 animate-fade-up"
            style={{ animationDelay: `${120 + index * 40}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-amber-600">Profile #{cv.id}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              <Link className="hover:text-teal-700" to={`/cv/${cv.id}`}>
                {cv.name}
              </Link>
            </h2>
            <p className="mt-3 text-sm text-slate-600">{cv.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-teal-700">
              {cv.keyprogramming || "No language listed"}
            </p>
          </article>
        ))}
      </section>

      {cvs.length === 0 && (
        <div className="frosted Container rounded-2xl p-8 text-center text-slate-600 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <p className="text-lg font-semibold text-slate-900">No CVs found</p>
          <p className="mt-2 text-sm">Try a different name or programming language keyword.</p>
        </div>
      )}
    </div>
  );
}

export default Home;