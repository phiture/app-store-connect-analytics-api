import type {Metadata} from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
    title: "App Store Connect - Activate Analytics Request",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors duration-500">
        <div className="p-4 flex justify-end">
            <ThemeToggle/>
        </div>
        {children}
        </body>
        </html>
    );
}
