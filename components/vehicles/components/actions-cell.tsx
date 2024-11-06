import React from 'react';
import { Button } from '@material-tailwind/react';
import Link from 'next/link';
import { useRefreshAfterDelete } from '@/hooks/refresh';
import type { Vehicle } from '@/types';
import { handleDeleteVehicle } from '@/components/vehicles/all/page';

interface ActionsCellProps {
  vehicle: Vehicle;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ vehicle }) => {
  const { deleteById, isDeleting } = useRefreshAfterDelete();

  return (
    <div className="flex space-x-2">
      <Button
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        <Link
          href={{
            pathname: `/upload/fleet/${vehicle.id}`,
            query: {
              id: vehicle.id,
            }
          }}
        >
          Edit
        </Link>
      </Button>
      <Button
        className="text-white hover:bg-red-600"
        onClick={() => deleteById(vehicle.id, handleDeleteVehicle, "Booking")}
        disabled={isDeleting} 
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
};

export default ActionsCell;
