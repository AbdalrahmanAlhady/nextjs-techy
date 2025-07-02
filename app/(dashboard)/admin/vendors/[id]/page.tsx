import React from 'react';
import { getVendorById } from '@/app/actions/admin-vendors';
import { notFound } from 'next/navigation';
import BackButton from '@/components/ui/BackButton';
import RoleChip from '@/components/ui/RoleChip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusChip from '@/components/ui/StatusChip';

export default async function VendorProfilePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { vendor, success, error } = await getVendorById(id);

  if (!success || !vendor) {
    notFound();
  }

  return (
        <div className="p-8">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Vendor Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Name:</div>
            <div>{vendor.name}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Email:</div>
            <div>{vendor.email}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Role:</div>
            <div><RoleChip role={vendor.role} /></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Status:</div>
            <div><StatusChip status={vendor.status as any} /></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Vendor Status:</div>
            <div><StatusChip status={vendor.vendorStatus as any} /></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Joined:</div>
            <div>{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
