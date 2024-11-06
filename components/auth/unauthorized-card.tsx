import { Card, CardHeader } from "@material-tailwind/react";

const UnauthorizedCard = () => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                Unauthorized! 
            </CardHeader>
        </Card>
    )
}

export default UnauthorizedCard;