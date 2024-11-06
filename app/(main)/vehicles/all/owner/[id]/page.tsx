import { useState, useEffect } from "react";
import {
  Breadcrumbs,
  Typography,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";
import { vehicles } from "@/data/vehicles";
import Link from "next/link";

interface OwnerProps {
  params: {
    id: string;
  };
}

const Owner = ({ params }: OwnerProps) => {
  const vehicle = vehicles.find((vehicle) => vehicle.id === params.id);

  return (
    <div className="flex flex-col gap-5 pt-5">
      <Breadcrumbs className="bg-transparent">
        <Link href="/" className="opacity-60">
          Home
        </Link>
        <span className="opacity-60">/</span>
        <a href="/pages/vehicles" className="opacity-60">
          Vehicles
        </a>
        <span className="opacity-60">/</span>
        <Typography>Owner</Typography>
      </Breadcrumbs>

      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 p-4">
          <Typography variant="h5" className="font-semibold">
            {vehicle?.owner || "Owner Details"}
          </Typography>
          <Typography variant="small" color="gray">
            mail@example.com
          </Typography>
        </CardHeader>
        <CardBody className="p-4">
          <Typography variant="h6" className="font-semibold mb-2">
            Vehicle Details
          </Typography>
          <Typography color="gray" className="mb-1">
            Make: {vehicle?.make || "N/A"}
          </Typography>
          <Typography color="gray" className="mb-1">
            Model: {vehicle?.model || "N/A"}
          </Typography>
          <Typography color="gray" className="mb-4">
            Payment per Day: ${vehicle?.pricePerDay || "N/A"}
          </Typography>
          <Typography variant="small" color="blue-gray">
            Vehicle Images
          </Typography>
        </CardBody>
        <CardFooter className="bg-gray-50 p-4 flex flex-col">
          <Typography variant="h6" className="font-semibold">
            Contact
          </Typography>
          <Typography color="gray">mail@example.com</Typography>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Owner;
