import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered successfully");
      navigate("/login");
    }
    catch (err) {
      alert(err.response?.data?.message || "Error registering");
    }
  };

  return (
    <section className="mx-auto w-full max-w-md animate-fade-up">
      <div className="ui-card Container">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-600">Join AstonCV</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">Register to publish and manage your programmer CV.</p>

        <div className="mt-6 space-y-4">
          <input
            type="text"
            value={name}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            className="ui-input focus:border-amber-300"
          />

          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="ui-input focus:border-amber-300"
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="ui-input focus:border-amber-300"
          />

          <button onClick={register} className="ui-btn-accent w-full">
            Register
          </button>
        </div>
      </div>
    </section>
  );
}


export default Register;