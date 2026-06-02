import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

if (error) {
  setMessage(
    "Incorrect email or password."
  );
  return;
}

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", data.user.id)
          .single();

        if (profile?.status === "disabled") {
          await supabase.auth.signOut();

          setMessage(
            "Your account has been disabled. Please contact support."
          );

          return;
        }

        const {
          data: adminData,
          error: adminError,
        } = await supabase
          .from("admins")
          .select("*")
          .eq("id", data.user.id)
          .single();

        console.log("Admin Check:", adminData);
        console.log("Admin Error:", adminError);

        setMessage(
          "Login successful! Redirecting..."
        );

        setTimeout(() => {
          if (adminData) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
const handleForgotPassword =
  async () => {
    if (!email) {
      setMessage(
        "Please enter your email first."
      );
      return;
    }

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              window.location.origin +
              "/reset-password",
          }
        );

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Password reset link sent to your email."
        );
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 text-white p-10">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">
            Trust
            <span className="text-green-400">
              FX
            </span>
          </h1>

          <h2 className="text-4xl font-bold mb-4">
            Welcome Back
          </h2>

          <p className="text-xl text-slate-300 max-w-md">
            Access your trading dashboard and
            manage your accounts securely.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
          <h2 className="text-4xl font-bold text-center mb-2">
            Sign In
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Login to your TrustFX account
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border rounded-xl p-4"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full border rounded-xl p-4"
                required
              />
            </div>

            <div className="text-right">
              <button
  type="button"
  onClick={handleForgotPassword}
  className="text-blue-700 text-sm hover:underline"
>
  Forgot Password?
</button>
            </div>

            {message && (
              <div className="text-center text-sm text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="text-blue-700 font-semibold"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}