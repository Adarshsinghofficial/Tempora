// src/components/DownloadPage.jsx
import { useState } from "react";
import axios from "axios";

export default function DownloadPage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  const handleDownload = async (e) => {
    e.preventDefault();
    setStatus("");
    const normalized = code.trim();

    try {
      const res = await axios.get(`/file/${normalized}`, { responseType: "blob" });
      const disp = res.headers["content-disposition"] || "";
      const match = disp.match(/filename="?(.+)"?/) || [];
      const filename = match[1] || "download";
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setStatus("✓ Downloaded successfully!");
    } catch (err) {
      if (err.response?.status === 410) setStatus("⚠️ File expired");
      else if (err.response?.status === 404) setStatus("⚠️ Invalid code");
      else setStatus("⚠️ Download error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          🔽 Retrieve Your File
        </h2>

        <form onSubmit={handleDownload} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 4-character code"
            maxLength={4}
            required
            className="
              w-full border border-gray-300 rounded-lg
              px-4 py-2 text-center
              focus:outline-none focus:ring-2 focus:ring-blue-200
            "
          />

          <button
            type="submit"
            disabled={code.trim().length < 4}
            className={`
              w-full py-2 rounded-lg font-medium transition
              ${
                code.trim().length === 4
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            Download
          </button>
        </form>

        {status && (
          <p
            className={`
              mt-4 text-center font-medium
              ${status.startsWith("✓") ? "text-green-600" : "text-red-600"}
            `}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
