"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-600">Failed Google Oauth</h1>
      <p className="text-gray-600 mb-6">
        there is somethink wrong with the server.
      </p>
      <p className="text-gray-500">
        Redirecting to the dashboard in <span className="font-semibold">5 seconds</span>...
      </p>
      <p>or just <a onClick={() => router.push("/login")}>redirect</a></p>
    </main>
  );
}
