import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPeserta,
  checkPeserta,
  updatePesertaFile,
  getEvaluatedTeams,
  uploadFile,
} from "../utils/fungsi.jsx";
import { Dummy } from "./Dummy.jsx";
import { useEffect } from "react";

export function Submit({ currentUser }) {
  const [data, setData] = useState(null);
  const [isTwbx, setIsTwbx] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("data: ");
    if (data != null) {
      if (data[0]?.type == "application/twbx") {
        setIsTwbx(true);
      } else {
        setIsTwbx(false);
      }
    }
  }, [data]);

  async function submitHandle(e) {
    e.preventDefault();
    setLoading(true);

    // Check if there is a file to upload
    if (data && data.length > 0 && isTwbx) {
      const file = data[0]; // Get the first file from the FileList

      // Upload the file to Firebase Storage
      const fileUrl = await uploadFile(file); // Call your upload function
      console.log("File uploaded at:", fileUrl); // You can store this URL as needed

      try {
        console.log("cek ", currentUser.teamId, fileUrl, data[0].name);

        const updateData = await updatePesertaFile(
          currentUser.id,
          fileUrl,
          data[0].name
        );
        if (updateData) {
          navigate("/pengumpulan/sukses", { replace: true });
        }
      } catch {
        console.log("error");
      } finally {
        setLoading(false);
      }
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    // Add visual feedback like changing the background color of the drop zone
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    setData(files);
    if (files.length > 0) {
      console.log(files); // Log the dropped file
      // You can further process the file here, e.g., set it to state or upload it.
    }
  }

  function handleFileChange(e) {
    const files = e.target.files;
    setData(files);
    if (files.length > 0) {
      console.log(files); // Log the selected file
    }
  }

  if (loading) {
    return <Dummy context={"loading"} />;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-16 px-24 border w-2/5 border-gray-300 shadow-lg flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-6">Attachment</h2>
            <span className="text-lg font-semibold">*****</span>
          </div>

          {/* Input fields */}
          <form onSubmit={submitHandle} className="flex flex-col">
            <div
              className="flex flex-col max-h-max items-center py-10 w-full border-2 rounded-lg border-slate-900 focus:outline-none focus:border-blue-500"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                onChange={handleFileChange}
                type="file"
                accept=".twbx"
                ref={fileInputRef}
                className="w-full border-none hidden"
              />
              <p className="text-sm text-gray-500 ">
                Drag & Drop files here or{" "}
                <span
                  className="text-blue-700 cursor-pointer hover:text-blue-500"
                  onClick={() => fileInputRef.current.click()}
                >
                  click to upload
                </span>
              </p>
            </div>

            <span className={`text-xs mt-1 h-3 ${!isTwbx && "text-red-600"}`}>
              {data
                ? isTwbx
                  ? data[0].name
                  : "file harus dalam format .twbx"
                : ""}
            </span>

            {/* Submit button */}
            <div className="mt-8">
              <button
                type="submit"
                className={`w-full  py-2 px-4 rounded-md ${
                  isTwbx
                    ? "bg-gray-300 text-black hover:bg-gray-400 transition"
                    : "bg-gray-100 text-gray-500 pointer-events-none"
                } `}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
