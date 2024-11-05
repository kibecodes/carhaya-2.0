'use client';

import { useState, useTransition, useEffect } from "react";
import { Button, Card, CardBody, Input, Typography, Alert } from "@material-tailwind/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas"; 

const CreateAgencyPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setError("");
    setSuccess("");

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      setError("Invalid fields!");
      return;
    }
    startTransition(() => {
      setSuccess("Agency created successfully!");
    });
  }

  return (
    <Card className="w-full max-w-[24rem] mx-auto">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4 font-bold text-center">
          Create Agency Account
        </Typography>
        <Typography variant="small" color="gray" className="mb-6 text-center">
          Enter your details below to create your account.
        </Typography>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Agency Name
            </Typography>
            <Input
              type="text"
              placeholder="ABC Motors"
              {...form.register("name")}
              disabled={isPending}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              crossOrigin={undefined}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Email
            </Typography>
            <Input
              type="email"
              placeholder="mail@example.com"
              {...form.register("email")}
              disabled={isPending}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              crossOrigin={undefined}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Business Phone
            </Typography>
            <Input
              type="tel"
              placeholder="123456789"
              {...form.register("phone")}
              disabled={isPending}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              crossOrigin={undefined}
            />
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
              Office Location
            </Typography>
            <Input
              type="text"
              placeholder="123rd Street"
              {...form.register("location")}
              disabled={isPending}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              crossOrigin={undefined}
            />
          </div>

          {error && (
            <Alert color="red" className="mt-4">
              <span>{error}</span>
            </Alert>
          )}
          {success && (
            <Alert color="green" className="mt-4">
              <span>{success}</span>
            </Alert>
          )}

          <Button type="submit" size="lg" disabled={isPending} className="mt-4">
            Submit
          </Button>
          <Typography
            variant="small"
            color="gray"
            className="mt-2 flex items-center justify-center gap-2 font-medium opacity-60"
          >
            <LockClosedIcon className="h-4 w-4" /> Your information is secure and encrypted
          </Typography>
        </form>
      </CardBody>
    </Card>
  );
};

export default CreateAgencyPage;
