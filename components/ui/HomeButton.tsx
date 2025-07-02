"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function HomeButton() {
  return (
    <Button asChild variant="outline" className="mb-4">
      <Link href="/">
        <Home className="mr-2 h-4 w-4" />
        Return to Home
      </Link>
    </Button>
  );
}
