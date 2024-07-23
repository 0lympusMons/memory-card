import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { addFriend, fetchFriends } from "../api";
import { handleGoogle, handleSignOut } from "../firebase";
import { getAuth } from "firebase/auth";
export default function Menu() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useContext(UserContext);
  const auth = getAuth();

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setLoggedIn(true);
      } else {
        setCurrentUser(null);
        setLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="menu">
      <h1>Memory Card</h1>
      <ul className="game-choices buttons-wrapper">
        <li>
          <Link to="game" className="">
            Play
          </Link>
        </li>
      </ul>

      <button onClick={loggedIn ? handleSignOut : handleGoogle}>
        {loggedIn ? "Sign Out" : "Sign In"}
      </button>
      <div className="highscores">
        {loggedIn ? <AddFriend currentUser={currentUser} /> : ""}
      </div>
    </div>
  );
}

function AddFriend({ currentUser }) {
  const [input, setInput] = React.useState();

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const [friends, setFriends] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const getUsers = async (currentUser) => {
      try {
        const usersData = await fetchFriends(currentUser?.uid);
        setFriends(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers(currentUser);
  });

  const friendsEls = friends.map((user, index) => {
    return (
      <li key={index}>
        <span>
          {index + 1}. {user.username}
        </span>{" "}
        <span>{user.highscore}</span>
      </li>
    );
  });

  function copyID() {
    navigator.clipboard.writeText(currentUser?.uid);
  }

  async function handleClick() {
    await addFriend(currentUser?.uid, input);
    forceUpdate();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div>
        <input type="text" value={currentUser?.uid} disabled />
        <button onClick={(e) => copyID(e)}>Copy ID</button>
      </div>

      <input
        type="text"
        placeholder="Enter Friend's ID"
        onChange={(e) => setInput(e.target.value)}
      />
      {/* todo
      added user successfully; user not found
      */}
      <button onClick={handleClick}>Add Friend</button>

      {friends ? <ul>{friendsEls}</ul> : ""}
    </div>
  );
}
