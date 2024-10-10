import { useState, useEffect } from "react";
import InfoIcon from "../assets/info.jsx";
import { addPenilaian, getEvaluatedTeams } from "../utils/fungsi.jsx";
import { useNavigate } from "react-router-dom";
import { Dummy } from "./Dummy.jsx";

export function Penilaian({ evaluatedTeams, teamId }) {
  // bigData
  const [dataInputNilai, setDataInputNilai] = useState(
    evaluatedTeams.map((e) => ({
      teamId: e,
      nilai: {
        estetika: -1,
        kejelasan: -1,
        kreativitas: -1,
      },
      sudah: false,
    }))
  );

  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
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

  if (loading) {
    return <Dummy context={"loading"} />;
  }

  function updateDataInputNilai(estetika, kejelasan, kreativitas, index) {
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
        sudah: true,
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
        nilai.estetika === -1 ||
        nilai.kejelasan === -1 ||
        nilai.kreativitas === -1 ||
        sudah === false
      );
    });

    if (invalidItems.length > 0) {
      console.error("Found invalid items in dataInputNilai:", invalidItems);
      return false;
    }
    console.log("All items in dataInputNilai are valid.");
    const akhir = await addPenilaian(teamId, dataInputNilai);
    if (akhir) {
      navigate("/penilaian/sukses", { replace: true });
    }
  }

  return (
    <div className="flex flex-col justify-around min-h-screen items-center">
      <div className="flex items-center justify-center min-fit  gap-4 ">
        {dataInputNilai.map((e, i) => (
          <CardNilai
            key={i}
            downloadLink={links[i]}
            dataInputNilai={e}
            updateDataInputNilai={updateDataInputNilai}
            index={i}
          />
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <InfoIcon />
        <span className="text-red-600 text-sm">
          Rentang nilai dari 0.0 -10.0
        </span>
      </div>
      <div
        onClick={handleSubmit}
        className="py-2 px-7 bg-white border rounded-xl border-gray-300 hover:shadow-2xl shadow-lg cursor-pointer"
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
    if (!isError.includes(1) && !valueInput.includes(0)) {
      updateDataInputNilai(...valueInput, (index = index));
    }
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
      alert("Download link is not available.");
      return;
    }

    // If the link is available, proceed with the download
    window.open(downloadLink, "_blank"); // This opens the link in a new tab
  };

  return (
    <>
      <div className="bg-white w-fit border border-gray-300 hover:shadow-2xl shadow-lg flex flex-col gap-4 ">
        <div className="flex flex-col mx-8 mt-10">
          <span className="text-lg font-semibold">*****</span>
          <h2 className="text-2xl font-bold mb-5">Team {index + 1}</h2>
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
            <div key={i} className="flex flex-col max-h-max text-gray-500 mx-8">
              <div className="flex items-end justify-between gap-8 text-sm font-medium">
                <label className="block w-24">
                  {key[0].toUpperCase() + key.slice(1)}
                </label>
                <input
                  type="text"
                  maxLength="4"
                  onChange={(e) => handleInputChange(e.target.value, i)}
                  className={`w-5 border-b-2 ${
                    isError[i]
                      ? "border-red-600"
                      : "border-slate-500 focus:border-slate-800"
                  } focus:outline-none`}
                />
              </div>
            </div>
          ))}

          {/* Status message */}
          <div className="mt-6 w-[85%] mx-auto bg-gray-300 font-normal text-black text-xs py-8 px-4 text-center">
            {!isError.includes(1) && !valueInput.includes(0)
              ? "Sudah diisi"
              : "Belum diisi"}
          </div>
        </div>
      </div>
    </>
  );
}
