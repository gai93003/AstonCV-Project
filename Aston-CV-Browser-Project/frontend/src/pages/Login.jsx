import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both your email and password to sign in.");
      return;
    }

    setErrorMessage("");

    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    }
    catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "We couldn't log you in. Check your credentials and make sure the server is available."
      );
    }
  };

  return (
    <section className="mx-auto w-full max-w-md animate-fade-up">
      <div className="ui-card Container">
        <p className="text-xs uppercase tracking-[0.25em] text-teal-700">Welcome Back</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Log In</h1>
        <p className="mt-2 text-sm text-slate-600">Access your dashboard and update your CV details.</p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="ui-input"
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="ui-input"
          />

          <button onClick={login} className="ui-btn-primary w-full">
            Login
          </button>

          {errorMessage && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Login;