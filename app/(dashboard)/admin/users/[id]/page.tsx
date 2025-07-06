import React from 'react';
import { getUserById } from '@/app/actions/admin-users';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusChip from '@/components/ui/StatusChip';
import BackButton from '@/components/ui/BackButton';
import RoleChip from '@/components/ui/RoleChip';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { user, success, error } = await getUserById(id);

  if (!success || !user) {
    notFound();
  }

  return (
        <div className="p-8">
      <BackButton />
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Name:</div>
            <div>{user.name}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Email:</div>
            <div>{user.email}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Role:</div>
            <div><RoleChip role={user.role} /></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Status:</div>
            <div><StatusChip status={user.status as any} /></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="font-semibold">Joined:</div>
            <div>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
