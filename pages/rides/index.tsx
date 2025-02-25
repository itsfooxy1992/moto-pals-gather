import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ... rest of your existing Rides component code ...

export default function Rides() {
  // ... existing code ...
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Your existing Rides page content */}
    </div>
  );
} 