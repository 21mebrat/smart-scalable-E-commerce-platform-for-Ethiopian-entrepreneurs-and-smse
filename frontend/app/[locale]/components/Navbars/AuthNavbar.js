"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { SignedIn, useAuth, UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar() {
  const { isSignedIn, isLoaded, userId } = useAuth()
  const { user } = useUser()
  const [uniqueId, setUniqueId] = useState();
  const [role, setRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true); // Set to true when scrolled down
      } else {
        setIsScrolled(false); // Reset to false when at the top of the page
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is loaded, signed in, and if userId exists
    if (isLoaded && isSignedIn && userId) {
      setUniqueId(userId); // Set unique ID if user is signed in
      setRole(localStorage.getItem("role")); // Get the role from localStorage
    } else {
      // Clear the state if user is logged out
      setUniqueId(null);
      setRole(null);
    }
  }, [isLoaded, isSignedIn, userId]);

  const navLinks = [
    ...(uniqueId
      ? [
        {
          name: "Profile",
          href: role === "merchant" ? "/admin/settings" : "/profile",
        },
        ...(role === "merchant"
          ? [{ name: "Dashboard", href: "/admin/dashboard" }]
          : []),
      ]
      : [
        { name: "Login", href: "/sign-in" },
        { name: "Register", href: "/sign-up" },
        { name: "Welcome", href: "/sign-up" },
      ]),
  ];

  return (
    <header
      className={cn(
        "w-full backdrop-blur absolute top-0 z-50 transition-all",
        isScrolled ? "bg-gray-900 shadow-md fixed top-0 " : ""
      )}
    >
      <div className="container mx-auto px-5 flex h-16 items-center justify-between">
        {/* Desktop Logo */}
        <Link href="/" className="hidden md:flex items-center hover:text-orange-300 gap-2 font-bold">
          <span className="text-white">E-Commerce</span>
          <span className="text-white">Platform</span>
        </Link>

        {/* Mobile Hamburger Menu */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="h-6 w-6 text-white focus:outline-none" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle> Menus</SheetTitle>

            <div className="flex flex-col gap-4 pt-6">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold mb-6 hover:text-orange-300"
              >
                <span className="text-white">E-Commerce</span>
                <span className="text-white">Platform</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium w-full bg-gray-200 py-2 hover:bg-gray-400 text-center rounded-full transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
              <LanguageSwitcher />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink className="lg:text-white lg:hover:text-orange-300 text-blueGray-700 px-3 py-4 mx-3 lg:py-2 flex items-center text-xs uppercase font-bold">
                    {link.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center">
          {uniqueId && (
            <SignedIn>
              <UserButton />
            </SignedIn>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
