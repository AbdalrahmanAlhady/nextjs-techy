import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const statusChipVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
  {
    variants: {
      status: {
        ACTIVE: 'bg-green-100 text-green-800',
        DRAFT: 'bg-yellow-100 text-yellow-800',
        ARCHIVED: 'bg-gray-100 text-gray-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        PROCESSING: 'bg-blue-100 text-blue-800',
        SHIPPED: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-teal-100 text-teal-800',
        CANCELED: 'bg-red-100 text-red-800',
        SUSPENDED: 'bg-red-100 text-red-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
        NONE: 'bg-gray-100 text-gray-800',
      },
    },
    defaultVariants: {
      status: 'DRAFT',
    },
  }
);

export interface StatusChipProps extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusChipVariants> {
    status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED' | 'SUSPENDED' | 'APPROVED' | 'REJECTED' | 'NONE' | 'PROCESSING';
}

const StatusChip: React.FC<StatusChipProps> = ({ className, status, ...props }) => {
  return (
    <div className={statusChipVariants({ status, className })} {...props}>
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </div>
  );
};

export default StatusChip;
