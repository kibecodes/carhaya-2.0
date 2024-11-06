'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newPassword } from '@/actions/new-password';
import { useTransition, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Card, Typography, Alert } from "@material-tailwind/react";
import Link from "next/link";

export const NewPasswordSchema = z.object({
  password: z.string().min(4, { message: "Minimum of 4 characters required" }),
});

const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>(''); 
    const [success, setSuccess] = useState<string | undefined>(''); 
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        },
    });

    const handleSubmit = (values: z.infer<typeof NewPasswordSchema>) => {        
        setError("");
        setSuccess("");

        startTransition(() => {
            newPassword(values, token)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.success);
            })
            .then(() => form.reset())
            .catch((error: unknown) => console.log('error', error));
        });
    }

    return ( 
        <Card className="p-8 max-w-md mx-auto mt-10">
            <Typography variant="h5" color="blue-gray" className="mb-2">
                Password
            </Typography>
            <Typography color="gray" className="mb-4">
                Enter a new password
            </Typography>
            
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
                <div>
                    <label className='block text-xs font-bold text-gray-500 dark:text-white mb-1 uppercase'>Password</label>
                    <Input 
                        color="light-blue"
                        label="****"
                        type="password"
                        {...form.register("password")}
                        disabled={isPending}
                        className="bg-slate-100 dark:bg-slate-500 text-black dark:text-white"
                        crossOrigin={undefined}
                    />
                    {form.formState.errors.password && (
                        <Typography color="red" className="text-sm mt-1">
                            {form.formState.errors.password.message}
                        </Typography>
                    )}
                </div>
                
                <Button 
                    disabled={isPending} 
                    type="submit" 
                    fullWidth
                    color="blue"
                >
                    Reset password
                </Button>
            </form>

            {error && (
                <Alert color="red" variant="gradient" className="mt-4">
                    <Typography variant="h6" color="white">
                        {error}
                    </Typography>
                </Alert>
            )}
            {success && (
                <Alert color="green" variant="gradient" className="mt-4">
                    <Typography variant="h6" color="white">
                        {success}
                    </Typography>
                </Alert>
            )}

            <div className="pt-5 text-center">
                <Button variant="text" color="blue">
                    <Link href="/auth">Back to login</Link>
                </Button>
            </div>
        </Card>
    );
}
 
export default NewPasswordForm;
