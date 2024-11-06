"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Breadcrumbs, Button, Radio, Alert } from "@material-tailwind/react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const allStatus = ["activate", "deactivate", "maintenance"];

const VehicleStatusPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();
  
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const vehicleId = Number(id);
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const plateNumber = searchParams.get("plateNumber");

  const apiEndpoints: { [key: string]: string } = {
    activate: `https://carhire.transfa.org/api/vehicles/activate?id=${vehicleId}`, 
    deactivate: `https://carhire.transfa.org/api/vehicles/deactivate?id=${vehicleId}`,
    maintenance: `https://carhire.transfa.org/api/vehicles/maintenance?id=${vehicleId}`,
  };

  const handleSubmit = async () => {
    setError(null); 
    setSuccessMessage(null); 

    if (!selectedStatus) {
      setError("Please select a status before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      const sessionToken = await getSession();
      const token = sessionToken?.user.accessToken;
      if (token) {
        const response = await axios.post(apiEndpoints[selectedStatus], 
          {
            status: selectedStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );
        setSuccessMessage(response.data);
      }
    } catch (error: unknown) {
      setError(`Error updating vehicle status: ${error || "Something went wrong."}`);
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
      <Breadcrumbs>
        <Link href="/" className="opacity-60 hover:opacity-100">Home</Link>
        <a href="/pages/vehicles" className="opacity-60 hover:opacity-100">Vehicles</a>
        <span className="opacity-60">... {model} {make}</span>
      </Breadcrumbs>

      <Card className="w-full">
        <CardHeader color="blue-gray" className="pb-2">
          <Typography variant="h5">Set Vehicle Status</Typography>
          <Typography variant="small" className="text-gray-700">
            You are setting the status for{" "}
            <strong>{model} {make}</strong> (Plate No: <strong>{plateNumber}</strong>).
          </Typography>
        </CardHeader>

        <CardBody>
          <div className="grid grid-cols-1 gap-5">
            <div>
              {allStatus.map((status, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Radio
                    id={`status-${idx}`}
                    name="status"
                    label={status}
                    checked={selectedStatus === status}
                    onChange={() => {
                      setSelectedStatus(status);
                      setError(null); 
                    }}
                    color="blue"
                    crossOrigin={undefined}
                  />
                </div>
              ))}
            </div>

            {error && (
              <Alert color="red">
                <Typography variant="h6">Error</Typography>
                <Typography>{error}</Typography>
              </Alert>
            )}

            {successMessage && (
              <Alert color="green">
                <Typography variant="h6">Success</Typography>
                <Typography>{successMessage}</Typography>
              </Alert>
            )}

            <div>
              <CardFooter className="flex justify-between">
                <Button onClick={handleSubmit} disabled={isSubmitting} color="blue">
                  {isSubmitting ? "Submitting..." : "Update Status"}
                </Button>
                <Button variant="outlined" onClick={handleCancel} color="blue-gray">Cancel</Button>
              </CardFooter>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default VehicleStatusPage;
