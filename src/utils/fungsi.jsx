import {
  collection,
  addDoc,
  writeBatch,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  limit,
} from "firebase/firestore";
import { db1, db2 } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Adjust the import path for your Firebase initialization

export async function getAllPesertaData() {
  try {
    // Reference to the "peserta" collection
    const pesertaCollectionRef = collection(db1, "peserta");

    // Get all documents from the "peserta" collection
    const querySnapshot = await getDocs(pesertaCollectionRef);

    // Map through the documents and return the data with their IDs
    const allPesertaData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched all peserta data:", allPesertaData);
    return allPesertaData;
  } catch (error) {
    console.error("Error fetching all peserta data:", error);
    return [];
  }
}

export async function getAllPesertaDataForFinal() {
  try {
    // Reference to the "peserta" collection
    const pesertaCollectionRef = collection(db2, "peserta");

    // Get all documents from the "peserta" collection
    const querySnapshot = await getDocs(pesertaCollectionRef);

    // Map through the documents and return the data with their IDs
    const allPesertaData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched all peserta data:", allPesertaData);
    return getFinalData(allPesertaData);
  } catch (error) {
    console.error("Error fetching all peserta data:", error);
    return [];
  }
}

function getFinalData(db) {
  const evaluationsMap = new Map();

  // Iterate through all entries in the database
  db.forEach((entry) => {
    entry.evaluatedTeams.forEach((evaluatedTeam) => {
      const { teamId, nilai } = evaluatedTeam;

      // Initialize the array for a team if not already present in the map
      if (!evaluationsMap.has(teamId)) {
        evaluationsMap.set(teamId, []);
      }

      // Add the evaluation details including the evaluatorTeamId
      evaluationsMap.get(teamId).push({
        evaluatorTeamId: entry.evaluatorTeamId,
        nilai,
      });
    });
  });

  // Convert the map into the desired array format
  const result = Array.from(evaluationsMap, ([teamId, nilaiDiDapat]) => ({
    teamId,
    nilaiDiDapat,
  }));

  return result;
}

