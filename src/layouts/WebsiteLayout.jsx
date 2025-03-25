import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Toaster } from 'react-hot-toast';

export default function WebsiteLayout() {
  return (


    <div className="website-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>


  );
}