"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';
import { approveVendor, denyVendor } from '@/app/actions/admin-vendors';
import type { IUser } from '@/types/vendor';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Props {
  vendor: IUser;
}

export default function VendorActions({ vendor }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const handleApprove = async () => {
    try {
      const result = await approveVendor(vendor.id);
      if (result.success) {
        toast({
          title: "Vendor approved",
          description: "The vendor application has been approved.",
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeny = async () => {
    try {
      const result = await denyVendor(vendor.id);
      if (result.success) {
        toast({
          title: "Vendor denied",
          description: "The vendor application has been denied.",
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button className="h-10 w-10 p-0" onClick={() => router.push(`/admin/vendors/${vendor.id}`)}>
        <Eye className="h-4 w-4" />
      </Button>
      {vendor.vendorStatus === 'PENDING' && (
        <>
          <Button
            className="h-10 w-10 p-0 text-green-600 hover:text-green-700"
            onClick={handleApprove}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
            onClick={handleDeny}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
