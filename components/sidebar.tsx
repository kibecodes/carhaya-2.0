"use client";

import React, { useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronRightIcon, ChevronDownIcon, Cog6ToothIcon, PowerIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link"; 

export interface SubMenuItem {
  title: string;
  url: string;
  icon: React.ElementType
}

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType
  open: boolean;
  submenu: SubMenuItem[];
}

interface SidebarProps {
  menuData: MenuItem[];
}

export function SidebarWithContentSeparator({ menuData }: SidebarProps) {
  const [open, setOpen] = useState<number | null>(null);

  const handleOpen = (index: number) => {
    setOpen(open === index ? null : index);
  };

  return (
     <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Sidebar
        </Typography>
      </div>
      <List>
        {menuData.map((item, index) => (
          <Accordion
            key={index}
            open={open === index}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === index ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === index}>
              <AccordionHeader onClick={() => handleOpen(index)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <item.icon className="h-5 w-5" />
                </ListItemPrefix>
                <Typography color="blue-gray" className="mr-auto font-normal">
                  {item.title}
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                {item.submenu.map((subItem, subItemIndex) => (
                  <Link href={subItem.url} key={subItemIndex}>
                    <ListItem>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                      </ListItemPrefix>
                      {subItem.title}
                    </ListItem>
                  </Link>
                ))}
              </List>
            </AccordionBody>
          </Accordion>
        ))}

         <ListItem>
          <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              Profile
            </ListItem>
            <ListItem>
              <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
      </List>
    </Card>
  );
}

