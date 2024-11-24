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
import { db1, auth } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase"; // Adjust the import path for your Firebase initialization
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export async function login(email, password) {
  // const auth = getAuth();
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const data = await cekLoginDB(email);

    //console.info(data);

    if (data.fail && result.user.uid) {
      return { error: data.result };
    }

    return { ...data.result, uid: result.user.uid };
  } catch (error) {
    const errorMessage = error.message;
    return { error: errorMessage };
  }
}

async function cekLoginDB(email) {
  try {
    const querySnapshot = await getDocs(
      query(collection(db1, "peserta"), where("email", "==", email))
    );
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { fail: 0, result: data[0] };
    } else {
      return { fail: 1, result: "something went wrong" };
    }
  } catch (error) {
    return { fail: 1, result: error };
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
      //console.log("Peserta ditemukan:", data);
      return data[0];
    } else {
      //console.log(
      //   "Tidak ada peserta yang ditemukan dengan universitas dan NIM tersebut."
      // );
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

export async function logOut() {
  try {
    await signOut(auth);
    //console.log("Sign-out successful.");
  } catch (error) {
    //console.error("An error happened during sign-out:", error);
  }
}

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

    //console.log("Fetched all peserta data:", allPesertaData);
    return allPesertaData;
  } catch (error) {
    //console.error("Error fetching all peserta data:", error);
    return [];
  }
}

export async function getAllPesertaDataForFinal() {
  try {
    // Reference to the "peserta" collection
    const pesertaCollectionRef = collection(db1, "nilai");

    // Get all documents from the "peserta" collection
    const querySnapshot = await getDocs(pesertaCollectionRef);

    // Map through the documents and return the data with their IDs
    const allPesertaData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    //console.log("Fetched all peserta data:", allPesertaData);
    return getFinalData(allPesertaData);
  } catch (error) {
    //console.error("Error fetching all peserta data:", error);
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

export async function addPenilaian(id, evaluatorTeamId, evaluatedTeams) {
  try {
    const docRef1 = await addDoc(collection(db1, "nilai"), {
      evaluatorTeamId,
      evaluatedTeams: evaluatedTeams.map((team) => {
        //console.log("team:", team);
        //console.log("teamId:", team.teamId);
        //console.log("nilai:", team.nilai);

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

    if (!docRef1.id) {
      return { error: "Failed to create a new document" };
    }

    // Update the file property
    await updateDoc(doc(db1, "peserta", id), {
      udahNilai: true,
    });

    return { id: docRef1.id };
  } catch (error) {
    return { error };
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
      } else {
        return { error: "something went wrong" };
      }
    }
    const fileUrls = allPesertaData.map((item) => item.file.fileUrl);
    return fileUrls; // Return the combined array of peserta data
  } catch (error) {
    //console.error("Error fetching peserta data: ", e);
    return { error }; // Return null in case of error
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
      //console.log("Peserta ditemukan:", data);
      return data[0]; // Peserta dengan universitas dan NIM ditemukan
    } else {
      //console.log(
      //   "Tidak ada peserta yang ditemukan dengan universitas dan NIM tersebut."
      // );
      return null; // Tidak ada peserta yang ditemukan
    }
  } catch (e) {
    //console.error("Error checking peserta: ", e);
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
    //console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    //console.error("Error adding document: ", e);
    return null;
  }
}

export async function addDataByFile(teamData, noHps) {
  if (teamData.length == 0) {
    return;
  }
  const batch = writeBatch(db1);
  const collectionRef = collection(db1, "peserta");

  teamData.forEach((team, i) => {
    const docRef = doc(collectionRef); // Firestore will auto-generate a unique ID
    batch.set(docRef, team);
    // createUserWithEmailAndPassword(auth, team.email, noHps[i]);
  });

  try {
    const data = await batch.commit();
    //console.log("Batch write successful!");
    return "data";
  } catch (error) {
    //console.error("Error committing batch write:", error);
    return false;
  }
}

async function updatePesertaFile(id, fileUrl, fileName) {
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

    //console.log("File updated successfully.");
    return { fail: 0 }; // Return the updated file data or the whole object if needed
  } catch (error) {
    //console.error("Error updating file: ", error);
    return { fail: 1, error }; // Return null in case of error
  }
}

export async function uploadFile(file, id, fileName) {
  try {
    if (!navigator.onLine) {
      return {
        error: "You are offline. Please check your internet connection.",
      };
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);

    //console.log("Uploaded a blob or file!", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    const result = await updatePesertaFile(id, downloadURL, fileName);

    if (result?.fail) {
      return { error: result.error };
    }

    return true;
  } catch (error) {
    // Handle Firebase Storage-specific errors
    if (error.code === "storage/unauthorized") {
      //console.error(
      //   "403 Forbidden: You don't have permission to upload this file."
      // );
    } else if (error.code === "storage/quota-exceeded") {
      //console.error("Quota exceeded: Unable to upload file.");
    } else if (error.code === "storage/network-request-failed") {
      //console.error("Network error: Please check your connection.");
    } else {
      //console.error("Error uploading file:", error);
    }

    return { error: error.message };
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

    //console.log("File updated successfully.");
    return true; // Return the updated file data or the whole object if needed
  } catch (e) {
    //console.error("Error updating file: ", e);
    return false; // Return null in case of error
  }
}
