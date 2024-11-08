import { Checkbox, Typography } from "@material-tailwind/react";
import { Vehicle } from "@/types";
import { useState, useEffect } from "react";
import ActionsCell from "./actions-cell";
import Link from "next/link";

interface DataTableProps {
  vehicles: Vehicle[];
  showActions: boolean;
  basePath: string;
}

const TABLE_HEAD = [
  {
    head: "Plate No.",
  },
  {
    head: "Make",
  },
  {
    head: "Model"
  },
  {
    head: "Year of Manufacturer"
  },
  {
    head: "Body Type", 
  },
  {
    head: "Status",
  },
  {
    head: "Engine Capacity",
  },
  {
    head: "Price Per Day"
  },
  {
    head: "Actions" 
  }
];

const getVehicleStatus = (vehicle: Vehicle) => {
  if (vehicle.isVehicleDeleted) {
    return "Deleted";
  } else if (vehicle.isVehicleUnderMaintenance) {
    return "Under Maintenance";
  } else if (vehicle.isVehicleBooked) {
    return "Booked";
  } else if (vehicle.isVehicleActive) {
    return "Active";
  } else if (!vehicle.isVehicleActive) {
    return "Deactivated";
  }
  return "Inactive";  
};

const DataTable = ({ vehicles, showActions, basePath }: DataTableProps) => {
    const [selected, setSelected] = useState<boolean[]>(Array(vehicles.length).fill(false));

    useEffect(() => {
      setSelected(Array(vehicles.length).fill(false));
    }, [vehicles]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setSelected(Array(vehicles.length).fill(checked));
    };

    const handleSelect = (index: number) => {
      const newSelected = [...selected];
      newSelected[index] = !newSelected[index];
      setSelected(newSelected);
    };

  return (
    <table className="w-full min-w-max table-auto text-left">
      <thead>
        <tr>
          <th className="border-b border-gray-300 p-4">
            <Checkbox
              checked={selected.every(Boolean)}
              onChange={handleSelectAll} 
              crossOrigin={undefined}
            />
          </th>
          {TABLE_HEAD.map(({ head }) => (
            <th key={head} className="border-b border-gray-300 p-4">
              <Typography
                color="blue-gray"
                variant="small"
                className="!font-bold"
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle, index) => {
          const classes = "p-4 border-b border-gray-300";
          return (
            <tr key={vehicle.id}>
                <td className={classes}>
                  <Checkbox 
                    checked={selected[index] || false}
                    onChange={() => handleSelect(index)}
                    crossOrigin={undefined} 
                  />
                </td>
              <td className={classes}>
                <div className="flex items-center gap-1">
                  <Typography variant="small" color="blue-gray" className="font-bold">
                    <Link 
                      href={{
                        pathname: `/vehicles/${basePath}/status/${vehicle.id}`,
                        query: {
                          id: vehicle.id,
                          make: vehicle.vehicleMake,
                          model: vehicle.vehicleType,
                          plateNumber: vehicle.vehiclePlateNumber,
                        }
                      }} 
                      className="text-blue-500 hover:underline"
                    >
                      {vehicle.vehiclePlateNumber}
                    </Link>
                  </Typography>
                </div>
              </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {vehicle.vehicleMake}
                </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {vehicle.vehicleType}
                </Typography>
              </td>
                <td className={classes}>
                  <Typography variant="small" className="font-normal text-gray-600">
                    {vehicle.vehicleYearOfManufacture}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography variant="small" className="font-normal text-gray-600">
                    {vehicle.vehicleBodyType}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography variant="small" className="font-normal text-gray-600">
                    {getVehicleStatus(vehicle)}
                  </Typography>
                </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {vehicle.vehicleEngineCapacity}
                </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {vehicle.unitCostPerDay}
                </Typography>
              </td>
              {showActions && (
                <td className={classes}>
                    <ActionsCell vehicle={vehicle}/>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
