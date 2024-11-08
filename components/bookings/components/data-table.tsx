import { Checkbox, Typography } from "@material-tailwind/react";
import { Booking } from "@/types";
import BookingActionsCell from "./booking-actions-cell";
import { useState, useEffect } from "react";

interface DataTableProps {
  bookings: Booking[];
  showActions: boolean;
  showAgency: boolean;
}

const TABLE_HEAD = [
  {
    head: "Agency", 
  },
  {
    head: "Plate No.",
  },
  {
    head: "Cost Per Day",
  },
  {
    head: "Start"
  },
  {
    head: "End"
  },
  {
    head: "Duration (days)", 
  },
  {
    head: "Status",
  },
  {
    head: "Total Cost",
  },
  {
    head: "Actions" 
  }
];

const getBookingStatus = (booking: Booking) => {
  if (booking.isBookingCompleted) {
    return "Completed";
  } else if (booking.isBookingCancelled) {
    return "Canceled";
  } else if (booking.isBookingDeleted) {
    return "Deleted";
  }
  return "Unknown";  
};

const DataTable = ({ bookings, showActions, showAgency }: DataTableProps) => {
    const [selected, setSelected] = useState<boolean[]>(Array(bookings.length).fill(false));

    useEffect(() => {
        setSelected(Array(bookings.length).fill(false));
    }, [bookings]);

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setSelected(Array(bookings.length).fill(checked));
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
        {bookings.map((booking, index) => {
          const classes = "p-4 border-b border-gray-300";
          return (
            <tr key={booking.id}>
                <td className={classes}>
                    <Checkbox 
                        checked={selected[index] || false}
                        onChange={() => handleSelect(index)}
                        crossOrigin={undefined} 
                    />
                </td>
              <td className={classes}>
                {showAgency && (
                    <div className="flex items-center gap-1">
                        <Typography variant="small" color="blue-gray" className="font-bold">
                            {booking.agencyName}
                        </Typography>
                    </div>
                )}
              </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {booking.vehiclePlateNumber}
                </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {booking.unitCostPerDay}
                </Typography>
              </td>
                <td className={classes}>
                    <Typography variant="small" className="font-normal text-gray-600">
                        {booking.startDate}
                    </Typography>
                </td>
                <td className={classes}>
                    <Typography variant="small" className="font-normal text-gray-600">
                        {booking.endDate}
                    </Typography>
                </td>
                <td className={classes}>
                    <Typography variant="small" className="font-normal text-gray-600">
                        {booking.duration}
                    </Typography>
                </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {getBookingStatus(booking)}
                </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" className="font-normal text-gray-600">
                  {booking.totalCost}
                </Typography>
              </td>
              {showActions && (
                <td className={classes}>
                    <BookingActionsCell booking={booking}/>
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
