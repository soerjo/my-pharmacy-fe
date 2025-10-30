'use client';

import { useAuthDetails } from "@/shared/hooks/authentication";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ExamplePage() {
    const searchParams = useSearchParams()
    const router = useRouter();
    const token = searchParams.get('token')
    const { mutate: authDetail } = useAuthDetails();

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        // if token exists, call authDetail
        authDetail(token);
    }, []);


    return (<p>logging in...</p>)
}
