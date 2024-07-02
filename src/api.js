import { firestore, userCollection } from "./firebase";
import {
  getDocs,
  setDoc,
  where,
  query,
  documentId,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
userCollection;

const DECK_API_BASE = "https://www.deckofcardsapi.com/api/deck";

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchDeckID() {
  try {
    const url = `${DECK_API_BASE}/new/shuffle/`;
    const data = await fetchJson(url);
    return data.deck_id;
  } catch (error) {
    console.error("Error fetching deck ID:", error);
  }
}

export async function drawCards(deckID) {
  try {
    const url = `${DECK_API_BASE}/${deckID}/draw/?count=10`;
    const data = await fetchJson(url);
    return Promise.resolve(data.cards);
  } catch (error) {
    return Promise.reject("Error drawing cards:", error);
  }
}

export async function fetchUsers() {
  try {
    const querySnapshot = await getDocs(userCollection);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    console.log(users.sort((a, b) => b.highscore - a.highscore));
    return users;
  } catch (error) {
    return error;
  }
}

export async function getHighScore(id) {
  const q = query(
    collection(firestore, "users"),
    //todo use $id
    where(documentId(), "==", "1")
  );

  let highscore;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, doc.data());
    highscore = doc.data().highscore;
    return doc.data();
  });

  return highscore;
}
export async function setHighScore(id, score) {
  const highscore = await getHighScore();

  if (score > highscore)
    //todo use $id
    await addDoc(userCollection, { username: "test", highscore: 19 });
}
