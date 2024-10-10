import React, { useState } from "react";
import * as XLSX from "xlsx";
import { addDataByFile } from "../utils/fungsi";

export function UploadExcel({ setShowUpload }) {
  const [teamData, setTeamData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON format
      const relevantData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const processedData = [];

      for (let i = 0; i < relevantData.length; i++) {
        const row = relevantData[i];
        if (row.length == 0 || row[0] == "teamId") {
          continue;
        }
        processedData.push({
          teamId: row[0],
          evaluatedTeams: [row[1], row[2], row[3], row[4], row[5]],
          universitas: row[6],
          membersNIM: [
            (row[7] || "").toString(),
            (row[8] || "").toString(),
            (row[9] || "").toString(),
          ]
            .filter((nim) => nim) // Filters out any empty strings or undefined values
            .sort(),
          createdAt: new Date().toLocaleTimeString("id-ID", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          file: {
            fileName: "",
            fileUrl: "",
            uploadedAt: "",
          },
        });
      }

      console.log(processedData);

      setTeamData(processedData);
    };

    reader.readAsArrayBuffer(file);
  };

  async function handleSubmitData(e) {
    e.preventDefault();
    console.log(teamData);
    if (teamData.length == 0) {
      console.log("result");

      return;
    }
    const result = await addDataByFile(teamData);
    setShowUpload(false);
    console.log(result);
  }

  return (
    <div className="p-6 flex flex-col gap-7 items-center">
      <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
      <form
        onSubmit={handleSubmitData}
        className="flex flex-col items-center px-5 py-10 w-full border-2 rounded-lg border-slate-900 focus:outline-none focus:border-blue-500"
      >
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4 w-full"
        />

        {teamData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Data yg dibaca: {"   "}
              <span className="text-sm font-medium mb-4">
                ({teamData.length} baris)
              </span>
            </h3>

            <div className="overflow-x-auto text-sm">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Team ID</th>
                    <th className="px-4 py-2 border">Evaluated Teams</th>
                    <th className="px-4 py-2 border">Universitas</th>
                    <th className="px-4 py-2 border">Members NIM</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.map((team, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{team.teamId}</td>
                      <td className="px-4 py-2 border">
                        {team.evaluatedTeams.toString()}
                      </td>
                      <td className="px-4 py-2 border">{team.universitas}</td>
                      <td className="px-4 py-2 border">
                        {team.membersNIM.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-7">
          <div
            onClick={() => setShowUpload(false)}
            className={`w-fit mt-10 cursor-pointer bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition 
          }`}
          >
            Back
          </div>
          <button
            type="submit"
            className={`w-fit cursor-pointer mt-10 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition ${
              teamData.length == 0 && "hidden"
            }`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}