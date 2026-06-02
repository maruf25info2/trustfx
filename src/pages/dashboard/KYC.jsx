import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function KYC() {
  const [documentType, setDocumentType] = useState("NID");
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [kycStatus, setKycStatus] = useState("Not Submitted");

  useEffect(() => {
    loadKYC();
  }, []);

  const loadKYC = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("kyc_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setKycStatus(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentFile) {
      setMessage("Please select a document.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("USER:", user);
      console.log("USER ERROR:", userError);

      if (!user) {
        setMessage(
          "User session not found. Please logout and login again."
        );
        return;
      }

      const fileExt = documentFile.name
        .split(".")
        .pop();

      const fileName = `${Date.now()}.${fileExt}`;

      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("kyc-documents")
          .upload(filePath, documentFile);

      if (uploadError) {
        console.log(uploadError);
        setMessage(uploadError.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("kyc-documents")
        .getPublicUrl(filePath);

      console.log("PUBLIC URL:", publicUrl);

      const { data, error } = await supabase
        .from("kyc_documents")
        .insert([
          {
            user_id: user.id,
            document_type: documentType,
            document_url: publicUrl,
            status: "Pending",
          },
        ])
        .select();

      console.log("INSERT DATA:", data);
      console.log("INSERT ERROR:", error);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("KYC submitted successfully.");
      setKycStatus("Pending");
      setDocumentFile(null);

      loadKYC();
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        KYC Verification
      </h1>

      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="mb-6">
          <span className="font-semibold">
            Current Status:
          </span>{" "}
          {kycStatus}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 font-medium">
              Document Type
            </label>

            <select
              value={documentType}
              onChange={(e) =>
                setDocumentType(e.target.value)
              }
              className="w-full border rounded-xl p-4"
            >
              <option value="NID">
                National ID
              </option>

              <option value="Passport">
                Passport
              </option>

              <option value="Driving License">
                Driving License
              </option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Upload Document
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) =>
                setDocumentFile(
                  e.target.files?.[0] || null
                )
              }
              className="w-full border rounded-xl p-4"
            />
          </div>

          {message && (
            <div className="bg-slate-100 p-4 rounded-xl">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 text-white px-8 py-4 rounded-xl"
          >
            {loading
              ? "Uploading..."
              : "Submit KYC"}
          </button>
        </form>
      </div>
    </div>
  );
}