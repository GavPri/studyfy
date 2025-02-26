"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import CreateTaskDialog from "@/components/create-task-dialog";

export default function page() {
  const { user } = useUser();
  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-bold text-foreground">{user?.fullName}</h2>
      <h3 className="capitalize text-md text-muted-foreground mb-4">
        To do list
      </h3>
      <p className="capitalize text-md text-muted-foreground">
        Manage your tasks effectively
      </p>
      <div className="py-6 px-8 bg-gray-300 rounded-lg shadow-md">
        <CreateTaskDialog user={user} />
      </div>
    </div>
  );
}
