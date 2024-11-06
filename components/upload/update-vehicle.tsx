import { useState, useTransition, useEffect } from "react";
import type { Vehicle } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { UpdateVehicleSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fetchVehicleById } from "@/app/(main)/vehicles/all/details/[id]/page";
import { Alert, Card, CardBody, CardHeader, Spinner, Input, Button, CardFooter } from "@material-tailwind/react";
import Image from "next/image";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";

const UpdateVehicle = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isFormDisabled, setFormDisabled] = useState<boolean>(false);
    const [vehicleDetails, setVehicleDetails] = useState<Vehicle>();

    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const vehicleId = Number(id);

     const [images, setImages] = useState({
        vehicleFrontImageURL: null as string | null,
        vehicleFrontImage: null as File | null,
        vehicleSideImage: null as File | null,
        vehicleSideImageURL: null as string | null,
        vehicleBackImage: null as File | null,
        vehicleBackImageURL: null as string | null,
        vehicleInteriorFrontImage: null as File | null,
        vehicleInteriorFrontImageURL: null as string | null,
        vehicleInteriorBackImage: null as File | null,
        vehicleInteriorBackImageURL: null as string | null,
    });

    const form = useForm<z.infer<typeof UpdateVehicleSchema>>({
        resolver: zodResolver(UpdateVehicleSchema),
        defaultValues: vehicleDetails ? {
            id: vehicleDetails.id,
            vehicleType: vehicleDetails.vehicleType,
            vehiclePlateNumber: vehicleDetails.vehiclePlateNumber,
            vehicleMake: vehicleDetails.vehicleMake,
            vehicleColor: vehicleDetails.vehicleColor,
            vehicleEngineCapacity: vehicleDetails.vehicleEngineCapacity,
            vehicleSeatsCapacity: vehicleDetails.vehicleSeatsCapacity,
            vehicleYearOfManufacture: vehicleDetails.vehicleYearOfManufacture,
            vehicleBodyType: vehicleDetails.vehicleBodyType,
            vehicleMillage: vehicleDetails.vehicleMillage,
            vehicleFrontImage: vehicleDetails.vehicleFrontImage,
            vehicleSideImage: vehicleDetails.vehicleSideImage,
            vehicleBackImage: vehicleDetails.vehicleBackImage,
            vehicleInteriorFrontImage: vehicleDetails.vehicleInteriorFrontImage,
            vehicleInteriorBackImage: vehicleDetails.vehicleInteriorBackImage,
            unitCostPerDay: Number(vehicleDetails.unitCostPerDay),
            agencyName: vehicleDetails.agencyName,
            ownerUserId: vehicleDetails.ownerUserId,
            isVehicleActive: vehicleDetails.isVehicleActive,
            isVehicleBooked: vehicleDetails.isVehicleBooked,
            isVehicleDeleted: vehicleDetails.isVehicleDeleted,
            isVehicleUnderMaintenance: vehicleDetails.isVehicleUnderMaintenance,
            createdAt: vehicleDetails.createdAt,
            updatedAt: vehicleDetails.updatedAt,
        } : {},
    });
    
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const compressImage = (file: File, quality = 0.7, maxSize = 400 * 1024): Promise<File> => {
        return new Promise((resolve, reject) => {
            const compress = (currentQuality: number) => {
                new Compressor(file, {
                    quality: currentQuality,
                    success(result: Blob) {
                        const compressedFile = new File([result], file.name, {
                            type: file.type,
                            lastModified: Date.now(),
                        });

                        if (compressedFile.size <= maxSize || currentQuality <= 0.1) {
                            resolve(compressedFile);
                        } else {
                            compress(currentQuality - 0.1);
                        }
                    },
                    error(err) {
                        reject(err);
                    },
                });
            };

            compress(quality);
        });
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        imageType: keyof typeof images
    ) => {
        setFormDisabled(true);
        startTransition(async() => {
            const file = e.target.files?.[0];
            if (file) {
                const compressedFile = await compressImage(file, 0.6);
                const base64 = await convertToBase64(compressedFile);
    
                const formData = new FormData();
                formData.append("image", base64);
    
                try {
                    const response = await axios.post("https://bucket.transfa.org/files/single_image.php", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
    
                    if (response.status === 200 || response.status === 201) {
                        const imageUrl = response.data.url;
                        setImages((prev) => ({
                            ...prev,
                            [imageType]: compressedFile,
                            [`${imageType}URL`]: imageUrl,
                        }));
    
                    } else {
                        console.log("Unexpected response:", response);
                        setError("Failed to upload image. Please try again.");
                    }
                } catch (error) {
                    console.error("Image upload failed:", error);
                    if (axios.isAxiosError(error)) {
                        console.error("Error details:", error.response?.data);
                        setError("Failed to upload image. Please try again.");
                    } else {
                        setError("An unexpected error occurred. Please try again.");
                    }
                } finally {
                    setFormDisabled(false);
                }
            }
            return;
        });
    };

    const removeImage = (imageType: keyof typeof images) => {
        setImages((prev) => ({
            ...prev,
            [imageType]: null,
            [`${imageType}URL`]: null,
        }));
    };

    useEffect(() => {
        const fetchVehicleDetails = async() => {
            try {
                const data: Vehicle = await fetchVehicleById(vehicleId);
        
                if (!data) {
                    return { error: "Failed to load vehicle details!" }
                }

                form.reset({
                    id: data.id,
                    vehicleMake: data.vehicleMake,
                    vehicleType: data.vehicleType,
                    vehiclePlateNumber: data.vehiclePlateNumber,
                    vehicleColor: data.vehicleColor,
                    vehicleEngineCapacity: data.vehicleEngineCapacity,
                    vehicleSeatsCapacity: data.vehicleSeatsCapacity,
                    vehicleYearOfManufacture: data.vehicleYearOfManufacture,
                    vehicleBodyType: data.vehicleBodyType,
                    vehicleMillage: data.vehicleMillage,
                    unitCostPerDay: data.unitCostPerDay,
                    agencyName: data.agencyName,
                    vehicleFrontImage: data.vehicleFrontImage,
                    vehicleSideImage: data.vehicleSideImage,
                    vehicleBackImage: data.vehicleBackImage,
                    vehicleInteriorFrontImage: data.vehicleInteriorFrontImage,
                    vehicleInteriorBackImage: data.vehicleInteriorBackImage,
                    ownerUserId: data.ownerUserId,
                    isVehicleActive: data.isVehicleActive,
                    isVehicleBooked: data.isVehicleBooked,
                    isVehicleDeleted: data.isVehicleDeleted,
                    isVehicleUnderMaintenance: data.isVehicleUnderMaintenance,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                });

                setImages({
                    vehicleFrontImage: null, 
                    vehicleFrontImageURL: data.vehicleFrontImage || null,
                    vehicleSideImage: null,
                    vehicleSideImageURL: data.vehicleSideImage || null,
                    vehicleBackImage: null,
                    vehicleBackImageURL: data.vehicleBackImage || null,
                    vehicleInteriorFrontImage: null,
                    vehicleInteriorFrontImageURL: data.vehicleInteriorFrontImage || null,
                    vehicleInteriorBackImage: null,
                    vehicleInteriorBackImageURL: data.vehicleInteriorBackImage || null,
                });

                setVehicleDetails(data);
            } catch (error) {
                console.log("Error fetching vehicle", error);
            };
        };
      fetchVehicleDetails();
    }, [form, vehicleId]);

    useEffect(() => {
      if (error || success) {
        const timer = setTimeout(() => {
          setError("");
          setSuccess("");
        }, 2000); 

        return () => clearTimeout(timer); 
      }
    }, [error, success]);

    const onSubmitUpdate = (values: z.infer<typeof UpdateVehicleSchema>) => {
        const validatedFields = UpdateVehicleSchema.safeParse(values);

        if (!validatedFields.success) {
            return setError("Invalid Fields!");
        }

        let validatedData = validatedFields.data;

        validatedData = {
            ...validatedFields.data,
            vehicleFrontImage: images.vehicleFrontImageURL,
            vehicleSideImage: images.vehicleSideImageURL,
            vehicleBackImage: images.vehicleBackImageURL,
            vehicleInteriorFrontImage: images.vehicleInteriorFrontImageURL,
            vehicleInteriorBackImage: images.vehicleInteriorBackImageURL,
        };

        startTransition(async () => {
            setFormDisabled(true);

            try {
                // const sessionToken = await getSession();
                // const token = sessionToken?.user.accessToken;
                const token = ""

                if (token) {
                    const response = await axios.put(`https://carhire.transfa.org/api/vehicles/${vehicleDetails?.id}`, 
                        validatedData, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    if (response.status === 200 || response.status === 204) {
                        setSuccess("Vehicle updated successfully!");
                        form.reset();
                        setImages({
                            vehicleFrontImage: null,
                            vehicleFrontImageURL: null,
                            vehicleSideImage: null,
                            vehicleSideImageURL: null,
                            vehicleBackImage: null,
                            vehicleBackImageURL: null,
                            vehicleInteriorFrontImage: null,
                            vehicleInteriorFrontImageURL: null,
                            vehicleInteriorBackImage: null,
                            vehicleInteriorBackImageURL: null,
                        });
                        router.replace('/vehicles/active-vehicles');
                    } else {
                        setError("Vehicle update failed. Please try again.");
                    }
                }
            }
             catch (error) {
                handleAxiosError(error);
            } finally {
                setFormDisabled(false);
            }
        });
    };

    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error("Error response from server:", error.response.data);
                setError(`Vehicle update failed: ${error.response.data.message}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                setError("Vehicle update failed: No response from server. Please try again later.");
            } else {
                console.error("Error in setup:", error.message);
                setError(`Vehicle update failed: ${error.message}`);
            }
        } else {
            console.error("Unexpected error:", error);
            setError("Vehicle update failed: An unexpected error occurred. Please try again.");
        }
    };

    const handelCancel = () => {
        form.reset();
        setImages({
            vehicleFrontImage: null,
            vehicleFrontImageURL: null,
            vehicleSideImage: null,
            vehicleSideImageURL: null,
            vehicleBackImage: null,
            vehicleBackImageURL: null,
            vehicleInteriorFrontImage: null,
            vehicleInteriorFrontImageURL: null,
            vehicleInteriorBackImage: null,
            vehicleInteriorBackImageURL: null,
        });
        router.back();
    }


    return ( 
        <div className="pt-5">
            {isPending && (
                <Spinner />
            )}
            {error && (
                <Alert color="red">{error}</Alert>
            )}
            {success && (
                <Alert color="green">{success}</Alert>
            )}
            <Card>
                <CardHeader>
                    <h2 className="text-white text-lg">Update Vehicle</h2>
                    <h3 className="text-gray-400 text-sm">Make changes to vehicle details where necessary.</h3>
                </CardHeader>
                <CardBody>
                    <form onSubmit={form.handleSubmit(onSubmitUpdate)} className="space-y-5">
                        <div className="grid grid-cols-3 gap-5">
                            <div className="flex flex-col">
                                <label htmlFor="vehicleMake">Make</label>
                                <Input
                                    id="vehicleMake"
                                    placeholder="Toyota, Mercedes ..."
                                    {...form.register("vehicleMake")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleType">Model</label>
                                <Input
                                    id="vehicleType"
                                    placeholder="Civic, C-Class ..."
                                    {...form.register("vehicleType")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleYearOfManufacture">Year of Manufacture</label>
                                <Input
                                    id="vehicleMake"
                                    placeholder="2020"
                                    {...form.register("vehicleYearOfManufacture")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehiclePlateNumber">Plate Number</label>
                                <Input
                                    id="vehiclePlateNumber"
                                    placeholder="KAA123"
                                    {...form.register("vehiclePlateNumber")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleColor">Color</label>
                                <Input
                                    id="vehicleColor"
                                    placeholder="black, white, gray ..."
                                    {...form.register("vehicleColor")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleBodyType">Body Type</label>
                                <Input
                                    id="vehicleBodyType"
                                    placeholder="sedan, SUV ..."
                                    {...form.register("vehicleBodyType")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleSeatsCapacity">Seats Capacity</label>
                                <Input
                                    id="vehicleSeatsCapacity"
                                    placeholder="5,6,7 ..."
                                    {...form.register("vehicleSeatsCapacity")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleMillage">Mileage</label>
                                <Input
                                    id="vehicleMillage"
                                    placeholder="total miles/kms driven"
                                    {...form.register("vehicleMillage")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="vehicleEngineCapacity">Engine Capacity</label>
                                <Input
                                    id="vehicleEngineCapacity"
                                    placeholder="2000cc ..."
                                    {...form.register("vehicleEngineCapacity")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="unitCostPerDay">Unit Cost Per Day</label>
                                <Input
                                    id="unitCostPerDay"
                                    type="number"
                                    placeholder="$50 Per Day"
                                    {...form.register("unitCostPerDay")}
                                    onChange={(e) => form.setValue("unitCostPerDay", e.target.valueAsNumber)}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="agencyName">Agency Name</label>
                                <Input
                                    id="agencyName"
                                    placeholder="Agency Name"
                                    {...form.register("agencyName")}
                                    disabled={isFormDisabled}
                                    crossOrigin={undefined}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="form-item">
                                <label>Front</label>
                                <div className="relative-group">
                                    {images.vehicleFrontImageURL ? (
                                        <>
                                            <Image
                                                src={images.vehicleFrontImageURL}
                                                alt="Front Image"
                                                width={150}
                                                height={150}
                                                className="w-full h-50 object-contain rounded-md"
                                            />
                                            <Button
                                                size="sm"
                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage("vehicleFrontImage")}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <label htmlFor="front-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                <PhotoIcon />
                                                <span className="text-gray-500 text-sm">Upload Front Image</span>
                                            </label>
                                            <Input
                                                id="front-image-upload"
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, "vehicleFrontImage")}
                                                accept="image/*"
                                                className="hidden"
                                                name="vehicleFrontImage"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Side</label>
                                <div className="relative-group">
                                    {images.vehicleSideImageURL ? (
                                        <>
                                            <Image
                                                src={images.vehicleSideImageURL}
                                                alt="Side Image"
                                                width={150}
                                                height={150}
                                                className="w-full h-50 object-contain rounded-md"
                                            />
                                            <Button
                                                size="sm"
                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage("vehicleSideImage")}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <label htmlFor="side-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                <PhotoIcon />
                                                <span className="text-gray-500 text-sm">Upload Side Image</span>
                                            </label>
                                            <Input
                                                id="side-image-upload"
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, "vehicleSideImage")}
                                                accept="image/*"
                                                className="hidden"
                                                name="vehicleSideImage"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Back</label>
                                <div className="relative-group">
                                    {images.vehicleBackImageURL ? (
                                        <>
                                            <Image
                                                src={images.vehicleBackImageURL}
                                                alt="Back Image"
                                                width={150}
                                                height={150}
                                                className="w-full h-50 object-contain rounded-md"
                                            />
                                            <Button
                                                size="sm"
                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage("vehicleBackImage")}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <label htmlFor="back-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                <PhotoIcon />
                                                <span className="text-gray-500 text-sm">Upload Back Image</span>
                                            </label>
                                            <Input
                                                id="back-image-upload"
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, "vehicleBackImage")}
                                                accept="image/*"
                                                className="hidden"
                                                name="vehicleBackImage"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Front Interior</label>
                                <div className="relative-group">
                                    {images.vehicleInteriorFrontImageURL ? (
                                        <>
                                            <Image
                                                src={images.vehicleInteriorFrontImageURL}
                                                alt="Interior Front Image"
                                                width={150}
                                                height={150}
                                                className="w-full h-50 object-contain rounded-md"
                                            />
                                            <Button
                                                size="sm"
                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage("vehicleInteriorFrontImage")}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <label htmlFor="interior-front-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                <PhotoIcon />
                                                <span className="text-gray-500 text-sm">Upload Interior Front Image</span>
                                            </label>
                                            <Input
                                                id="interior-front-image-upload"
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, "vehicleInteriorFrontImage")}
                                                accept="image/*"
                                                className="hidden"
                                                name="vehicleInteriorFrontImage"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-item">
                                <label>Interior Back</label>
                                <div className="relative-group">
                                    {images.vehicleInteriorBackImageURL ? (
                                        <>
                                            <Image
                                                src={images.vehicleInteriorBackImageURL}
                                                alt="Interior Back Image"
                                                width={150}
                                                height={150}
                                                className="w-full h-50 object-contain rounded-md"
                                            />
                                            <Button
                                                size="sm"
                                                className="ml-2 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage("vehicleInteriorBackImage")}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <label htmlFor="interior-back-image-upload" className="flex flex-col items-center justify-center w-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg hover:bg-gray-50 transition">
                                                <PhotoIcon />
                                                <span className="text-gray-500 text-sm">Upload Interior Back Image</span>
                                            </label>
                                            <Input
                                                id="interior-back-image-upload"
                                                type="file"
                                                onChange={(e) => handleImageUpload(e, "vehicleInteriorBackImage")}
                                                accept="image/*"
                                                className="hidden"
                                                name="vehicleInteriorBackImage"
                                                crossOrigin={undefined}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </form>
                </CardBody>
                <CardFooter className="flex justify-between">
                    <Button 
                        type="submit" 
                        className="bg-orange-400 hover:bg-orange-500" 
                        onClick={form.handleSubmit(onSubmitUpdate)}
                        disabled={isFormDisabled || isPending}
                    >
                        {isFormDisabled || isPending ? "Updating..." : "Update"}
                    </Button>
                    <Button 
                        onClick={handelCancel}
                    >Cancel
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
 
export default UpdateVehicle;