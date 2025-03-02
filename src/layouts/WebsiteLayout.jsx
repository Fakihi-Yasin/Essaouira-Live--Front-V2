import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

export default function WebsiteLayout() {
  return (
    <div className="website-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}