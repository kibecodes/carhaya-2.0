export type Booking = {
  id: number;
  userId: string;
  startDate: string;
  endDate: string;
  vehiclePlateNumber: string;
  unitCostPerDay: number;
  totalCost: number;
  paymentStatus: boolean;
  agencyName: string;
  isBookingCancelled: boolean;
  isBookingCompleted: boolean;
  isBookingDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  duration: number;
};

export type Vehicle = {
  id: number;
  ownerUserId: string;
  vehiclePlateNumber: string;
  vehicleType: string;
  vehicleMake: string;
  vehicleColor: string;
  vehicleEngineCapacity: string;
  vehicleSeatsCapacity: string;
  vehicleYearOfManufacture: string;
  vehicleBodyType: string;
  vehicleMillage: string;
  vehicleFrontImage: string;
  vehicleSideImage: string;
  vehicleBackImage: string;
  vehicleInteriorFrontImage: string;
  vehicleInteriorBackImage: string;
  unitCostPerDay: number;
  agencyName: string;
  isVehicleDeleted: boolean;
  isVehicleActive: boolean;
  isVehicleBooked: boolean;
  isVehicleUnderMaintenance: boolean;
  createdAt: string;
  updatedAt: string;
};
