import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function LibraryLayout({ children }) {
  return (
    <div id="wrapper" className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div id="content-wrapper" className="flex-1 flex flex-col">
        <Topbar />
        <div className="container-fluid p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
