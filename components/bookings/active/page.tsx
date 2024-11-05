"use client"

import { useEffect, useState, useTransition } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  Input,
  CardHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { Booking } from "@/types";
import axios from "axios"; 
import { Alert } from "@material-tailwind/react";
import DataTable from "../components/data-table";

 
const ActiveTable = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Booking[]>([]);

  const fetchActiveBookings = () => {
    try {
      startTransition(async() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxNDZiZDIxOS1mMDk1LTQ4NmItOWVkMy1kMzczM2UxMzEwMzQiLCJlbWFpbCI6ImpvbmF0aGFuQGdtYWlsLmNvbSIsInN1YiI6ImpvbmF0aGFuQGdtYWlsLmNvbSIsImp0aSI6IjFhYTQyOTk0LWFkMzUtNGI5MC1iNmZjLTZkMTM0ODNhM2JiZCIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczMDgwNTExNCwiZXhwIjoxNzMwODA2OTE0LCJpYXQiOjE3MzA4MDUxMTR9.nBxfw77OAbqBRBGH6uy9LSCwda28UZR7SgmtsIVfUUw"
        const response = await axios.get('https://carhire.transfa.org/api/bookings/active',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.status === 200) {  
          setSuccess("Bookings updated successfully!");
          setData(response.data);
        } else {
          setError("Bookings update failed! Try again later.")
        }
      });
    } catch (error) {
       if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 401) {
                        // Redirect to login page to get a new accessToken
                        console.error('Unauthorized (401) error. Redirecting to login.');
                        alert('Session expired. Redirecting to login page.');
                    } else {
                        console.error('Error response from server:', error.response.data);
                        alert(`Fetching failed: ${error.response.data.message}`);
                    }
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('No response received:', error.request);
                    alert('Fetching failed: No response from server. Please try again later.');
                } else {
                    // Error setting up the request
                    console.error('Error in setup:', error.message);
                    alert(`Fetching failed: ${error.message}`);
                }
            } else {
                // Generic error (non-Axios)
                console.error('Unexpected error:', error);
                alert('Fetching failed: An unexpected error occurred. Please try again.');
            }
      
    }
  }

  useEffect(() => {
    fetchActiveBookings();
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
    <Card className="h-full w-full overflow-scroll">
      {isPending && (
        <Spinner />
      )}
      {success && (
        <Alert color="green">{success}</Alert>
      )}
      {error && (
        <Alert color="red">{error}</Alert>
      )}
      <CardHeader
        floated={false}
        shadow={false}
        className="mb-2 rounded-none p-2"
      >
        <Typography variant="h4">Active Bookings</Typography>
        <div className="w-full md:w-96">
          <Input
            label="Search Booking"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            crossOrigin={undefined}
          />
        </div>
      </CardHeader>
      <DataTable bookings={data} showActions={true} showAgency={true} />
    </Card>
  );
}

export default ActiveTable;