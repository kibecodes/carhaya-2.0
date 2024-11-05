"use client";

import NavbarSimple from "@/components/navbar";
import { MenuItem, SidebarWithContentSeparator } from "@/components/sidebar";
import { ShoppingBagIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const vehiclesMenuData: MenuItem[] = [
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: ShoppingBagIcon,
    open: false,
    submenu: [
      { title: "Booked", url: "/vehicles/booked", icon: ChevronRightIcon },
      { title: "Active", url: "/vehicles/active", icon: ChevronRightIcon },
      { title: "Inactive", url: "/vehicles/inactive", icon: ChevronRightIcon },
      { title: "Deleted", url: "/vehicles/deleted", icon: ChevronRightIcon },
      { title: "Under Maintenance", url: "/vehicles/maintenance", icon: ChevronRightIcon },
    ],
  },
];

const bookingsMenuData: MenuItem[] = [
  {
    title: "Bookings",
    url: "/bookings",
    icon: ShoppingBagIcon,
    open: false,
    submenu: [
      { title: "All Bookings", url: "/bookings/all-bookings", icon: ChevronRightIcon },
      { title: "Active", url: "/bookings/active", icon: ChevronRightIcon },
      { title: "Canceled", url: "/bookings/canceled", icon: ChevronRightIcon },
      { title: "Completed", url: "/bookings/completed", icon: ChevronRightIcon },
      { title: "Deleted", url: "/bookings/deleted", icon: ChevronRightIcon },
    ],
  },
];

const combinedMenuData: MenuItem[] = [...vehiclesMenuData, ...bookingsMenuData];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen h-screen gap-5">
      <SidebarWithContentSeparator menuData={combinedMenuData} />
      <div className="flex flex-col flex-1 h-full px-0 overflow-y-auto pt-0 gap-5">
        <NavbarSimple />
        <div className="flex-1 md:max-w-[screen] w-full p-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
