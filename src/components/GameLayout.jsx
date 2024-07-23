import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function GameLayout({ children }) {
  return <Outlet> {children}</Outlet>;
}
