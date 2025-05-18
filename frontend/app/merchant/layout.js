// app/merchant/layout.tsx
import { AppSidebar } from "@/components/ui/my-components/my-appsidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Alert from "./components/Alert"
import { MenuIcon } from "lucide-react"
import React from "react"
import MerchantNavBar from "./components/nav"

export const metadata = {
  title: "Merchant page",
  description: "Ecommerce application",
}

export default function MerchantLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* This will be rendered by the client component wrapper */}
      <MerchantLayoutClient>{children}</MerchantLayoutClient>
    </div>
  )
}

// Create a separate client component that contains the provider
function MerchantLayoutClient({ children }) {
  return (
    <SidebarProvider className='overflow-x-hidden'>
      {/* Sidebar on the left */}
      <AppSidebar />

      {/* Main Content */}
      <SidebarInset className="flex-1 flex flex-col">
        <MerchantNavBar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}