export async function uploadFile(file) {
  //done
  try {
    // Create a storage reference
    const storageRef = ref(storage, `uploads/${file.name}`);

    // Upload the file to the specified path
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Uploaded a blob or file!", snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL; // Return the download URL for further use
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

export async function addPenilaian(id, evaluatorTeamId, evaluatedTeams) {
  //return id of new data
  try {
    console.log("evaluatorTeamId:", evaluatorTeamId);
    console.log("evaluatedTeams:", evaluatedTeams);

    const docRef1 = await addDoc(collection(db2, "peserta"), {
      evaluatorTeamId,
      evaluatedTeams: evaluatedTeams.map((team) => {
        console.log("team:", team);
        console.log("teamId:", team.teamId);
        console.log("nilai:", team.nilai);

        return {
          teamId: team.teamId,
          nilai: {
            estetika: team.nilai.estetika,
            kejelasan: team.nilai.kejelasan,
            kreativitas: team.nilai.kreativitas,
          },
        };
      }),
      evaluatedAt: new Date().toLocaleTimeString("id-ID", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });

    // Update the file property
    const docRef2 = await updateDoc(doc(db1, "peserta", id), {
      udahNilai: true,
    });

    console.log("Document written with ID: ", docRef1);
    console.log("Document written with ID: ", docRef2);
    return docRef1.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

export async function getEvaluatedTeams(teamIds) {
  //dah
  try {
    const allPesertaData = [];

    for (const teamId of teamIds) {
      // Create a query for each teamId
      const pesertaQuery = query(
        collection(db1, "peserta"),
        where("teamId", "==", teamId),
        limit(5)
      );

      const querySnapshot = await getDocs(pesertaQuery);

      // If results are found, map them to an array
      if (!querySnapshot.empty) {
        const pesertaList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        allPesertaData.push(...pesertaList); // Add the results to the combined array
      }
    }
    const fileUrls = allPesertaData.map((item) => item.file.fileUrl);
    return fileUrls; // Return the combined array of peserta data
  } catch (e) {
    console.error("Error fetching peserta data: ", e);
    return null; // Return null in case of error
  }
}

export async function updatePesertaFile(id, fileUrl, fileName) {
  //belom
  try {
    // Get a reference to the document you want to update
    const pesertaRef = doc(db1, "peserta", id);

    // Update the file property
    await updateDoc(pesertaRef, {
      file: {
        fileUrl,
        fileName,
        uploadedAt: new Date().toLocaleTimeString("id-ID", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
    });

    console.log("File updated successfully.");
    return true; // Return the updated file data or the whole object if needed
  } catch (e) {
    console.error("Error updating file: ", e);
    return false; // Return null in case of error
  }
}

export async function updateDataPeserta(
  id,
  evaluatedTeams,
  universitas,
  membersNIM,
  udahNilai,
  fileUrl,
  fileName,
  uploadedAt
) {
  //belom
  try {
    // Get a reference to the document you want to update
    const pesertaRef = doc(db1, "peserta", id);

    // Update the file property
    await updateDoc(pesertaRef, {
      evaluatedTeams: evaluatedTeams.split(", ").sort(),
      universitas,
      membersNIM: membersNIM.split(", ").sort(),
      file: {
        fileUrl,
        fileName,
        uploadedAt,
      },
      udahNilai,
    });

    console.log("File updated successfully.");
    return true; // Return the updated file data or the whole object if needed
  } catch (e) {
    console.error("Error updating file: ", e);
    return false; // Return null in case of error
  }
}

export async function checkPeserta(universitas, nim) {
  // Check if the device is online
  if (!navigator.onLine) {
    return {
      error: "Device kamu offline. Mohon periksa koneksi internet.",
    };
  }

  try {
    const pesertaQuery = query(
      collection(db1, "peserta"),
      where("universitas", "==", universitas),
      where("membersNIM", "==", nim)
    );

    // Use a timeout to ensure Firestore responds within a certain time limit
    const querySnapshot = await Promise.race([
      getDocs(pesertaQuery),
      new Promise(
        (_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), 10000) // 10-second timeout
      ),
    ]);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Peserta ditemukan:", data);
      return data[0];
    } else {
      console.log(
        "Tidak ada peserta yang ditemukan dengan universitas dan NIM tersebut."
      );
      return "kosong";
    }
  } catch (error) {
    // Handle specific Firestore or timeout errors
    if (error.message === "Request timed out") {
      return { error: "Timeout: konenksi kamu lambat." };
    } else if (error.code === "permission-denied") {
      return { error: "Permission denied. Check Firestore rules." };
    } else if (error.code === "unavailable") {
      return {
        error: "Firestore service unavailable. Please try again later.",
      };
    } else {
      return { error: "An unexpected error occurred. Please try again later." };
    }
  }
}

export async function getPesetaByTeamId(teamId) {
  //udah
  try {
    // Membuat query untuk mencari peserta dengan universitas dan NIM yang sesuai
    const pesertaQuery = query(
      collection(db1, "peserta"),
      where("teamId", "==", teamId)
    );

    const querySnapshot = await getDocs(pesertaQuery);

    // Jika ada hasil, kembalikan true, jika tidak, kembalikan false
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Peserta ditemukan:", data);
      return data[0]; // Peserta dengan universitas dan NIM ditemukan
    } else {
      console.log(
        "Tidak ada peserta yang ditemukan dengan universitas dan NIM tersebut."
      );
      return null; // Tidak ada peserta yang ditemukan
    }
  } catch (e) {
    console.error("Error checking peserta: ", e);
    return null; // Jika terjadi error, kembalikan false
  }
}

export async function addPeserta( // return id of new data
  teamId,
  evaluatedTeams,
  universitas,
  membersNIM,
  fileUrl = "",
  fileName = "",
  uploadedAt = ""
) {
  try {
    const docRef = await addDoc(collection(db1, "peserta"), {
      teamId,
      evaluatedTeams,
      universitas,
      membersNIM,
      file: {
        fileUrl,
        fileName,
        uploadedAt,
      },
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

export async function addDataByFile(teamData) {
  if (teamData.length == 0) {
    return;
  }
  const batch = writeBatch(db1);
  const collectionRef = collection(db1, "peserta");

  teamData.forEach((team) => {
    const docRef = doc(collectionRef); // Firestore will auto-generate a unique ID
    batch.set(docRef, team);
  });

  try {
    const data = await batch.commit();
    console.log("Batch write successful!");
    return data;
  } catch (error) {
    console.error("Error committing batch write:", error);
    return false;
  }
}

// get dataPeserta 5 orang
