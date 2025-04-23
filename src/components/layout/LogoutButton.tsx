
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Sesión cerrada" });
  };
  return (
    <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2 text-red-500">
      <LogOut className="w-4 h-4" /> Salir
    </Button>
  );
};

export default LogoutButton;
