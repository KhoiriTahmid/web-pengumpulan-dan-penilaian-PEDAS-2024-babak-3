import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  addPeserta,
  checkPeserta,
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
  const [isError, setIsError] = useState(false);
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

    // Check if there is a file to upload
    if (data && data.length > 0 && isTwbx) {
      const file = data[0]; // Get the first file from the FileList
      // console.log(file);
      const uniqueName = `${Date.now()}_${
        currentUser.teamId[0] + currentUser.teamId[2] + currentUser.teamId[4]
      }_${file.name[1] + file.name[2] + file.name[3]}`;

      // const newFile = new File([file], uniqueName, { type: file.type });

      let blob = file.slice(0, file.size, "application/twbx");
      const newFile = new File([blob], `${uniqueName}.twbx`, {
        type: "application/twbx",
      });

      // Upload the file to Firebase Storage

      try {
        setLoading(true);
        const result = await uploadFile(newFile, currentUser.id, data[0].name); // Call your upload function
        console.log("File uploaded at:", result); // You can store this URL as needed

        if (result?.hasOwnProperty("error")) {
          setIsError(result?.error);
          return;
        }

        navigate("/pengumpulan/sukses", { replace: true });
      } catch (error) {
        setIsError(error);
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

  if (isError) {
    return <Dummy context={"error" + isError} setPopup={setIsError} />;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className=" p-16 px-24 border w-2/5 border-gray-900  flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold ">Pengumpulan Dashboard 🗃️</h2>
          </div>

          {/* Input fields */}
          <form onSubmit={submitHandle} className="flex flex-col">
            <div
              className="flex flex-col max-h-max items-center py-10 w-full border  border-slate-900 focus:outline-none focus:border-blue-500"
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
              <div className="text-3xl mb-5">📂</div>
              <p className={`text-sm text-gray-500 px-7 text-center`}>
                Drag & Drop file di sini atau{" "}
                <span
                  className="text-blue-700  cursor-pointer hover:text-blue-300 hover:"
                  onClick={() => fileInputRef.current.click()}
                >
                  klik untuk upload
                </span>
              </p>
            </div>

            <span
              className={`text-xs  mt-1 h-3 text-wrap font-medium  ${
                !isTwbx ? "text-red-600 " : "text-slate-600"
              }`}
            >
              {data
                ? isTwbx
                  ? `📄 ${data[0]?.name} ✅`
                  : "❌ file harus dalam format .twbx"
                : ""}
            </span>

            {/* Submit button */}
            <div className="mt-8">
              <button
                type="submit"
                className={`w-full  py-2 px-4 border border-slate-900  ${
                  isTwbx
                    ? " text-black hover:bg-gray-200"
                    : " line-through pointer-events-none opacity-70"
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
