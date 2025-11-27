import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useContext(AuthContext);

  return (
    <div id="content-topbar" className="flex justify-between items-center px-4 bg-white shadow h-16">
      <div className="text-lg font-bold">Welcome {user ? user.name : "Guest"}</div>
      <div>
        {user ? <span className="text-gray-700">{user.email}</span> : null}
      </div>
    </div>
  );
}
