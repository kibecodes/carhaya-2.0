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
import { getSession } from "next-auth/react";
import { formatDataArrayDates } from "@/utils";
import debounce from "debounce";

type ActionResponse = {
  success: string;
  error?: string;
}

export const handleCompleteBooking = async (id: number): Promise<ActionResponse> => {  
  try {
    const sessionToken = await getSession();
    const token = sessionToken?.user.accessToken;

    if (!token) {
      return { error: "Authorization token missing", success: "" }; 
    }

    const response = await axios.post(`https://carhire.transfa.org/api/bookings/complete?id=${id}`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      
    );

    if (response.status === 200) {
      return { success: response.data }
      
    }
    return { error: "Failed to complete booking", success: "" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        alert(`Completing Booking failed: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Completing Booking failed: No response from server. Please try again later.');
      } else {
        console.error('Error in setup:', error.message);
        alert(`Completing Booking failed: ${error.message}`);
      }
    } else {
      console.error('Unexpected error:', error);
      alert('Completing Booking failed: An unexpected error occurred. Please try again.');
    } 
  }

  return { error: "", success: "" }
}

export const handleCancelBooking = async (id: number): Promise<ActionResponse> => {
  try {
    const sessionToken = await getSession();
    const token = sessionToken?.user.accessToken;

    if (!token) {
      return { error: "Authorization token missing", success: "" }; 
    }

    const response = await axios.post(`https://carhire.transfa.org/api/bookings/cancel?id=${id}`,{},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200) {
      return { success: response.data }
    }
    return { error: "Failed to cancel booking", success: "" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        alert(`Cancel failed: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Cancel failed: No response from server. Please try again later.');
      } else {
        console.error('Error in setup:', error.message);
        alert(`Cancel failed: ${error.message}`);
      }
    } else {
      console.error('Unexpected error:', error);
      alert('Cancel failed: An unexpected error occurred. Please try again.');
    }
  }
  return { error: "", success: "" }
}

export const handleDeleteBooking = async(id: number): Promise<ActionResponse> => {
  
  try {
    const sessionToken = await getSession();
    const token = sessionToken?.user.accessToken;

    if (!token) {
      return { error: "Authorization token missing", success: "" }; 
    }

    const response = await axios.delete(`https://carhire.transfa.org/api/bookings/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 200 || response.status === 204) {
      if (response.status === 204) {
        return { success: response.data };
      }
      return { success: response.data }
    }
    return { error: "Failed to delete booking", success: "" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        alert(`Delete failed: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Delete failed: No response from server. Please try again later.');
      } else {
        console.error('Error in setup:', error.message);
        alert(`Delete failed: ${error.message}`);
      }
    } else {
      console.error('Unexpected error:', error);
      alert('Delete failed: An unexpected error occurred. Please try again.');
    }
  }

  return { error: "", success: "" }
};


const AllBookingsTable = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Booking[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchAllBookings = () => {
    try {
      startTransition(async() => {
        const sessionToken = await getSession();
        const token = sessionToken?.user.accessToken;

        if (token) {
          const response = await axios.get('https://carhire.transfa.org/api/bookings/getall', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
  
          if (response.status === 200) {  
            setSuccess("Bookings updated successfully!");
            let bookings = response.data;

            bookings = formatDataArrayDates(bookings);
            setData(bookings);
          } else {
            setError("Bookings update failed! Try again later.");
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
    fetchAllBookings(); 

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

  const filteredAllBookings = data.filter((booking) => 
    booking.vehiclePlateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {!isMounted ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <Spinner />
        </div>
      ) : (
        <Card className="h-full w-full overflow-scroll">
          {isPending && <Spinner />}
          {success && <Alert color="green">{success}</Alert>}
          {error && <Alert color="red">{error}</Alert>}
          <CardHeader
            floated={false}
            shadow={false}
            className="mb-2 rounded-none"
          >
            <Typography variant="h4">All Bookings</Typography>
            <div className="w-full md:w-96">
              <Input
                label="Search by Plate No."
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchQuery}
                onChange={handleSearchChange}
                crossOrigin={undefined}
              />
            </div>
          </CardHeader>
          <DataTable bookings={filteredAllBookings} showActions={true} showAgency={true} />
        </Card>
      )}
    </>
  );
}

export default AllBookingsTable;
