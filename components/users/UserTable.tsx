"use client";
import React, { useState } from "react";
import SimplePagination from "@/components/ui/simple-pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Ban, UserCheck, Mail, Trash2 } from "lucide-react";
import {
  suspendUser,
  reinstateUser,
  deleteUser,
} from "@/app/actions/admin/users";
import { useToast } from "@/hooks/use-toast";
import StatusChip from "@/components/ui/StatusChip";
import { useRouter } from "next/navigation";
import RoleChip from "../ui/RoleChip";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: Date;
  lastLogin?: Date;
};

type Props = {
  users: User[];
};

export default function UserTable({ users }: Props) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(users.length / ITEMS_PER_PAGE));
  const paginated = users.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const { toast } = useToast();
  const router = useRouter();

  const handleToggleSuspend = async (userId: string, currentStatus: string) => {
    try {
      const result =
        currentStatus === "ACTIVE"
          ? await suspendUser(userId)
          : await reinstateUser(userId);
      if (result.success) {
        toast({
          title: `User ${
            currentStatus === "ACTIVE" ? "suspended" : "reinstated"
          }`,
          description: `The user has been ${
            currentStatus === "ACTIVE" ? "suspended" : "reinstated"
          } successfully.`,
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${
          currentStatus === "ACTIVE" ? "suspend" : "reinstate"
        } user. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast({
          title: "User deleted",
          description: "The user has been deleted successfully.",
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate stats
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const vendors = users.filter((user) => user.role === "VENDOR").length;
  const suspended = users.filter((user) => user.status === "SUSPENDED").length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Users
          </h3>
          <span className="text-2xl font-bold text-gray-900">
            {users.length}
          </span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Users
          </h3>
          <span className="text-2xl font-bold text-green-600">
            {activeUsers}
          </span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Vendors</h3>
          <span className="text-2xl font-bold text-blue-600">{vendors}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Suspended</h3>
          <span className="text-2xl font-bold text-red-600">{suspended}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleChip role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusChip status={user.status as any} />
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                                            <Button className="h-10 w-10 p-0" onClick={() => router.push(`/admin/users/${user.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {user.status === "ACTIVE" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleSuspend(user.id, user.status)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleToggleSuspend(user.id, user.status)
                          }
                          className="text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
      />

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Showing {paginated.length} users</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
