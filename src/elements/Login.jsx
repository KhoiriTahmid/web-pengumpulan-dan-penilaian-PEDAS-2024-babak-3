import { useState } from "react";
import { checkPeserta, login as loginUser } from "../utils/fungsi.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { Dummy } from "./Dummy.jsx";

export function Login({ setCurrentUser, deadline, deadlinePlusOne }) {
  const [verifEmail, setVerifEmail] = useState(""); //kalo onHange salah, ini ubah jadi false. buat bisa submit atau gak lihat ini sama isi input tidak kosong
  const [verifNoHp, setVerifNoHp] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputNoHp, setInputNoHp] = useState("");
  const [dummyActive, setDummyActive] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userGagalLogin, setUserGagalLogin] = useState(""); //email, noHp, type (belum, telat, selesai), pesan

  const navigate = useNavigate();
  const { login } = useAuth();

  async function loginHandle(e, inputEmail, inputNoHp) {
    e.preventDefault();

    // Validate the input format
    if (!/^[\w-.]+@[a-zA-Z_]+(\.[a-zA-Z]{2,})+$/.test(inputEmail)) {
      setVerifEmail("❌ Harap masukan Email sesuai format!");
      return; // Exit the function if the input is invalid
    }
    if (!/^628[1-9][0-9]{6,12}$/.test(inputNoHp)) {
      setVerifNoHp("❌ Harap masukan No HP sesuai format!");
      return; // Exit the function if the input is invalid
    }
    const email = inputEmail.trim();
    // Check if the participant exists

    if (userGagalLogin?.email == email && userGagalLogin?.noHp == inputNoHp) {
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
      //peserta = await checkPeserta(inputNoHp, email);
      peserta = await loginUser(email, inputNoHp);
    } finally {
      setLoading(false);
    }

    if (peserta == "kosong") {
      setVerifEmail(
        "❌ Data tidak ditemukan, harap periksa kembali email dan nomor hp."
      );
    } else if (peserta.hasOwnProperty("error")) {
      setIsError(peserta.error);
    } else {
      console.log("Data ditemukan ", peserta);

      if (peserta.email == "atmin@foo.com") {
        setCurrentUser(peserta);
        login(peserta);
        navigate("/admin");
        return;
      }

      if (peserta?.udahNilai) {
        console.log("masuk ke dummy udah semua");
        setDummyActive("selesai deadline");
        setUserGagalLogin({
          email: email,
          noHp: inputNoHp,
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
        if (currentTime >= deadlinePlusOne) {
          console.log("masuk ke nilai");
          setCurrentUser(peserta);
          login(peserta);
          navigate("/penilaian");
        } else {
          console.log("masuk ke dummy nunggu waktu");
          setDummyActive("sebelum deadline");
          setUserGagalLogin({
            email: email,
            noHp: inputNoHp,
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
            email: email,
            noHp: inputNoHp,
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
        deadline={
          dummyActive == "sebelum deadline" ? deadlinePlusOne : deadline
        }
      />
    );
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
        <div className=" bg-white p-16 px-24 border border-slate-900  flex flex-col gap-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-semibold">Selamat Datang </span>
            <span className="text-3xl font-semibold">🙌</span>
          </div>

          {/* Input fields */}
          <form
            onSubmit={(e) => loginHandle(e, inputEmail, inputNoHp)}
            className="flex flex-col"
          >
            <div className="flex flex-col max-h-max mb-4">
              <div className=" flex justify-between items-end gap-5">
                <label className="block text-sm  w-30 ">Email ketua</label>
                <input
                  type="email"
                  maxLength={100}
                  defaultValue={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value.trim());
                    verifEmail.length && setVerifEmail("");
                  }}
                  className={`text-sm border-b-[1px] w-60 text-gray-700  focus:outline-none  border-black focus:border-blue-500`}
                />
              </div>
            </div>

            <div className="flex flex-col max-h-max mb-4">
              <div className=" flex justify-between items-end gap-5">
                <label className="block text-sm   w-30">Nomor hp ketua</label>
                <div className="gap-1 text-gray-700   flex w-60 ">
                  <span className="border-black border-b-[1px] text-sm pr-0.5">
                    +62
                  </span>
                  <input
                    type="number"
                    maxLength={100}
                    defaultValue={inputNoHp.slice(2)}
                    onChange={(e) => {
                      setInputNoHp("62" + e.target.value.trim());
                      verifNoHp.length && setVerifNoHp("");
                    }}
                    className="w-full text-sm focus:outline-none border-black focus:border-blue-500 border-b-[1px]"
                  />
                </div>
              </div>
            </div>

            <span className=" font-medium  text-xs text-red-700 h-3">
              {verifEmail || verifNoHp}
            </span>

            {/* Login button */}
            <div className="mt-8 ">
              <button
                type="submit"
                className={`w-full  text-black py-2 px-4 border border-slate-900 hover:bg-gray-300 transition ${
                  (inputEmail == "" || inputNoHp == "") &&
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
