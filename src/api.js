import { firestore, userCollection } from "./firebase";
import {
  getDocs,
  setDoc,
  where,
  query,
  documentId,
  doc,
  getDoc,
  collection,
} from "firebase/firestore";
userCollection;

const DECK_API_BASE = "https://www.deckofcardsapi.com/api/deck";

async function fetchJson(url) {
  const response = await fetch(url, { mode: "cors" });
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
    return data.cards;
  } catch (error) {
    throw ("Error drawing cards:", error);
  }
}

export async function fetchFriends(userID) {
  async function getFriendsID(userID) {
    const friendsIDSnap = await getDocs(
      query(collection(firestore, "users", userID, "friends"))
    );
    return friendsIDSnap.docs.map((doc) => doc.id);
  }

  async function getFriendsData(friendsID) {
    const friendsDataPromises = friendsID.map(async (id) => {
      const friendDataSnap = await getDocs(
        query(collection(firestore, "users"), where(documentId(), "==", id))
      );
      return friendDataSnap.docs.map((friend) => ({
        id: friend.id,
        ...friend.data(),
      }));
    });

    const friendsDataArrays = await Promise.all(friendsDataPromises);
    return friendsDataArrays.flat();
  }
  try {
    const friendsID = await getFriendsID(userID);
    const friendsWithData = await getFriendsData(friendsID);
    friendsWithData.sort((a, b) => b.highscore - a.highscore);
    return friendsWithData;
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
}

export async function getHighScore(id) {
  const q = query(
    collection(firestore, "users"),
    //todo use $id
    where(documentId(), "==", `${id}`)
  );

  let highscore;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    highscore = doc.data().highscore;
    return doc.data();
  });
  return highscore;
}
export async function setHighScore(id, score) {
  const highscore = await getHighScore(id);

  if (score > highscore) {
    const userRef = doc(firestore, "users", `${id}`);
    setDoc(userRef, { highscore: score }, { merge: true });
  }
}

export async function addFriend(userID, friendID) {
  const friendRef = doc(firestore, "users", `${friendID}`);
  const friendSnap = await getDoc(friendRef);

  try {
    if (friendSnap.exists()) {
      // add friend
      await setDoc(
        doc(firestore, "users", `${userID}`, "friends", `${friendID}`),
        {}
      );

      // watch updated list of friends
      const userFriendsList = await getDocs(
        query(collection(firestore, "users", `${userID}`, "friends"))
      );
      console.log("user friends list: ");
      userFriendsList.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such user!");
    }
  } catch (error) {
    console.log(error);
  }
}
