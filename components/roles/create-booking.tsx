"use client";

import React, { useTransition, useState, useEffect } from "react";
import { Card, CardBody, CardFooter, CardHeader, Typography, Button, Drawer, Carousel, Spinner, Collapse, Alert } from "@material-tailwind/react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import axios from "axios";
import type { Vehicle } from "@/types";
import dayjs from "dayjs";
import DatePickerWithRange from "@/utils/date-range-picker";

const handleAxiosError = (error: unknown) => {
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
};

const BookingCards = () => {
  const [isPending] = useTransition();
  const [data, setData] = useState<Vehicle[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const openDrawer = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVehicle(null);
  };

  useEffect(() => {
    const fetchActiveVehicles = async () => {
      try {
        const sessionToken = await getSession();
        const token = sessionToken?.user.accessToken;
        if (token) {
          const response = await axios.get('https://carhire.transfa.org/api/vehicles/active', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          if (response.status === 200) {
            setSuccess("Vehicles updated successfully!");
            const vehicles = response.data;
            setData(vehicles);
          } else {
            setError("Vehicles update failed! Try again later.");
          }
        }
        return;
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchActiveVehicles();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="grid grid-cols-2 gap-10 p-5">
      {isPending && (
        <Spinner />
      )}
      {data.map((vehicle) => (
        <Card key={vehicle.id} onClick={() => openDrawer(vehicle)} className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <Typography variant="h6">{vehicle.vehicleMake} {vehicle.vehicleType}</Typography>
          </CardHeader>
          <CardBody>
            <Image
              src={vehicle.vehicleFrontImage}
              width={150}
              height={150}
              alt="Vehicle Front Image"
              className="object-cover"
            />
          </CardBody>
          <CardFooter>
            <Typography>{`Cost per day: ${vehicle.unitCostPerDay} KES`}</Typography>
          </CardFooter>
        </Card>
      ))}

      {isDrawerOpen && (
        <VehicleDrawer vehicle={selectedVehicle} onClose={closeDrawer} />
      )}
    </div>
  );
};

interface VehicleDrawerProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

const VehicleDrawer = ({ vehicle, onClose }: VehicleDrawerProps) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isStartDateOpen, setStartDateOpen] = useState(false);
  const [isEndDateOpen, setEndDateOpen] = useState(false);

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const calculateTotalCost = () => {
    if (!startDate || !endDate || !vehicle) return 0;
    const days = dayjs(endDate).diff(dayjs(startDate), "day") + 1;
    return days * vehicle.unitCostPerDay;
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || !vehicle) {
      setError("Please select a date range and vehicle.");
      return;
    }

    try {
      const sessionToken = await getSession();
      const token = sessionToken?.user.accessToken;

      if (token) {
        const bookingData = {
          startDate,
          endDate,
          vehiclePlateNumber: vehicle?.vehiclePlateNumber,
          unitCostPerDay: vehicle?.unitCostPerDay,
          totalCost: calculateTotalCost(),
          agencyName: vehicle?.agencyName,
        };

        const response = await axios.post('https://carhire.transfa.org/api/bookings/create', bookingData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.status === 201) {
          setSuccess("Booking successful!");
        } else {
          setError("Booking failed. Please try again.");
        }
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <Drawer open={Boolean(vehicle)} onClose={onClose} size={550} className="grid grid-cols-2 gap-5 p-5 max-h-screen overflow-y-auto" placement="bottom">
       {success && (
        <Alert color="green" className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
          {success}
        </Alert>
      )}
      {error && (
        <Alert color="red" className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
          {error}
        </Alert>
      )}
      <div className="mb-4">
        <Typography variant="h4">{vehicle?.vehicleMake} {vehicle?.vehicleType}</Typography>
        <Typography>{vehicle?.vehiclePlateNumber}</Typography>

        <Carousel className="rounded-none">
          <Image src={vehicle?.vehicleFrontImage ?? ""} alt="Front view" width={150} height={150} className="h-96 w-full object-cover"/>
          <Image src={vehicle?.vehicleSideImage ?? ""} alt="Side view" width={150} height={150} className="h-96 w-full object-cover"/>
          <Image src={vehicle?.vehicleBackImage ?? ""} alt="Back view" width={150} height={150} className="h-96 w-full object-cover"/>
          <Image src={vehicle?.vehicleInteriorFrontImage ?? ""} alt="Front interior view" width={150} height={150} className="h-96 w-full object-cover"/>
          <Image src={vehicle?.vehicleInteriorBackImage ?? ""} alt="Back interior view" width={150} height={150} className="h-96 w-full object-cover"/>
        </Carousel>
      </div>

      <div>
        <div className="flex flex-row">
          <div className="mb-4">
            <Button onClick={() => setStartDateOpen(!isStartDateOpen)}>
              {`Start Date: ${startDate.toLocaleDateString()}`}
            </Button>
            <Collapse open={isStartDateOpen}>
              <DatePickerWithRange
                label="Select Start Date"
                selectedDate={startDate}
                onSelect={setStartDate}
              />
            </Collapse>        
          </div>

          <div className="mb-4">
            <Button onClick={() => setEndDateOpen(!isEndDateOpen)}>
              {`End Date: ${endDate.toLocaleDateString()}`}
            </Button>
            <Collapse open={isEndDateOpen}>
              <DatePickerWithRange
                label="Select End Date"
                selectedDate={endDate}
                onSelect={setEndDate}
              />
            </Collapse>
          </div>
        </div>

        <div className="mt-4">
          <Typography>Availability: Available</Typography>
          <Typography>Unit Cost Per Day: {vehicle?.unitCostPerDay}</Typography>
          <Typography>Total Cost: {calculateTotalCost()}</Typography>
          <Typography>Specifications: Compact, 5-seater, SUV</Typography>
          <Typography>Features: GPS, air conditioning, USB charging ports</Typography>
        </div>

        <div className="mt-10">
          <Card className="mb-5">
            <CardHeader>
              <Typography variant="h6">Booking Preview</Typography>
            </CardHeader>
            <CardBody>
              <Typography>{`Start Date: ${startDate.toLocaleDateString()}`}</Typography>
              <Typography>{`End Date: ${endDate.toLocaleDateString()}`}</Typography>
              <Typography>{`Cost Per Day: ${vehicle?.unitCostPerDay}`}</Typography>
              <Typography>{`Total Days: ${dayjs(endDate).diff(dayjs(startDate), "day") + 1}`}</Typography>
              <Typography>{`Total Cost: ${calculateTotalCost()} KES`}</Typography>
            </CardBody>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 mt-0">
          <Button onClick={handleBooking}>Book Now</Button>
          <Button variant="text" onClick={onClose}>Close</Button>
        </div>

      </div>

    </Drawer>
  );
};

export default BookingCards;
