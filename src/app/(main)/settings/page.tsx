"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@heroui/react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>⚙️ Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Application Name: {process.env.NEXT_PUBLIC_APP_NAME}</p>
          <p>App URL: {process.env.NEXT_PUBLIC_APP_URL}</p>
          <p>Auth Service: {process.env.NEXT_PUBLIC_API_AUTH_SERVICE}</p>
          <p>Warehouse Service: {process.env.NEXT_PUBLIC_API_WAREHOUSE_SERVICE}</p>
          <p>Depo Service: {process.env.NEXT_PUBLIC_API_DEPO_SERVICE}</p>
        </CardContent>
      </Card>
    </div>
  );
}
