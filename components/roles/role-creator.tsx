"use client";

import * as React from "react";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Typography, Checkbox, Input, Select, Option } from "@material-tailwind/react";

// Type for the permissions
type Permission = string;

// Type for roles and their permissions
interface RolePermission {
  [role: string]: Permission[]; // Allows any string as a role name with an array of permissions
}

const predefinedRoles: RolePermission = {
  Manager: [
    "Can approve applications",
    "Can reject applications",
    "Can add vehicles",
    "Can delete vehicles",
    "Can add users",
    "Can delete users",
    "Can view bookings",
    "Can view vehicles",
  ],
  Operator: ["Can view bookings", "Can view vehicles"],
};

const allPermissions = [
  "Can create a new role",
  "Can approve applications",
  "Can reject applications",
  "Can add vehicles",
  "Can delete vehicles",
  "Can add users",
  "Can delete users",
  "Can view bookings",
  "Can view vehicles",
];

const RoleCreatorPage = () => {
  const [selectedRole, setSelectedRole] = useState<"Manager" | "Operator">("Manager");
  const [customPermission, setCustomPermission] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [permissions, setPermissions] = useState(predefinedRoles[selectedRole]);

  // Update permissions based on selected role
  const handleRoleChange = (role: "Manager" | "Operator") => {
    setSelectedRole(role);
    setPermissions(predefinedRoles[role]);
  };

  // Toggle permission on or off
  const togglePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  // Add custom permission
  const handleAddCustomPermission = () => {
    if (customPermission && !permissions.includes(customPermission)) {
      setPermissions([...permissions, customPermission]);
      setCustomPermission("");
    }
  };

  // Add custom role
  const handleAddCustomRole = () => {
    if (customRole && !Object.keys(predefinedRoles).includes(customRole)) {
      predefinedRoles[customRole] = []; // Initialize permissions for the new role
      setCustomRole(""); // Reset custom role input
    }
  };

  return (
    <div className="pt-5">
      <Card className="w-full">
        <CardHeader color="blue-gray" className="p-4">
          <Typography variant="h5">Create Role</Typography>
          <Typography variant="small" className="opacity-70">
            Create new role and assign privileges and permissions.
          </Typography>
        </CardHeader>

        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="mb-4">
                <Typography variant="small">Select Role</Typography>
                <Select
                  value={selectedRole}
                  onChange={(value) => handleRoleChange(value as "Manager" | "Operator")}
                  label="Select Role"
                >
                  <Option value="Manager">Manager</Option>
                  <Option value="Operator">Operator</Option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {allPermissions.map((permission, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${idx}`}
                      checked={permissions.includes(permission)}
                      onChange={() => togglePermission(permission)}
                      label={permission}
                      crossOrigin={undefined}
                    />
                  </div>
                ))}
              </div>

              <Card className="border p-4 mt-4">
                <CardHeader>
                  <Typography variant="h6">Preview Role Settings</Typography>
                </CardHeader>
                <CardBody>
                  <Typography><strong>Role Name:</strong> {selectedRole}</Typography>
                  <Typography><strong>Assigned Permissions:</strong></Typography>
                  <ul className="list-disc pl-5">
                    {permissions.map((permission, idx) => (
                      <li key={idx}>{permission}</li>
                    ))}
                  </ul>
                </CardBody>
                <div className="flex justify-between p-4">
                  <Button color="blue-gray" variant="outlined">Cancel</Button>
                  <Button color="blue">Create</Button>
                </div>
              </Card>
            </div>

            <div>
              <div className="mb-4">
                <Typography variant="small">Add New Role (Superuser Only)</Typography>
                <Input
                  id="new-role"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  label="New Role"
                  crossOrigin={undefined}
                />
                <Button
                  color="blue"
                  type="button"
                  className="mt-2"
                  onClick={handleAddCustomRole}
                >
                  Add Role
                </Button>
              </div>

              <div className="mb-4">
                <Typography variant="small">Add New Permission (Superuser Only)</Typography>
                <Input
                  id="new-permission"
                  value={customPermission}
                  onChange={(e) => setCustomPermission(e.target.value)}
                  label="New Permission"
                  crossOrigin={undefined}
                />
                <Button
                  color="blue"
                  type="button"
                  className="mt-2"
                  onClick={handleAddCustomPermission}
                >
                  Add Permission
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default RoleCreatorPage;
