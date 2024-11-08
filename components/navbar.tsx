"use client"

import React from "react";
import {
  Navbar,
  Collapse,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon,ArrowRightEndOnRectangleIcon, SunIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react" 

const NavList = () => {
  const handleLogout = async() => {
        
    await signOut({
        redirectTo: "/login"
    });
    
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");

  }

  return (
    <ul className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-6">
      <ArrowRightEndOnRectangleIcon 
        className="h-5 w-5 cursor-pointer" 
        onClick={handleLogout}
      />
      <SunIcon className="h-5 w-5 cursor-pointer" />
    </ul>
  );
}
 
const NavbarSimple = () => {
  const [openNav, setOpenNav] = React.useState(false);
 
  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);
 
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
 
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
 
  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3">
      <div className="flex items-center justify-between w-full text-blue-gray-900">
        {/* Placeholder for the logo or left-aligned content */}
        <div className="text-lg font-semibold">logo</div>

        <div className="ml-auto hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}

export default NavbarSimple;