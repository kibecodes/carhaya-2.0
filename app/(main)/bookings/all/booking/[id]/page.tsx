"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { Booking } from "@/types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { formatDataDates } from "@/utils";

interface BookingProps {
  params: {
    id: number;
  };
}

const fetchBookingById = async (id: number) => {
  try {
    const token = await getSession();
    if (token) {
      const response = await axios.get(
        `https://carhire.transfa.org/api/bookings/getbyid/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token.user.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch booking");
      }
      return response.data;
    }
  } catch (error) {
    console.log("Error", error);
  }
};

const BookingDetails = ({ params }: BookingProps) => {
  const [booking, setBooking] = useState<Booking>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBooking = async () => {
      try {
        let data = await fetchBookingById(params.id);

        if (data) {
          data = formatDataDates(data);

          const formattedTotalCost = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
          }).format(data.totalCost);

          const formattedData = {
            ...data,
            totalCost: formattedTotalCost,
          };

          setBooking(formattedData);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };

    getBooking();
  }, [booking?.totalCost, params.id]);

  return (
    <div className="flex flex-col gap-5 pt-5">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
        </div>
      )}
      <Breadcrumbs separator="›">
        <Typography as="a" href="/" variant="small" className="text-gray-500">
          Home
        </Typography>
        <Typography as="a" href="" variant="small" className="text-gray-500">
          ...
        </Typography>
        <Typography variant="small" className="text-gray-500">
          Booking Details
        </Typography>
      </Breadcrumbs>

      <Card>
        <CardHeader color="blue-gray" className="text-lg font-semibold">
          {booking?.agencyName}
        </CardHeader>
        <CardBody>
          <Typography variant="h6">Booking Information</Typography>
          <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-5">
            <Card className="shadow-sm">
              <CardHeader className="text-lg font-semibold">
                Vehicle Hire Duration
              </CardHeader>
              <CardBody>
                <Typography>Start: {booking?.startDate}</Typography>
                <Typography>End: {booking?.endDate}</Typography>
                <Typography>
                  Duration: {booking?.duration} day(s)
                </Typography>
                <Typography>
                  Unit cost per day: {booking?.unitCostPerDay}
                </Typography>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="text-lg font-semibold">
                Payment Status: {booking?.paymentStatus}
              </CardHeader>
              <CardBody>
                <Typography>Amount Due: {booking?.totalCost}</Typography>
                <Typography>
                  Payment Method: <span className="font-bold">M-Pesa</span>
                </Typography>
                <Typography className="text-sm text-gray-500">
                  Invoice #123456
                </Typography>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingDetails;
