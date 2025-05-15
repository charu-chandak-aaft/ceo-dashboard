"use client";
import { usePathname } from "next/navigation";
import Login from '@/app/components/user/Login';

export default function Page() {
    const pathname = usePathname(); // Get current URL path
    console.log('pathname', pathname);

    const renderPage = () => {
        if (pathname === "/login") return <Login />;
        // if (pathname === "/dashboard") return <Dashboard />;
        return <Login />; // Default to login if no match
    };

    return (
        <div className="min-h-screen">
            {renderPage()}
        </div>
    );
}
