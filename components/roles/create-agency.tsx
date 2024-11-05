import { CreditCardIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, Input, Typography } from "@material-tailwind/react";

const CreateAgencyPage = () => {
    return ( 
        <Card className="w-full max-w-[24rem]">
            <CardBody>
                <form className="mt-12 flex flex-col gap-4">
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium"
                  >
                    Your Email
                  </Typography>
                  <Input
                    type="email"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                </div>
 
                <div className="my-3">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium "
                  >
                    Card Details
                  </Typography>
 
                  <Input
                    maxLength={19}
                    icon={
                      <CreditCardIcon className="absolute left-0 h-4 w-4 text-blue-gray-300" />
                    }
                    placeholder="0000 0000 0000 0000"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                  <div className="my-4 flex items-center gap-4">
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        Expires
                      </Typography>
                      <Input
                        maxLength={5}
                        containerProps={{ className: "min-w-[72px]" }}
                        placeholder="00/00"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                        crossOrigin={undefined}
                      />
                    </div>
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="mb-2 font-medium"
                      >
                        CVC
                      </Typography>
                      <Input
                        maxLength={4}
                        containerProps={{ className: "min-w-[72px]" }}
                        placeholder="000"
                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                        labelProps={{
                          className: "before:content-none after:content-none",
                        }}
                        crossOrigin={undefined}
                      />
                    </div>
                  </div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-2 font-medium"
                  >
                    Holder Name
                  </Typography>
                  <Input
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    crossOrigin={undefined}
                  />
                </div>
                <Button size="lg">Pay Now</Button>
                <Typography
                  variant="small"
                  color="gray"
                  className="mt-2 flex items-center justify-center gap-2 font-medium opacity-60"
                >
                  <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Payments are
                  secure and encrypted
                </Typography>
              </form>
            </CardBody>
        </Card>
    );
}
 
export default CreateAgencyPage;