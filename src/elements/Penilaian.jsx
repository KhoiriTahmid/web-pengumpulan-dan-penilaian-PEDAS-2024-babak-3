import { useState, useEffect } from "react";
import InfoIcon from "../assets/info.jsx";
import { addPenilaian, getEvaluatedTeams } from "../utils/fungsi.jsx";
import { useNavigate } from "react-router-dom";
import { Dummy } from "./Dummy.jsx";

export function Penilaian({ evaluatedTeams, teamId, id }) {
  // bigData
  const [dataInputNilai, setDataInputNilai] = useState(
    evaluatedTeams.map((e, i) => ({
      teamId: e,
      nilai: {
        estetika: "",
        kejelasan: "",
        kreativitas: "",
      },
      link: "",
    }))
  );

  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [popUpInfo, setPopUpInfo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const links = await getEvaluatedTeams(evaluatedTeams);
        if (links?.hasOwnProperty("error")) {
          setIsError(links?.error);
          return;
        }
        setDataInputNilai(
          evaluatedTeams.map((e, i) => ({
            teamId: e,
            nilai: {
              estetika: "",
              kejelasan: "",
              kreativitas: "",
            },
            link: links[i],
          }))
        );
        setLinks(links);
      } catch (error) {
        setIsError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [evaluatedTeams]);

  if (loading) {
    return <Dummy context={"loading"} />;
  }

  function updateState() {
    setState(state + 1);
  }

  async function handleSubmit() {
    let akhir;
    try {
      setLoading(true);
      akhir = await addPenilaian(id, teamId, dataInputNilai);
      if (akhir?.hasOwnProperty("error")) {
        setIsError(akhir?.error);
        return;
      }
    } catch (error) {
      setIsError(error);
    } finally {
      setLoading(false);
    }
    if (akhir) {
      navigate("/penilaian/sukses", { replace: true });
    }
  }

  if (isError) {
    return <Dummy context={"error" + isError} setPopup={setIsError} />;
  }

  if (popUpInfo) {
    return (
      <div className="bg-white min-h-screen flex justify-center items-center">
        <div className="bg-white p-6  w-[48%] px-28 py-10 md:mx-auto flex flex-col justify-center items-center gap-4 border border-black">
          <div className="text-center flex flex-col items-center">
            <h3 className="md:text-2xl mb-8 justify-between text-2xl flex gap-5 w-full text-gray-900 font-semibold text-center">
              <span>✨</span>
              <span className="text-nowrap">Selamat datang, Tim {teamId} </span>
              <span>✨</span>
              {/* <span>di halaman penilaian</span> */}
            </h3>
            <p className="text-gray-800 mt-3 mb-1 text-sm text-left font-medium self-start">
              Untuk menilai dashboard tim lain, kamu perlu melakukan beberapa
              hal, yaitu:
            </p>
            <ul className="mx-8 mb-4 space-y-1.5 text-left text-sm py-3 list-decimal list-outside text-gray-800">
              <li className="text-wrap text-justify">
                Mengunduh file dashboard dari masing-masing tim
              </li>
              <li className="text-wrap text-justify">
                Membuka dashboard tersebut di Tableau dan berinteraksi dengan
                dashboard tersebut
              </li>
              <li className="text-wrap text-justify">
                Mengurutkan tim deangan dashboard terbaik, ada 3 kriteria :
                estetika, kejelasan, dan kreativitas
              </li>
            </ul>

            <div className="flex gap-2 items-center mt-2">
              <InfoIcon />
              <span className="text-red-600 text-xs font-medium">
                Perhatian : Semakin kecil angka peringkat, semakin baik.
                Peringkat 1 adalah yang terbaik.
              </span>
            </div>
            <div
              onClick={() => setPopUpInfo(false)}
              className="mt-8 px-12 border cursor-pointer border-slate-900 hover:bg-gray-200   font-semibold w-full py-3"
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
        <Daftar
          dataInputNilai={dataInputNilai}
          setDataInputNilai={setDataInputNilai}
          count={state}
          updateState={updateState}
          sendData={handleSubmit}
        />
      </div>
    </div>
  );
}

import { List, arrayMove } from "react-movable";

function Daftar({
  dataInputNilai,
  setDataInputNilai,
  count,
  updateState,
  sendData,
}) {
  let nilai = dataInputNilai;
  const state = ["estetika", "kejelasan", "kreativitas"];
  let dummyNamaTeam = ["Team A", "Team B", "Team C", "Team D", "Team E"];
  const [hasDownload, setHasDownload] = useState(false);
  const [hasDownloadAll, setHasDownloadAll] = useState([
    { tim: "Team A", sudahUnduh: false },
    { tim: "Team B", sudahUnduh: false },
    { tim: "Team C", sudahUnduh: false },
    { tim: "Team D", sudahUnduh: false },
    { tim: "Team E", sudahUnduh: false },
  ]);
  const [freshTeam, setFreshTeam] = useState(
    dataInputNilai.map((e, i) => [e.teamId, dummyNamaTeam[i]])
  );

  async function handleSubmit() {
    let base = 5;
    const updatedNilai = [...nilai]; // Create a copy of `nilai`

    freshTeam.forEach((e, i) => {
      for (let el of updatedNilai) {
        // Use the copy
        if (el.teamId == e[0]) {
          el.nilai[state[count]] = base;
          base--;
          break;
        }
      }
      if (i === freshTeam.length - 1) {
        base = 5;
        setFreshTeam(
          dataInputNilai.map((e, i) => [e.teamId, dummyNamaTeam[i]])
        );
        updateState();
      }
    });

    if (count === 2) {
      setDataInputNilai(updatedNilai);
      sendData(); // Use the updated copy
    }
  }

  const handleDownload = (link, tim) => {
    setHasDownloadAll((prevTeams) =>
      prevTeams.map(
        (team) =>
          team.tim === tim
            ? { ...team, sudahUnduh: true } // Hanya perbarui jika kondisi terpenuhi
            : team // Jika tidak, kembalikan objek asli
      )
    );

    if (link == "") {
      alert(
        "tim tersebut belum submit dashboard. (hanya terjadi saat development, karena saat lomba dipastikan tim untuk mengumpulkan tepat waktu)"
      );
      return;
    }

    window.open(link, "_blank"); // This opens the link in a new tab
  };

  if (!hasDownload) {
    return (
      <div className="p-4 flex flex-col items-center gap-5 justify-center w-2/3">
        <p className="text-2xl font-semibold">Download</p>
        <div className=" flex flex-col gap-2 ">
          {nilai.map((e, i) => (
            <div className="p-4 justify-around  list-none border-gray-900   flex w-80 gap-7 hover:bg-gray-300 border">
              <span>{dummyNamaTeam[i]}</span>
              <span
                onClick={() => handleDownload(e.link, dummyNamaTeam[i])}
                className=" font-semibold  text-sm underline cursor-pointer hover:text-slate-500"
              >
                Download File
              </span>
            </div>
          ))}
        </div>
        <div
          onClick={() => setHasDownload(true)}
          className={`${
            hasDownloadAll.filter((e) => e.sudahUnduh == false).length != 0 &&
            "line-through pointer-events-none opacity-70"
          } py-2 mt-2 w-80 text-center bg-white border border-slate-900 hover:shadow-xl shadow-md cursor-pointer`}
        >
          Sudah
        </div>
      </div>
    );
  }

  ////console.log(items);

  return (
    <div className="p-4 flex flex-col items-center gap-5 justify-center w-2/3">
      <p className="text-lg mb-[-1rem] font-medium text-nowrap text-slate-600">
        Kategori {count + 1}
      </p>
      <p className="text-3xl font-semibold text-nowrap">
        {state[count].slice(0, 1).toUpperCase()}
        {state[count].slice(1)}
      </p>

      <div className="flex gap-6 ">
        <div className=" flex flex-col gap-[2.6rem] mt-5 text-slate-500 fixed ml-[-30px]">
          <span>1.</span>
          <span>2.</span>
          <span>3.</span>
          <span>4.</span>
          <span>5.</span>
        </div>
        <List
          values={freshTeam}
          onChange={
            ({ oldIndex, newIndex }) =>
              setFreshTeam(arrayMove(freshTeam, oldIndex, newIndex)) // Reorder the items in the array
          }
          renderList={({ children, props }) => (
            <ul {...props} className="space-y-2">
              {children}
            </ul>
          )}
          renderItem={({ value, props }) => (
            <li
              {...props}
              className="p-4 pl-6  list-none border-gray-900 cursor-move  flex w-80 gap-7 hover:bg-gray-300 border"
            >
              <p className="leading-[4px] text-slate-500 mt-[0.08rem] font-semibold text-xl whitespace-pre-line ">
                {"..\n..\n.."}
              </p>
              {value[1]}
            </li>
          )}
        />
      </div>

      <div className="flex gap-2 items-center mt-1">
        <InfoIcon />
        <span className="text-red-600 text-xs font-medium text-nowrap">
          Informasi: Tekan item untuk menggeser
        </span>
      </div>

      <div
        onClick={handleSubmit}
        className={`py-2 mt-2 w-80 text-center bg-white border border-slate-900 hover:shadow-xl shadow-md cursor-pointer`}
      >
        {count != 2 ? "Lanjut" : "Submit"}
      </div>
    </div>
  );
}
