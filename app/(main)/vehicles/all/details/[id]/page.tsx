"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@material-tailwind/react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { Vehicle } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";

export interface VehicleProps {
  params: {
    id: number;
  };
}

export const fetchVehicleById = async (id: number) => {
  try {
    const token = await getSession();
    if (token) {
      const response = await axios.get(
        `https://carhire.transfa.org/api/vehicles/getbyid/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token.user.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch vehicle");
      }
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        alert(`Fetching failed: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("Fetching failed: No response from server. Please try again later.");
      } else {
        console.error("Error in setup:", error.message);
        alert(`Fetching failed: ${error.message}`);
      }
    } else {
      console.error("Unexpected error:", error);
      alert("Fetching failed: An unexpected error occurred. Please try again.");
    }
  }
};

const VehicleDetails = ({ params }: VehicleProps) => {
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVehicle = async () => {
      try {
        const data = await fetchVehicleById(params.id);

        if (data) {
          const formattedUnitCost = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
          }).format(data.unitCostPerDay);

          setVehicle({ ...data, unitCostPerDay: formattedUnitCost });
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    getVehicle();
  }, [params.id]);

  return (
    <div className="flex flex-col gap-5 pt-5">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
        </div>
      )}

      <Breadcrumbs>
        <Link href="/" className="opacity-60">
          Home
        </Link>
        <a href="#" className="opacity-60">
          ...
        </a>
        <span>Vehicle Details</span>
      </Breadcrumbs>

      <Card>
        <CardHeader color="blue-gray" className="text-center">
          <Typography variant="h5">{vehicle?.agencyName}</Typography>
          <Typography variant="small">Vehicle Information</Typography>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-5">
          <div>
            <Card className="mb-4">
              <CardHeader>
                <Typography variant="h6">Plate No. {vehicle?.vehiclePlateNumber}</Typography>
              </CardHeader>
              <CardBody>
                {/* Carousel replacement */}
                <div className="flex overflow-x-auto gap-3">
                  {[
                    vehicle?.vehicleFrontImage,
                    vehicle?.vehicleBackImage,
                    vehicle?.vehicleSideImage,
                    vehicle?.vehicleInteriorFrontImage,
                    vehicle?.vehicleInteriorBackImage,
                  ].map((src, index) => (
                    <div key={index} className="w-40 h-40 relative">
                      {src && (
                        <Image
                          src={src}
                          alt={`Vehicle Image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Typography variant="h6">User Info</Typography>
              </CardHeader>
              <CardBody>
                <Typography>Email: {}</Typography>
                <Typography>Address: {}</Typography>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6">Payment Details</Typography>
              </CardHeader>
              <CardBody>
                <Typography>Unit cost per day: {vehicle?.unitCostPerDay}</Typography>
                <Typography>
                  Payment Option: <span className="font-bold">M-Pesa</span>
                </Typography>
              </CardBody>
              <CardFooter>
                <Typography variant="small" className="text-gray-500">
                  Invoice #123456
                </Typography>
              </CardFooter>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default VehicleDetails;
