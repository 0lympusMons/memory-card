import React from "react";
import Game from "./Game";
import Menu from "./components/Menu";
import GameLayout from "./components/GameLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const UserContext = React.createContext(null);
function App() {
  const [currentUser, setCurrentUser] = React.useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          context={[currentUser, setCurrentUser]}
          element={
            <UserContext.Provider value={[currentUser, setCurrentUser]}>
              <Menu />
            </UserContext.Provider>
          }
        />

        <Route
          path="/game"
          context={[currentUser, setCurrentUser]}
          element={
            <UserContext.Provider value={[currentUser, setCurrentUser]}>
              <Game />
            </UserContext.Provider>
          }
        />
        <Route path="*" element={<h1>Page not found.</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
