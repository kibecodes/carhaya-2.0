"use client"

import { useEffect, useState, useTransition } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  Input,
  CardHeader,
  Spinner,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Vehicle } from "@/types";
import axios from "axios"; 
import { Alert } from "@material-tailwind/react";
import DataTable from "../components/data-table";
import { getSession } from "next-auth/react";
import debounce from "debounce";

 
const ActiveTable = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Vehicle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const fetchActiveVehicles = () => {
    try {
      startTransition(async() => {
        const sessionToken = await getSession();
        const token = sessionToken?.user.accessToken;

        if (token) {
          const response = await axios.get('https://carhire.transfa.org/api/vehicles/active',
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
        }
        return;
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            console.error('Unauthorized (401) error. Redirecting to login.');
            alert('Session expired. Redirecting to login page.');
          } else {
            console.error('Error response from server:', error.response.data);
            alert(`Fetching failed: ${error.response.data.message}`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('Fetching failed: No response from server. Please try again later.');
        } else {
          console.error('Error in setup:', error.message);
          alert(`Fetching failed: ${error.message}`);
        }
      } else {
        console.error('Unexpected error:', error);
        alert('Fetching failed: An unexpected error occurred. Please try again.');
      }
    }
  }

  useEffect(() => {
    setIsMounted(true); 
    fetchActiveVehicles(); 

    return () => {
      setIsMounted(false); 
    };
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

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
  }, 100);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }

  const filteredActiveVehicles = data.filter((vehicle) => 
    vehicle.vehiclePlateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {!isMounted ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <Spinner />
        </div>
      ) : (
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
            <Typography variant="h4">Active Vehicles</Typography>
            <div className="flex flex-row w-full md:w-96 items-center">
              <Input
                label="Search by Plate No."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={handleSearchChange}
                crossOrigin={undefined}
              />
              <Button 
                variant="outlined" 
                className="flex items-center gap-3"
                onClick={fetchActiveVehicles}
              >
                Refresh
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <DataTable vehicles={filteredActiveVehicles} showActions={true} basePath="active"/>
        </Card>
      )}
    </>
  );
}

export default ActiveTable;