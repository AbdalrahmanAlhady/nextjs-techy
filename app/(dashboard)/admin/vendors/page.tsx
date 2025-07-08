import React from 'react';
import VendorsTable from '@/components/vendors/VendorsTable';
import { getAllVendorApplications } from '@/app/actions/admin/vendors';
import HomeButton from '@/components/ui/HomeButton';



export default async function AdminVendorsPage() {
  const { vendors = [], success, error } = await getAllVendorApplications();

  if (!success) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading vendors: {error}
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingApplications = vendors.filter(vendor => vendor.vendorStatus === 'PENDING').length;
  const approvedVendors = vendors.filter(vendor => vendor.vendorStatus === 'APPROVED').length;
  const rejectedVendors = vendors.filter(vendor => vendor.vendorStatus === 'REJECTED').length;

  return (
        <div className="p-8 space-y-8">
      <HomeButton />
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Management</h2>
        <p className="text-gray-500">Review and manage vendor applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Applications</h3>
          <span className="text-2xl font-bold text-gray-900">{vendors.length}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Review</h3>
          <span className="text-2xl font-bold text-yellow-600">{pendingApplications}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Approved Vendors</h3>
          <span className="text-2xl font-bold text-green-600">{approvedVendors}</span>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
          <span className="text-2xl font-bold text-red-600">{rejectedVendors}</span>
        </div>
      </div>

      <VendorsTable vendors={vendors} />
    </div>
  );
}