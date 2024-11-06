import { useEffect } from "react";
import { useState } from "react";
import {
  getAllPesertaData,
  getPesetaByTeamId,
  updateDataPeserta,
  getAllPesertaDataForFinal,
} from "../utils/fungsi";
import { UploadExcel } from "./UploadExcel";
import * as xlsx from "xlsx";

export function Admin({ batas }) {
  const [allData, setAllData] = useState([]);
  const [belumSubmit, setBelumSubmit] = useState([]);
  const [sudahSubmit, setSudahSubmit] = useState([]);
  const [showTeam, setShowTeam] = useState(null);
  const [showUpload, setShowUpload] = useState(null);
  const [deadline, setDeadline] = useState({ bisaSimpan: false, value: batas });

  useEffect(() => {
    async function getData() {
      const data = await getAllPesertaData();
      if (data.length > 0) {
        data.sort((a, b) => a.teamId.localeCompare(b.teamId));
        setAllData(data);
        setBelumSubmit(
          data
            .filter((e) => e.file.uploadedAt == "")
            .sort((a, b) => a.teamId.localeCompare(b.teamId))
        );
        setSudahSubmit(
          data
            .filter((e) => e.file.uploadedAt != "" && e.udahNilai == false)
            .sort((a, b) => a.teamId.localeCompare(b.teamId))
        );
      }
    }

    getData();
  }, []);

  if (showTeam) {
    console.log(showTeam);
    return (
      <div className="flex justify-center items-center h-screen w-screen ">
        <div className="flex flex-col  gap-5 mb-4 w-fit border border-slate-900 py-16 px-20 bg-white">
          <div className=" flex items-end gap-5 text-sm">
            <label className="block   w-40">Nama Team</label>
            <div className="w-full border-b-[1.3px] border-black focus:outline-none focus:border-blue-500">
              {showTeam.teamId}
            </div>
          </div>
          <div className=" flex items-end gap-5 text-sm">
            <label className="block    w-40">membersNIM</label>
            <div className="w-full border-b-[1.3px] border-black focus:outline-none focus:border-blue-500">
              {showTeam.membersNIM.join("-")}
            </div>
          </div>
          <div className=" flex items-end gap-5 text-sm">
            <label className="block    w-40">evaluatedTeams</label>
            <div className="w-full border-b-[1.3px] border-black focus:outline-none focus:border-blue-500">
              {showTeam.evaluatedTeams.join(", ")}
            </div>
          </div>
          <div className=" flex items-end gap-5 text-sm">
            <label className="block    w-40">universitas</label>
            <div className="w-full border-b-[1.3px] border-black focus:outline-none focus:border-blue-500">
              {showTeam.universitas}
            </div>
          </div>
          <div
            onClick={() => setShowTeam(null)}
            className="border py-2 px-10 mx-auto mt-8 w-fit border-slate-900 hover:bg-gray-300 transition cursor-pointer"
          >
            back
          </div>
        </div>
      </div>
    );
  }

  if (showUpload) {
    return <UploadExcel setShowUpload={setShowUpload} />;
  }

  return (
    <div className="h-svh w-svh flex justify-between gap-5 px-5">
      <div className="kiri w-1/2 h-svh py-5 gap-5 flex flex-col">
        <div className="atas  w-full  flex justify-between items-center">
          <div
            onClick={() => setShowUpload(true)}
            className="px-5 py-2 w-fit gap-3 flex text-black cursor-pointer border border-slate-900 hover:bg-gray-300 transition"
          >
            <span>➕</span> <span>add data peserta</span>
          </div>
          <div className="flex items-center gap-2 w-fit px-5 py-2 border border-slate-900">
            <label className=" text-sm font-medium text-gray-700 flex gap-2">
              <span>⌛</span>Deadline :
            </label>

            <div className="w-16 border-b-[1.3px] text-center border-black">
              {deadline.value}
            </div>
          </div>
        </div>
        <div className="bawah flex w-full  border overflow-hidden  border-slate-900">
          <div className="kiri flex flex-col gap-3 w-1/2  px-5 py-5 max-h-fit ">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <span>✖️</span> belum submit
              </div>
              <div className="">
                {belumSubmit.length + "/" + allData.length}
              </div>
            </div>
            <div className="flex flex-col px-5 py-5  gap-2 h-full bg-slate-300 overflow-y-scroll">
              {belumSubmit.map((e, i) => (
                <div
                  className="hover:font-semibold cursor-pointer"
                  key={i}
                  onClick={() => setShowTeam(e)}
                >
                  {e.teamId}
                </div>
              ))}
            </div>
          </div>
          <div className="kanan flex flex-col gap-3 w-1/2 px-5 py-5 max-h-fit ">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <span>✖️</span> belum nilai
              </div>
              <div className="">
                {sudahSubmit.length + "/" + allData.length}
              </div>
            </div>
            <div className="flex flex-col px-5 py-5 gap-2 h-full bg-slate-300 overflow-y-scroll">
              {sudahSubmit.map((e, i) => (
                <div
                  className="hover:font-semibold cursor-pointer"
                  key={i}
                  onClick={() => setShowTeam(e)}
                >
                  {e.teamId}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Kanan />
    </div>
  );
}

function Kanan() {
  const [tambahanData, setTambahanData] = useState("");
  const [teamId, setTeamId] = useState("");
  const [data, setData] = useState({
    evaluatedTeams: "",
    universitas: "",
    membersNIM: "",
    fileUrl: "",
    fileName: "",
    udahNilai: "",
  });

  async function handleFind() {
    const dummy = await getPesetaByTeamId(teamId);
    if (dummy) {
      setTambahanData({ id: dummy.id, uploadedAt: dummy.file.uploadedAt });
      setData({
        evaluatedTeams: dummy.evaluatedTeams.join(", "),
        universitas: dummy.universitas,
        membersNIM: dummy.membersNIM.join(", "),
        fileUrl: dummy.file.fileUrl,
        fileName: dummy.file.fileName,
        udahNilai: dummy.udahNilai,
      });
    }
  }

  function handleChange(event, field) {
    const value = event.target.value.trim().toLowerCase();
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  async function handleSave() {
    const res = await updateDataPeserta(
      tambahanData.id,
      data.evaluatedTeams,
      data.universitas,
      data.membersNIM,
      data.udahNilai,
      data.fileUrl,
      data.fileName,
      tambahanData.uploadedAt
    );
  }

  return (
    <div className="kanan w-1/2 h-svh  py-5 flex flex-col gap-2 ">
      <div className="atas border flex flex-col max-h-max px-7 mb-4 gap-6 py-6 border-slate-900">
        <div className=" font-medium text-xl mt-2 mb-1">Ubah data peserta</div>
        <div className=" flex items-end ">
          <label className="block text-sm mr-7 w-32 ">Nama team</label>
          <input
            type="text"
            maxLength={20}
            onChange={(e) => setTeamId(e.target.value.trim().toLowerCase())}
            className="text-sm border-b-[1.5px] w-full border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <div
            onClick={handleFind}
            className=" cursor-pointer hover:opacity-70  pb-1 px-1"
          >
            🔍
          </div>
        </div>
        <div
          className={`flex flex-col max-h-max gap-6 ${
            !data.universitas && "pointer-events-none opacity-50"
          }`}
        >
          {Object.keys(data).map((key, i) => (
            <div key={i} className=" flex items-end gap-5">
              <label className="block text-sm   w-32 ">{key}</label>
              <input
                type="text"
                maxLength={100}
                value={data[key]}
                onChange={(e) => handleChange(e, key)}
                className="text-sm border-b-[1.5px] w-full border-gray-700  focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}
        </div>
        <div
          onClick={handleSave}
          className={`${
            !data.universitas && "pointer-events-none opacity-50"
          } border px-5 w-fit py-2 border-slate-900 cursor-pointer gap-2 flex hover:bg-gray-300 transition`}
        >
          <sapn>🗃️</sapn>Simpan
        </div>
      </div>
      <div
        onClick={async () =>
          exportToExcel(await getAllPesertaDataForFinal(), "finalData.xlsx")
        }
        className="border w-full text-center py-2 border-slate-900 cursor-pointer flex gap-3 justify-center hover:bg-gray-300 transition"
      >
        <span>🧾</span>Dapatkan Data
      </div>
    </div>
  );
}

function exportToExcel(data, fileName) {
  // Create a new workbook and add a worksheet
  const workbook = xlsx.utils.book_new();

  // Prepare to format the data into the desired structure
  const formattedData = [];

  data.forEach((item) => {
    // Start a new row with teamId
    const row = { teamId: item.teamId };

    // Flatten the evaluator's data
    item.nilaiDiDapat.forEach((evaluator, index) => {
      const evaluatorIndex = index + 1; // Start index from 1 for naming

      row[`penilai${evaluatorIndex}`] = evaluator.evaluatorTeamId;
      row[`estetika${evaluatorIndex}`] = evaluator.nilai.estetika;
      row[`kejelasan${evaluatorIndex}`] = evaluator.nilai.kejelasan;
      row[`kreativitas${evaluatorIndex}`] = evaluator.nilai.kreativitas;
    });

    formattedData.push(row);
  });

  // Convert the data into a worksheet
  const worksheet = xlsx.utils.json_to_sheet(formattedData, {
    header: [
      "teamId",
      "penilai1",
      "estetika1",
      "kejelasan1",
      "kreativitas1",
      "penilai2",
      "estetika2",
      "kejelasan2",
      "kreativitas2",
    ],
  });

  // Append the worksheet to the workbook
  xlsx.utils.book_append_sheet(workbook, worksheet, "Evaluations");

  // Write the workbook to a file
  xlsx.writeFile(workbook, fileName);
}
