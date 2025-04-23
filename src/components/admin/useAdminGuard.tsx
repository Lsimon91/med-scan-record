
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Hook que restringe acceso sólo a administradores
export function useAdminGuard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function checkAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Acceso restringido", description: "Debes iniciar sesión." });
        navigate("/auth");
        return;
      }
      // Consultar roles de usuario
      const { data, error } = await supabase
        .from("user_roles")
        .select("role_id, roles(name)")
        .eq("user_id", session.user.id)
        .single();

      if (error || !data || data.roles.name !== "administrador") {
        toast({ title: "Sin permisos", description: "Solo administradores pueden acceder." });
        navigate("/");
      }
    }
    checkAdmin();
    return () => { isMounted = false; };
  }, []);
}
