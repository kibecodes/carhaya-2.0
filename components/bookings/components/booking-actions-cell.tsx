"use client"

import { useRefreshAfterCancel, useRefreshAfterComplete, useRefreshAfterDelete } from '@/hooks/refresh';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Alert, Spinner } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Booking } from '@/types';
import * as z from "zod";
import { useState, useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { handleCancelBooking, handleDeleteBooking, handleCompleteBooking } from '../all/page';

interface ActionsCellProps {
  booking: Booking;
}

const schema = z.object({
  newPlates: z.string().min(1, { message: 'Enter new number plates' }),
})

const BookingActionsCell: React.FC<ActionsCellProps> = ({ booking }) => {
    const { deleteById, isDeleting } = useRefreshAfterDelete();
    const { cancelById, isCanceling } = useRefreshAfterCancel();
    const { completeById, isCompleting } = useRefreshAfterComplete();

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [newPlates, setNewPlates] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            newPlates: "",
        },
    });

    const onSubmit = (values: z.infer<typeof schema>) => {
    const validatedFields = schema.safeParse(values);

    if(!validatedFields.success) {
      setError("Invalid Fields!")
      return;
    }

    const { newPlates } = validatedFields.data;

    startTransition(async() => {
      try {
        setError("");
        setSuccess("");
        const token = ""

        if (token) {
          const response = await axios.post(
            `https://carhire.transfa.org/api/bookings/re-assign/vehicle?id=${booking.id}&plateNumber=${newPlates}`,{},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          if (response.status === 200) {
            setSuccess(response.data);
            setError("");
            setDialogOpen(false);
          } else {
            setError("Error re-assigning vehicle! Please try again later.");
            setSuccess("");
          }
        }

      } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.error('Error response from server:', error.response.data);
              alert(`Fetching failed: ${error.response.data.message}`);
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
    })
  }

    const handleCancel = () => {
        form.reset();
        setError("");
        setSuccess("");
        setDialogOpen(false);
    }


    return (  
        <div className='flex space-x-2'>
            {isPending && (
                <Spinner />
            )}
            {error && (
                <Alert color='red'>{error}</Alert>
            )}
            {success && (
                <Alert color='green'>{success}</Alert>
            )}
             <Button
                variant="filled"
                color="purple"
                onClick={() => setDialogOpen(true)}
            >
                Re-assign New Vehicle
            </Button>
            <Dialog open={isDialogOpen} handler={setDialogOpen}>
                <DialogHeader>Re-assign Vehicle</DialogHeader>
                <DialogBody>
                    <div className="mb-4">
                        <label className="block text-gray-700">Current Vehicle Plate</label>
                        <Input
                            value={booking.vehiclePlateNumber}
                            readOnly
                            disabled
                            className="bg-gray-200 mt-1"
                            crossOrigin={undefined}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">New Vehicle Number Plates</label>
                        <Input
                            placeholder="Enter new vehicle Plates"
                            value={newPlates}
                            onChange={(e) => setNewPlates(e.target.value)}
                            crossOrigin={undefined}
                        />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="outlined"
                        color="red"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="filled"
                        color="green"
                        onClick={form.handleSubmit(onSubmit)}
                    >
                        Re-assign
                    </Button>
                </DialogFooter>
            </Dialog>

            <Button
                className=' hover:bg-red-600'
                onClick={() => cancelById(booking.id, handleCancelBooking)}
                disabled={isCanceling}
            >
                {isCanceling ? "Canceling..." : "Cancel"}
            </Button>

            <Button
                className="text-white hover:bg-red-600"
                onClick={() => deleteById(booking.id, handleDeleteBooking, "Booking")}
                disabled={isDeleting} 
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>

            <Button
                className="text-white bg-green-400 hover:bg-green-600"
                onClick={() => completeById(booking.id, handleCompleteBooking)}
                disabled={isCompleting}
            >
                {isCompleting ? "Completing..." : "Complete"}
            </Button>
        </div>
    );
}
 
export default BookingActionsCell;