import { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import "./App.css";
import {
  addPeserta,
  checkPeserta,
  updatePesertaFile,
  getEvaluatedTeams,
} from "./utils/fungsi.jsx";
import { Login } from "./elements/Login.jsx";
import { Penilaian } from "./elements/Penilaian.jsx";
import { Submit } from "./elements/Submit.jsx";
import { Admin } from "./elements/Admin.jsx";
import ProtectedRoute from "./utils/ProtectedRoute";
import { Dummy } from "./elements/Dummy.jsx";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [deadline, setDeadline] = useState("09:45:15");

  console.log(deadline);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <Login setCurrentUser={setCurrentUser} deadline={deadline} />
              }
            />
            <Route
              path="/pengumpulan"
              element={
                <ProtectedRoute>
                  <Submit currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengumpulan/sukses"
              element={
                <ProtectedRoute>
                  <Dummy context={"submit"} deadline={deadline} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/penilaian"
              element={
                <ProtectedRoute>
                  <Penilaian
                    evaluatedTeams={currentUser?.evaluatedTeams}
                    teamId={currentUser?.teamId}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/penilaian/sukses"
              element={
                <ProtectedRoute>
                  <Dummy context={"penilaian"} deadline={deadline} />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/admin"
            element={<Admin batas={deadline} setBatas={setDeadline} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// function App() {
//   //updatePesertaFile("x4v0z4V2Qpez0bNeJJSw", "wewew", "kl.twbx");

//   //getEvaluatedTeams(["team1", "team2", "team3", "team4", "team5"]);
//   return (
//     <>
//       <Submit />
//       {/* <Penilaian
//         evaluatedTeams={["team1", "team2", "team3", "team4", "team5"]}
//         teamId={"Team Alpha"}
//       /> */}
//     </>
//   );
//   // const [peserta, setPeserta] = useState(null); // To store the returned peserta data
//   // const [loading, setLoading] = useState(true); // To manage loading state
//   // const [error, setError] = useState(null); // To store any error that occurs

//   // useEffect(() => {
//   //   const fetchPeserta = async () => {
//   //     setLoading(true); // Start loading
//   //     try {
//   //       const data = await checkPeserta("UI", "11-22-33"); // Call the async function
//   //       setPeserta(data); // Update the state with the retrieved data
//   //     } catch (e) {
//   //       console.error("Error fetching peserta:", e);
//   //       setError(e); // Set error if there's an issue
//   //     } finally {
//   //       setLoading(false); // End loading
//   //     }
//   //   };

//   //   fetchPeserta(); // Call the function to fetch data
//   // }, []); // Run once on component mount

//   // // Conditional rendering based on loading and error states
//   // if (loading) return <div>Loading...</div>;
//   // if (error) return <div>Error fetching peserta: {error.message}</div>;

//   // return (
//   //   <div>
//   //     {peserta ? (
//   //       <div>
//   //         <h2>Peserta Ditemukan:</h2>
//   //         <p>ID: {peserta.id}</p>
//   //         <p>Universitas: {peserta.universitas}</p>
//   //         <p>NIM: {peserta.membersNIM}</p>
//   //         {/* Render other relevant data here */}
//   //       </div>
//   //     ) : (
//   //       <div>Tidak ada peserta ditemukan.</div>
//   //     )}
//   //   </div>
//   // );
// }

export default App;
