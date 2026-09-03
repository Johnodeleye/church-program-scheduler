"use client";

import { useState, useEffect } from "react";
import Passcode from "@/components/Passcode";
import Dashboard from "../components/Dashboard";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check auth
    const auth = localStorage.getItem('rccg_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isClient) {
    return null; // Prevent hydration issues
  }

  // Show InstallPrompt on BOTH screens
  return (
    <>
      {!isAuthenticated ? (
        <Passcode onSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <Dashboard />
      )}
      <InstallPrompt />
    </>
  );
}