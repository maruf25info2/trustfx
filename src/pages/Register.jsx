import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] =
  useState("+880");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
    const [showPassword, setShowPassword] =
  useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

setMessage("");

const { data: existingUser } =
  await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .maybeSingle();

if (existingUser) {
  setMessage(
    "An account with this email already exists."
  );
  return;
}

if (!fullName || !email || !password) {
      setMessage(
        "Please fill all required fields."
      );
      return;
    }
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

if (!passwordRegex.test(password)) {
  setMessage(
    "Password must be at least 8 characters and contain uppercase, lowercase and a number."
  );
  return;
}
if (
  phone.length < 8 ||
  phone.length > 15
) {
  setMessage(
    "Please enter a valid phone number."
  );
  return;
}
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone:
  countryCode + phone,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data?.user) {
        const clientId = Math.floor(
          1000000000 +
            Math.random() * 9000000000
        );

        const {
          error: profileError,
        } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              client_id: clientId,
              full_name: fullName,
              phone:
  countryCode + phone,
            },
          ]);

        if (profileError) {
          console.log(profileError);
        }
      }

      setMessage(
        "Registration successful! Please login now."
      );

      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
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
            Start Trading Today
          </h2>

          <p className="text-xl text-slate-300 max-w-md">
            Create your TrustFX account and
            access global financial markets.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
          <h2 className="text-4xl font-bold text-center mb-2">
            Register
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Create your TrustFX account
          </p>

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            />

<div className="flex gap-2">
  <select
    value={countryCode}
    onChange={(e) =>
      setCountryCode(
        e.target.value
      )
    }
    className="border rounded-xl px-3"
  >
    <option value="+880">
      🇧🇩 +880
    </option>

    <option value="+91">
      🇮🇳 +91
    </option>

    <option value="+1">
      🇺🇸 +1
    </option>

    <option value="+44">
      🇬🇧 +44
    </option>

    <option value="+974">
      🇶🇦 +974
    </option>

    <option value="+971">
      🇦🇪 +971
    </option>
  </select>

  <input
    type="tel"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) =>
      setPhone(
        e.target.value.replace(
          /\D/g,
          ""
        )
      )
    }
    className="w-full border rounded-xl p-4"
  />
</div>

<div className="relative">
  <input
    type={
      showPassword
        ? "text"
        : "password"
    }
    placeholder="Password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    className="w-full border rounded-xl p-4 pr-12"
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(!showPassword)
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}
  </button>
</div>
<p className="text-xs text-gray-500 mt-2">
  Password must contain at least 8 characters,
  one uppercase letter, one lowercase letter
  and one number.
</p>
            <div className="relative">
  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
    className="w-full border rounded-xl p-4 pr-12"
  />

  <button
    type="button"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
  >
    {showConfirmPassword ? (
      <EyeOff size={20} />
    ) : (
      <Eye size={20} />
    )}
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
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="text-blue-700 font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}