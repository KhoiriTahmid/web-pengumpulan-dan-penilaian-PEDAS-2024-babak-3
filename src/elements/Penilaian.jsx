import { useState, useEffect } from "react";
import InfoIcon from "../assets/info.jsx";
import { addPenilaian, getEvaluatedTeams } from "../utils/fungsi.jsx";
import { useNavigate } from "react-router-dom";
import { Dummy } from "./Dummy.jsx";

export function Penilaian({ evaluatedTeams, teamId, id }) {
  // bigData
  const [dataInputNilai, setDataInputNilai] = useState(
    evaluatedTeams.map((e) => ({
      teamId: e,
      nilai: {
        estetika: "",
        kejelasan: "",
        kreativitas: "",
      },
      sudah: false,
    }))
  );

  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [popUpInfo, setPopUpInfo] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEvaluatedTeams(evaluatedTeams);
        setLinks(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [evaluatedTeams]);

  useEffect(() => {
    console.log(dataInputNilai);
  }, [dataInputNilai]);

  if (loading) {
    return <Dummy context={"loading"} />;
  }

  function updateDataInputNilai(
    estetika,
    kejelasan,
    kreativitas,
    sudah,
    index
  ) {
    console.log(estetika);
    setDataInputNilai((prev) => {
      const newValueInput = [...prev];
      newValueInput[index] = {
        teamId: newValueInput[index].teamId,
        nilai: {
          estetika,
          kejelasan,
          kreativitas,
        },
        sudah,
      };
      return newValueInput;
    });
  }

  async function handleSubmit() {
    const invalidItems = dataInputNilai.filter((item) => {
      const { teamId, nilai, sudah } = item;
      // Check if teamId is undefined, or any nilai is 0, or sudah is false
      return (
        teamId === undefined ||
        nilai.estetika == "" ||
        nilai.kejelasan == "" ||
        nilai.kreativitas == "" ||
        sudah === false
      );
    });

    if (invalidItems.length > 0) {
      console.error("Found invalid items in dataInputNilai:", invalidItems);
      return false;
    }
    console.log("All items in dataInputNilai are valid.", dataInputNilai);
    const akhir = await addPenilaian(id, teamId, dataInputNilai);
    if (akhir) {
      navigate("/penilaian/sukses", { replace: true });
    }
  }

  if (popUpInfo) {
    return (
      <div className="bg-white min-h-screen flex justify-center items-center">
        <div className="bg-white p-6  w-fit px-28 py-10 md:mx-auto flex flex-col justify-center items-center gap-4 ">
          <div className=" text-6xl mb-5">👋</div>
          <div className="text-center flex flex-col items-center">
            <h3 className="md:text-2xl mb-5 text-base text-gray-900 font-semibold text-center">
              Selamat datang di halaman penilaian
            </h3>
            <p className="text-gray-600 mt-3 mb-2 font-medium">
              Untuk menilai karya tim lain, kamu perlu:
            </p>
            <div className="flex flex-col items-start  gap-1 text-sm py-3 font-medium">
              <div className="flex gap-3 text-gray-600">
                <p className="w-3">1.</p>
                <p>Mengunduh file dashboard tiap tim</p>
              </div>
              <div className="flex gap-3 text-gray-600">
                <p className="w-3">2.</p>
                <p>Membuka file tersebut di Tableau</p>
              </div>
              <div className="flex gap-3 text-gray-600">
                <p className="w-3">3.</p>
                <p>Mengisi form nilai tiap tim</p>
              </div>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <InfoIcon />
              <span className="text-red-600 text-xs font-medium">
                Rentang nilai harus diantara 0.0 - 10.0
              </span>
            </div>
            <div
              onClick={() => setPopUpInfo(false)}
              className="mt-8 px-12 border cursor-pointer border-slate-900 hover:bg-gray-200   font-semibold py-3"
            >
              Paham
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-10 min-h-screen items-center">
      <div className="flex items-center justify-center min-fit  gap-4 ">
        {dataInputNilai.map(
          (e, i) =>
            links[i] && (
              <CardNilai
                key={i}
                downloadLink={links[i]}
                dataInputNilai={e}
                updateDataInputNilai={updateDataInputNilai}
                index={i}
              />
            )
        )}
      </div>

      <div
        onClick={handleSubmit}
        className={`py-2 w-[92%] text-center bg-white border border-slate-900 hover:shadow-xl shadow-md cursor-pointer ${
          dataInputNilai.some((e) => e.sudah == false) &&
          "pointer-events-none opacity-70 line-through shadow-sm"
        }`}
      >
        Submit
      </div>
    </div>
  );
}

function CardNilai({
  dataInputNilai,
  updateDataInputNilai,
  index,
  downloadLink,
}) {
  const [isError, setIsError] = useState([0, 0, 0]); // 0 or 1
  const [valueInput, setValueInput] = useState([0, 0, 0]); // 0-10

  useEffect(() => {
    updateDataInputNilai(
      ...valueInput,
      !isError.includes(1) && !valueInput.includes(0),
      (index = index)
    );
  }, [isError]);

  const handleInputChange = (value, i) => {
    const isValid = /^\d+(\.\d+)?$/.test(value) && parseFloat(value) <= 10;
    setValueInput((prev) => {
      const newValueInput = [...prev];
      newValueInput[i] = value;
      return newValueInput;
    });
    setIsError((prev) => {
      const newIsError = [...prev];
      newIsError[i] = !isValid ? 1 : 0;
      return newIsError;
    });
  };

  const handleDownload = (e) => {
    if (!downloadLink) {
      e.preventDefault(); // Prevent the default action if the link is empty
      alert(
        "tim tersebut belum submit dashboard. (hanya terjadi saat development, karena saat lomba dipastikan tim untuk mengumpulkan tepat waktu)"
      );
      return;
    }

    // If the link is available, proceed with the download
    window.open(downloadLink, "_blank"); // This opens the link in a new tab
  };

  return (
    <>
      <div className="bg-white w-fit border border-gray-900 hover:shadow-xl flex flex-col gap-4 active:border-blue-500">
        <div className="flex flex-col mx-8 mt-10">
          <span className="text-lg font-semibold">*****</span>
          <h2 className="text-xl font-bold mb-2">Team {index + 1}</h2>
        </div>

        <div>
          <a
            className="mx-8 font-semibold mb-2 text-sm underline cursor-pointer hover:text-slate-500"
            onClick={handleDownload}
          >
            Unduh File
          </a>
        </div>

        {/* Input fields */}
        <div className="flex flex-col gap-3">
          {Object.keys(dataInputNilai.nilai).map((key, i) => (
            <div key={i} className="flex flex-col max-h-max text-gray-600 mx-8">
              <div className="flex items-end justify-between gap-8 text-sm ">
                <label className="block w-24 ">
                  {key[0].toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  maxLength="4"
                  onChange={(e) => handleInputChange(e.target.value, i)}
                  className={`w-5 border-b-[1.5px] ${
                    isError[i]
                      ? "border-red-600"
                      : "border-slate-500 focus:border-blue-500"
                  } focus:outline-none`}
                />
              </div>
            </div>
          ))}

          {/* Status message */}
          <div className="mt-6 w-[85%] mx-auto border border-b-0 border-slate-900 font-normal text-black text-2xl py-5 px-4 text-center">
            {!isError.includes(1) && !valueInput.includes(0) ? "👍" : "👎"}
          </div>
        </div>
      </div>
    </>
  );
}
