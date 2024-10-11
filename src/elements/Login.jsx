import { useState } from "react";
import { checkPeserta } from "../utils/fungsi.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { Dummy } from "./Dummy.jsx";

export function Login({ setCurrentUser, deadline }) {
  const [verifNIM, setVerifNim] = useState(""); //kalo onHange salah, ini ubah jadi false. buat bisa submit atau gak lihat ini sama isi input tidak kosong
  // const [verifUniv, setVerifUniv] = useState("");
  const [inputNIM, setInputNIM] = useState("");
  const [inputUniv, setInputUniv] = useState("");
  const [dummyActive, setDummyActive] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function loginHandle(e, inputNIM, inputUniv, setVerifNim) {
    e.preventDefault();

    // Validate the input format
    if (!/^[0-9-]+$/.test(inputNIM)) {
      setVerifNim("Harap masukan input sesuai format!");
      return; // Exit the function if the input is invalid
    }
    const nim = inputNIM.split("-").sort();
    // Check if the participant exists
    const peserta = await checkPeserta(inputUniv, nim);

    if (peserta) {
      console.log("Login successful", peserta);
      setCurrentUser(peserta);
      login(peserta);
      const currentTime = new Date().toLocaleTimeString("id-ID", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      // const timeStringDeadline = new Date(deadline); // This will give you the time in HH:MM:SS AM/PM format
      // console.log(currentTime < timeStringDeadline);

      if (peserta.file.uploadedAt != "") {
        //ke halaman penilaian

        navigate("/penilaian"); // hapus nanti
        // if (currentTime >= deadline) {
        //   console.log("masuk ke nilai");
        //   navigate("/penilaian");
        // } else {
        //   console.log("masuk ke dummy nunggu waktu");
        //   setDummyActive("sebelum deadline");
        // }
      } else {
        navigate("/pengumpulan");
        // if (currentTime < deadline) {
        //   console.log("masuk ke pengumpulan");
        //   navigate("/pengumpulan");
        // } else {
        //   console.log("masuk ke dummy telat");
        //   setDummyActive("setelah deadline");
        // }
      }
      // Proceed with the login or other actions, like redirecting or setting state
    } else {
      setVerifNim(
        "Data tidak ditemukan, harap periksa kembali NIM dan Universitas."
      );
    }

    // You can add further actions here, such as sending a POST request
  }

  if (dummyActive != "") {
    return <Dummy context={dummyActive} deadline={deadline} />;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className=" bg-white p-16 px-24 border border-gray-300 shadow-lg flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <span className="text-lg font-semibold">*****</span>
          </div>

          {/* Input fields */}
          <form
            onSubmit={(e) => loginHandle(e, inputNIM, inputUniv, setVerifNim)}
            className="flex flex-col"
          >
            <div className="flex flex-col max-h-max mb-4">
              <div className=" flex items-end gap-5">
                <label className="block text-sm font-medium text-gray-700 w-24">
                  NIM
                </label>
                <input
                  type="text"
                  onChange={(e) => setInputNIM(e.target.value)}
                  className="w-full border-b-2 border-black focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col max-h-max mb-4">
              <div className="flex items-end gap-5">
                <label className="block text-sm font-medium text-gray-700 w-24">
                  Universitas
                </label>
                <input
                  type="text"
                  onChange={(e) => setInputUniv(e.target.value)}
                  className="w-full border-b-2 border-black focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <span className=" text-xs text-red-700 h-3">{verifNIM}</span>

            {/* Login button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
