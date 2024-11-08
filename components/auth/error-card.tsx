"use client"

import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";


const ErrorCard = () => {
    const router = useRouter();

    return (
        <Card className="w-[400px] shadow-md justify-self-center">
            <CardHeader>
                Oops! Something went wrong
            </CardHeader>
            <CardBody>
                <Button onClick={() => router.replace('/lign')}>Back to login</Button>
            </CardBody>
        </Card>
    )
}

export default ErrorCard;