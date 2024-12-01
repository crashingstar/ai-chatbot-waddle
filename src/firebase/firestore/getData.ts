import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import firebase_app from "../config";

const db = getFirestore(firebase_app);
export default async function getChatsByUserId(userId: string) {
  // Create a reference to the "chats" collection
  const chatsRef = collection(db, "chats");

  // Create a query to filter chats by userId
  const q = query(chatsRef, where("userId", "==", userId));

  // Variable to store the result
  let result = null;
  // Variable to store any error that occurs during the operation
  let error = null;

  try {
    // Get the documents that match the query
    const querySnapshot = await getDocs(q);

    // Check if any documents exist
    if (!querySnapshot.empty) {
      result = querySnapshot.docs.map((doc) => doc.data()); // Map the docs to an array of data
    } else {
      error = "No chats found for this user.";
    }
  } catch (e) {
    // Catch and store any error that occurs during the operation
    error = e;
  }

  // Return the result and error as an object
  return { result, error };
}
