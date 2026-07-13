import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { addUser } from "../redux/slices/userSlice";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const body = isSignup
        ? { firstName, lastName, emailId, password }
        : { emailId, password };

      const res = await api.post(endpoint, body);
      dispatch(addUser(res.data.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="dc-card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <div className="font-display text-2xl font-semibold flex items-center justify-center gap-2">
            <span style={{ color: "var(--dc-accent)" }}>&gt;_</span> DevConnect
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--dc-text-muted)" }}>
            {isSignup ? "Create your developer profile" : "Welcome back"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isSignup && (
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                className="input w-1/2"
                style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
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
          )}
          <input
            type="email"
            placeholder="Email"
            className="input w-full"
            style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input w-full"
            style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <p className="text-xs" style={{ color: "var(--dc-text-muted)" }}>
              At least 8 characters, with uppercase, lowercase and a number.
            </p>
          )}

          {error && (
            <p className="text-sm" style={{ color: "var(--dc-danger)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn mt-2 border-none"
            style={{ background: "var(--dc-accent)", color: "#06170d" }}
          >
            {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: "var(--dc-text-muted)" }}>
          {isSignup ? "Already have an account?" : "New to DevConnect?"}{" "}
          <button
            className="underline"
            style={{ color: "var(--dc-secondary)" }}
            onClick={() => {
              setError("");
              setIsSignup((v) => !v);
            }}
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
