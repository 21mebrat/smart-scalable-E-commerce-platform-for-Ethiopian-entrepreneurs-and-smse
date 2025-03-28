import React from "react";

// components

import Navbar from "../components/Navbars/AuthNavbar.js";
import FooterSmall from "../components/Footers/FooterSmall.js";

export default function Auth({ children }) {
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          {/* <div
            className="absolute top-0 -z-10 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage: "url('/img/register_bg_2.png')",
            }}
          >
            
          </div> */}
          <main className="min-w-full flex justify-center items-center">
            {children}
          </main>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
