"use client"

import { useEffect, useState, useTransition } from "react";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  Input,
  Checkbox,
  CardHeader,
  IconButton,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { Vehicle } from "@/types";
import axios from "axios"; 
import { Alert } from "@material-tailwind/react";

const TABLE_HEAD = [
  {
    head: "Plate No.",
    icon: <Checkbox crossOrigin={undefined} />,
  },
  {
    head: "Vehicle Make",
  },
  {
    head: "Vehicle Type",
  },
  {
    head: "Year of Manufacture",
  },
  {
    head: "Body Type",
  },
  {
    head: "Status"
  },
  {
    head: "Engine Capacity"
  },
  {
    head: "Price Per Day"
  }
];
 
const TableWithSearch = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Vehicle[]>([]);

  const fetchActiveVehicles = () => {
    try {
      startTransition(async() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiIxNDZiZDIxOS1mMDk1LTQ4NmItOWVkMy1kMzczM2UxMzEwMzQiLCJlbWFpbCI6ImpvbmF0aGFuQGdtYWlsLmNvbSIsInN1YiI6ImpvbmF0aGFuQGdtYWlsLmNvbSIsImp0aSI6ImY0MDY0MTczLWE4YmQtNGZmYS05MGE2LTBlM2I2ZDk1NGYzMSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczMDc0ODE2MSwiZXhwIjoxNzMwNzQ5OTYxLCJpYXQiOjE3MzA3NDgxNjF9.jz-s4s7sXxm_ItTQz7kXBqmC70VnY-DG77tEVfNAh30"
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
        <div className="w-full md:w-96">
          <Input
            label="Search Booking"
            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            crossOrigin={undefined}
          />
        </div>
      </CardHeader>
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map(({ head, icon }) => (
              <th key={head} className="border-b border-gray-300 p-4">
                <div className="flex items-center gap-1">
                  {icon}
                  <Typography
                    color="blue-gray"
                    variant="small"
                    className="!font-bold"
                  >
                    {head}
                  </Typography>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((vehicle) => {
              const classes = "p-4 border-b border-gray-300";
 
              return (
                <tr key={vehicle.id}>
                  <td className={classes}>
                    <div className="flex items-center gap-1">
                      <Checkbox crossOrigin={undefined}/>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold"
                      >
                        {vehicle.vehiclePlateNumber}
                      </Typography>
                    </div>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.vehicleMake}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.vehicleType}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.vehicleYearOfManufacture}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.vehicleBodyType}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.isVehicleActive ? "Active" : "Inactive"}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.vehicleEngineCapacity}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      className="font-normal text-gray-600"
                    >
                      {vehicle.unitCostPerDay}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <div className="flex items-center gap-2">
                      <IconButton variant="text" size="sm">
                        <DocumentIcon className="h-4 w-4 text-gray-900" />
                      </IconButton>
                      <IconButton variant="text" size="sm">
                        <ArrowDownTrayIcon
                          strokeWidth={3}
                          className="h-4 w-4 text-gray-900"
                        />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </Card>
  );
}

export default TableWithSearch;