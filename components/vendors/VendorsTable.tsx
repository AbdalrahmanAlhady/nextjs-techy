"use client";
import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import SimplePagination from "@/components/ui/simple-pagination";
import VendorActions from "@/components/vendors/VendorActions";
import StatusChip from "@/components/ui/StatusChip";
import type { IUser as Vendor } from "@/types/vendor";

interface Props {
  vendors: Vendor[];
}

export default function VendorsTable({ vendors }: Props) {
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(vendors.length / ITEMS_PER_PAGE));
  const paginated = vendors.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-white rounded-lg border shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Applicant Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Applied Date</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No vendor applications found.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name || "N/A"}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    <StatusChip status={vendor.vendorStatus} />
                  </TableCell>
                  <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <VendorActions vendor={vendor} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination page={page} totalPages={totalPages} onChange={setPage} />
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Showing {vendors.length} vendors</span>
        <span>Last updated: {new Date().toLocaleDateString()}</span>
      </div>
    </>
  );
}
