import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAdmin } from "../utils/isAdmin";

export default function ProtectedAdmin({
  children,
}) {
  const [loading, setLoading] =
    useState(true);

  const [admin, setAdmin] =
    useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const result = await isAdmin();

    setAdmin(result);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Checking Access...
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}