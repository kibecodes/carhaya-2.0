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
import { Vehicle } from "@/types";
import axios from "axios"; 
import { Alert } from "@material-tailwind/react";
import DataTable from "../components/data-table";

 
const MaintenanceTable = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Vehicle[]>([]);

  const fetchMaintenanceVehicles = () => {
    try {
      startTransition(async() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxNDZiZDIxOS1mMDk1LTQ4NmItOWVkMy1kMzczM2UxMzEwMzQiLCJlbWFpbCI6ImpvbmF0aGFuQGdtYWlsLmNvbSIsInN1YiI6ImpvbmF0aGFuQGdtYWlsLmNvbSIsImp0aSI6ImY0MDY0MTczLWE4YmQtNGZmYS05MGE2LTBlM2I2ZDk1NGYzMSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczMDc0ODE2MSwiZXhwIjoxNzMwNzQ5OTYxLCJpYXQiOjE3MzA3NDgxNjF9.jz-s4s7sXxm_ItTQz7kXBqmC70VnY-DG77tEVfNAh30"
        const response = await axios.get('https://carhire.transfa.org/api/vehicles/under/maintenance',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
  
        if (response.status === 200) {  
          setSuccess("Vehicles updated successfully!");
          setData(response.data);
        } else {
          setError("Vehicles update failed! Try again later.")
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
    fetchMaintenanceVehicles();
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
        <Typography variant="h4">Vehicles Under Maintenance</Typography>
        <div className="w-full md:w-96">
          <Input
            label="Search Booking"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            crossOrigin={undefined}
          />
        </div>
      </CardHeader>
      <DataTable vehicles={data} showActions={true} />
    </Card>
  );
}

export default MaintenanceTable;