"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white py-4 px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-gray-900">DeployHub</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost">Docs</Button>
          </Link>
          <Link href="/account">
            <Button variant="outline">SignIn</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}