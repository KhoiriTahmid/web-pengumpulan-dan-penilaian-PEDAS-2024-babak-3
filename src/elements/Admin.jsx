import { useEffect } from "react";
import { useState } from "react";
import { getAllPesertaData } from "../utils/fungsi";
import { UploadExcel } from "./UploadExcel";

export function Admin({ batas, setBatas }) {
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
        setAllData(data);
        setBelumSubmit(data.filter((e) => e.file.uploadedAt == ""));
        setSudahSubmit(data.filter((e) => e.file.uploadedAt != ""));
      }
    }

    getData();
  }, []);

  if (showTeam) {
    console.log(showTeam);
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        <div className="flex flex-col gap-2  mb-4 w-fit border py-6 px-6 bg-white">
          <div className=" flex items-end gap-5 text-sm">
            <label className="block font-medium text-gray-700 w-40">
              teamId
            </label>
            <div className="w-full border-b-2 border-black focus:outline-none focus:border-blue-500">
              {showTeam.teamId}
            </div>
          </div>
          <div className=" flex items-end gap-5 text-sm">
            <label className="block  font-medium text-gray-700 w-40">
              membersNIM
            </label>
            <div className="w-full border-b-2 border-black focus:outline-none focus:border-blue-500">
              {showTeam.membersNIM.toString(", ")}
            </div>
          </div>
          <div className=" flex items-end gap-5 text-sm">
            <label className="block  font-medium text-gray-700 w-40">
              evaluatedTeams
            </label>
            <div className="w-full border-b-2 border-black focus:outline-none focus:border-blue-500">
              {showTeam.evaluatedTeams.toString()}
            </div>
          </div>
          <div className=" flex items-end gap-5 text-sm">
            <label className="block  font-medium text-gray-700 w-40">
              universitas
            </label>
            <div className="w-full border-b-2 border-black focus:outline-none focus:border-blue-500">
              {showTeam.universitas}
            </div>
          </div>
          <div
            onClick={() => setShowTeam(null)}
            className="border py-1.5 px-5 mx-auto mt-5 w-fit border-slate-900 hover:border-slate-200 cursor-pointer"
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
    <div className="h-screen overflow-clip w-screen flex justify-between">
      <div className="kiri w-1/2 h-full px-5 py-5 gap-5 flex flex-col">
        <div className="atas  w-full  flex justify-between items-center">
          <div
            onClick={() => setShowUpload(true)}
            className="px-5 py-2 w-fit border cursor-pointer border-slate-900 hover:border-slate-200"
          >
            add data peserta
          </div>
          <div className="flex items-center gap-2 w-fit px-5 py-2 border border-slate-900">
            <label className="block text-sm font-medium text-gray-700 ">
              Deadline :
            </label>
            <input
              type="text"
              defaultValue={deadline.value}
              onChange={(e) =>
                setDeadline({ bisaSimpan: true, value: e.target.value })
              }
              className="w-20 border-b-2 border-black focus:outline-none focus:border-blue-500"
            />
            <div
              className={`w-fit cursor-pointer ml-5  border border-slate-900 text-black  px-4  hover:bg-gray-400 transition ${
                deadline.length == 0 && "opacity-60 pointer-events-none"
              }`}
              onClick={() => {
                setBatas(deadline.value);
                setDeadline({ bisaSimpan: false, value: deadline.value });
              }}
            >
              Simpan
            </div>
          </div>
        </div>
        <div className="bawah flex w-full h-full  border border-slate-900">
          <div className="kiri flex flex-col gap-3 w-1/2 h-full  px-5 py-5 ">
            <div className="flex justify-between">
              <div className="">belum submit</div>
              <div className="">
                {belumSubmit.length + "/" + allData.length}
              </div>
            </div>
            <div className="flex flex-col px-5 py-5 mb-10 gap-2 h-full bg-slate-300 overflow-y-scroll">
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
          <div className="kanan flex flex-col gap-3 w-1/2 px-5 py-5 ">
            <div className="flex justify-between">
              <div className="">belum nilai</div>
              <div className="">
                {sudahSubmit.length + "/" + allData.length}
              </div>
            </div>
            <div className="flex flex-col px-5 py-5 gap-2 mb-10 h-full bg-slate-300 overflow-y-scroll">
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
      <div className="kanan w-1/2 h-screen px-5 py-10 flex flex-col gap-5 border border-slate-900"></div>
    </div>
  );
}
