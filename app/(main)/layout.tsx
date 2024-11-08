"use client";

import NavbarSimple from "@/components/navbar";
import { MenuItem, SidebarWithContentSeparator, SubMenuItem } from "@/components/sidebar";
import { 
  ShoppingBagIcon, 
  ChevronRightIcon,
  HomeIcon,
  ChartBarIcon,
  FolderOpenIcon,
  BellAlertIcon,
  BugAntIcon,
  HandRaisedIcon,
  BookOpenIcon,
  BookmarkSlashIcon, 
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";

const dashboard: SubMenuItem[] = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartBarIcon,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FolderOpenIcon,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: BellAlertIcon,
  },
  {
    title: "ProTrack",
    url: "/dashboard/protrack",
    icon: BugAntIcon,
  },
]

const actionStuff: MenuItem[] = [
  {
    title: "New Action",
    url: "#",
    icon: HandRaisedIcon,
    open: false,
    submenu: [
      {
        title: "Add Vehicle",
        url: "/upload/vehicle",
        icon: BookOpenIcon,
      },
      {
        title: "Create Booking",
        url: "/booking-vehicle",
        icon: BookmarkSlashIcon,
      },
      {
        title: "New Agency",
        url: "/agency",
        icon: BookmarkSquareIcon,
      },
      {
        title: "New Role",
        url: "/roles",
        icon: BookmarkSquareIcon,
      },
    ]
  },
]

const vehiclesMenuData: MenuItem[] = [
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: ShoppingBagIcon,
    open: false,
    submenu: [
      { title: "All Vehicles", url: "/vehicles/all", icon: ChevronRightIcon },
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
      { title: "All Bookings", url: "/bookings/all", icon: ChevronRightIcon },
      { title: "Active", url: "/bookings/active", icon: ChevronRightIcon },
      { title: "Canceled", url: "/bookings/canceled", icon: ChevronRightIcon },
      { title: "Completed", url: "/bookings/completed", icon: ChevronRightIcon },
      { title: "Deleted", url: "/bookings/deleted", icon: ChevronRightIcon },
    ],
  },
];

const combinedMenuData: MenuItem[] = [...vehiclesMenuData, ...bookingsMenuData, ...actionStuff];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen h-screen gap-5">
      <SidebarWithContentSeparator 
        dashboardMenu={dashboard}
        menuData={combinedMenuData} 
      />
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
