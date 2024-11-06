'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, Card, CardBody, CardHeader, Typography, Alert, Button, Radio } from '@material-tailwind/react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const allStatus = ['Completed', 'Canceled'];

const BookingStatusPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const plates = searchParams.get('plates');

  if (!id) setError('Invalid booking ID');

  const bookingId = Number(id);
  const apiEndpoints: { [key: string]: string } = {
    complete: `https://carhire.transfa.org/api/bookings/complete?id=${bookingId}`,
    cancel: `https://carhire.transfa.org/api/bookings/cancel?id=${bookingId}`,
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!selectedStatus) {
      setError('Please select a status before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const sessionToken = await getSession();
      const token = sessionToken?.user.accessToken;
      if (token) {
        const response = await axios.post(
          apiEndpoints[selectedStatus],
          { status: selectedStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setSuccessMessage(response.data);
      }
    } catch (error) {
      setError(`Error updating booking status: ${error || 'Something went wrong.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        router.back();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [router, successMessage]);

  const handleCancel = () => {
    setSelectedStatus(null);
    setError(null);
    setSuccessMessage(null);
    router.back();
  };

  return (
    <div className="pt-5 space-y-3">
      <Breadcrumbs separator="›">
        <Link href="/" className="text-blue-500">Home</Link>
        <a href="/bookings" className="text-blue-500">Bookings</a>
        <span className="text-gray-500">Set Booking Status</span>
      </Breadcrumbs>
      <Card className="w-full">
        <CardHeader variant="gradient" color="blue" className="mb-4">
          <Typography variant="h5" color="white">
            Set Booking Status
          </Typography>
          <Typography>
            You are setting the status for <strong>Booking {id}</strong> (Plate No: <strong>{plates}</strong>).
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-5">
            {allStatus.map((status, idx) => (
              <Radio
                key={idx}
                color="blue"
                id={`status-${idx}`}
                name="status"
                label={status}
                value={status}
                checked={selectedStatus === status}
                onChange={() => {
                  setSelectedStatus(status);
                  setError(null);
                }}
                crossOrigin={undefined}
              />
            ))}
            {error && (
              <Alert color="red" className="mt-4">
                {error}
              </Alert>
            )}
            {successMessage && (
              <Alert color="green" className="mt-4">
                {successMessage}
              </Alert>
            )}
            <div className="flex justify-between mt-4">
              <Button onClick={handleSubmit} disabled={isSubmitting} color="blue">
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
              <Button variant="outlined" onClick={handleCancel} color="blue">
                Cancel
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingStatusPage;
