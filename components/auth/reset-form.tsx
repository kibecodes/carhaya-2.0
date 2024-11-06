'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardBody, CardHeader, Typography, Alert, Button, Input } from '@material-tailwind/react';
import { reset } from '@/actions/reset';
import { useTransition, useState } from 'react';
import Link from 'next/link';

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
});

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      reset(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .then(() => form.reset())
        .catch((error: unknown) => console.log('error', error));
    });
  };

  return (
    <Card>
      <CardHeader variant="gradient" color="blue" className="mb-4">
        <Typography variant="h5" color="white">
          Forgot your password?
        </Typography>
      </CardHeader>
      <CardBody>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div>
            <Typography variant="small" className="uppercase text-xs font-bold text-gray-500 dark:text-white">
              Email
            </Typography>
            <Input
              label="Email"
              placeholder="Enter email"
              {...form.register('email')}
              disabled={isPending}
              crossOrigin={undefined}
            />
            {form.formState.errors.email && (
              <Typography variant="small" color="red">
                {form.formState.errors.email.message}
              </Typography>
            )}
          </div>
          <Button
            type="submit"
            fullWidth
            disabled={isPending}
            color="blue"
            className="w-full"
          >
            Send reset email
          </Button>
        </form>
        {error && (
          <Alert color="red" className="mt-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="green" className="mt-4">
            {success}
          </Alert>
        )}
        <Button variant="text" fullWidth color="blue" className="pt-5">
          <Link href="/auth">Back to login</Link>
        </Button>
      </CardBody>
    </Card>
  );
};

export default ResetForm;
