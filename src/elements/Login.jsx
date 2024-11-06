import { useState } from "react";
import { checkPeserta } from "../utils/fungsi.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { Dummy } from "./Dummy.jsx";
import logo from "../assets/logo.png";

export function Login({ setCurrentUser, deadline }) {
  const [verifNIM, setVerifNim] = useState(""); //kalo onHange salah, ini ubah jadi false. buat bisa submit atau gak lihat ini sama isi input tidak kosong
  // const [verifUniv, setVerifUniv] = useState("");
  const [inputNIM, setInputNIM] = useState("");
  const [inputUniv, setInputUniv] = useState("");
  const [dummyActive, setDummyActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userGagalLogin, setUserGagalLogin] = useState(""); //nim, univ, type (belum, telat, selesai), pesan

  const navigate = useNavigate();
  const { login } = useAuth();

  async function loginHandle(e, inputNIM, inputUniv, setVerifNim) {
    e.preventDefault();

    // Validate the input format
    if (!/^[0-9-]+$/.test(inputNIM)) {
      setVerifNim("❌ Harap masukan input sesuai format!");
      return; // Exit the function if the input is invalid
    }
    const nim = inputNIM.trim().split("-").sort();
    // Check if the participant exists

    if (
      userGagalLogin?.nim?.join("-") == nim.join("-") &&
      userGagalLogin?.univ == inputUniv
    ) {
      if (userGagalLogin?.type != "belum") {
        //telat, belum, sudah
        setDummyActive(userGagalLogin?.pesan);
        return;
      }
      if (
        new Date().toLocaleTimeString("id-ID", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) < deadline
      ) {
        setDummyActive(userGagalLogin?.pesan);
        return;
      }
    }

    setLoading(true);
    let peserta;
    try {
      peserta = await checkPeserta(inputUniv, nim);
    } finally {
      setLoading(false);
    }

    if (peserta == "kosong") {
      setVerifNim(
        "❌ Data tidak ditemukan, harap periksa kembali NIM dan Universitas."
      );
    } else if (peserta.hasOwnProperty("error")) {
      setIsError(peserta.error);
    } else {
      console.log("Data ditemukan ", peserta);
      if (peserta?.udahNilai) {
        console.log("masuk ke dummy udah semua");
        setDummyActive("selesai deadline");
        setUserGagalLogin({
          nim: nim,
          univ: inputUniv,
          type: "selesai",
          pesan: "selesai deadline",
        });
        return;
      }
      // setCurrentUser(peserta);
      // login(peserta);
      const currentTime = new Date().toLocaleTimeString("id-ID", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      if (peserta.file.uploadedAt != "") {
        if (currentTime >= deadline) {
          console.log("masuk ke nilai");
          setCurrentUser(peserta);
          login(peserta);
          navigate("/penilaian");
        } else {
          console.log("masuk ke dummy nunggu waktu");
          setDummyActive("sebelum deadline");
          setUserGagalLogin({
            nim: nim,
            univ: inputUniv,
            type: "belum",
            pesan: "sebelum deadline",
          });
        }
      } else {
        if (currentTime < deadline) {
          console.log("masuk ke pengumpulan");
          setCurrentUser(peserta);
          login(peserta);
          navigate("/pengumpulan");
        } else {
          setDummyActive("setelah deadline");
          setUserGagalLogin({
            nim: nim,
            univ: inputUniv,
            type: "telat",
            pesan: "setelah deadline",
          });
          console.log("masuk ke dummy telat");
        }
      }
      // Proceed with the login or other actions, like redirecting or setting state
    }

    // You can add further actions here, such as sending a POST request
  }

  if (dummyActive != "") {
    return (
      <Dummy
        setPopup={setDummyActive}
        context={dummyActive}
        deadline={deadline}
      />
    );
  }

  if (loading) {
    return <Dummy context={"loading"} />;
  }
  if (isError) {
    return <Dummy context={"error" + isError} />;
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className=" bg-white p-16 px-24 border border-slate-900  flex flex-col gap-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-semibold">Selamat Datang </span>
            <span className="text-3xl font-semibold">🙌</span>
          </div>

          {/* Input fields */}
          <form
            onSubmit={(e) => loginHandle(e, inputNIM, inputUniv, setVerifNim)}
            className="flex flex-col"
          >
            <div className="flex flex-col max-h-max mb-4">
              <div className=" flex items-end gap-5">
                <label className="block text-sm  w-24 ">NIM</label>
                <input
                  type="text"
                  maxLength={100}
                  defaultValue={inputNIM}
                  onChange={(e) => {
                    setInputNIM(e.target.value.trim().toLowerCase());
                    verifNIM.length && setVerifNim("");
                  }}
                  className="text-sm border-b-[1px] w-60 text-gray-700 border-black focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col max-h-max mb-4">
              <div className="flex items-end gap-5">
                <label className="block text-sm   w-24">Universitas</label>
                <input
                  type="text"
                  maxLength={100}
                  defaultValue={inputUniv}
                  onChange={(e) => {
                    setInputUniv(e.target.value.trim().toLowerCase());
                    verifNIM.length && setVerifNim("");
                  }}
                  className="w-60 text-sm border-b-[1px] text-gray-700 border-black focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <span className=" font-medium  text-xs text-red-700 h-3">
              {verifNIM}
            </span>

            {/* Login button */}
            <div className="mt-8 ">
              <button
                type="submit"
                className={`w-full  text-black py-2 px-4 border border-slate-900 hover:bg-gray-300 transition ${
                  (inputNIM == "" || inputUniv == "") &&
                  "line-through pointer-events-none opacity-70"
                }`}
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
