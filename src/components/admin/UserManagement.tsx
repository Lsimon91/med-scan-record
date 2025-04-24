
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  roles: string[];
  email: string | null;
}

const ROLES_LABELS: Record<string, string> = {
  administrativo: "Administrador",
  administrador: "Administrador",
  medico: "Médico",
  enfermero: "Enfermero",
  tecnico: "Técnico"
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchUsers = async () => {
    setLoading(true);
    // Unir profiles, user_roles, roles y auth.users para email
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `id, first_name, last_name, created_at,
         user_roles: user_roles(role_id, roles(name)),
         auth_users:auth.users(email)`
      );

    if (!error && data) {
      // Normalizar datos
      const formatted = await Promise.all(
        data.map(async (profile: any) => {
          // Obtener roles y emails (Puede estar anidado)
          const roles: string[] = profile.user_roles?.map((ur: any) => ur.roles?.name) ?? [];
          let email: string | null = null;
          // Si existe la tabla auth.users, obtener email
          if (profile.auth_users && profile.auth_users.length > 0) {
            email = profile.auth_users[0].email;
          }
          return {
            ...profile,
            roles,
            email
          };
        })
      );
      setUsers(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (userId: string, email: string | null) => {
    if (!email) return;
    
    try {
      // Primero verificar si el usuario tiene el rol de administrador
      const { data: existingRoles } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId);
        
      // Obtener el ID del rol administrador
      const { data: adminRole } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "administrador")
        .single();
      
      if (!adminRole) {
        toast({
          title: "Error",
          description: "No se encontró el rol de administrador",
          variant: "destructive"
        });
        return;
      }
      
      // Si el usuario no tiene el rol, asignarlo
      const adminRoleExists = existingRoles?.some(role => role.role_id === adminRole.id);
      
      if (!adminRoleExists) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role_id: adminRole.id });
        
        if (error) {
          toast({
            title: "Error",
            description: "No se pudo asignar el rol de administrador",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Rol asignado",
          description: `Usuario ${email} ahora es administrador`,
        });
        
        // Actualizar la lista de usuarios
        fetchUsers();
      } else {
        toast({
          title: "Información",
          description: `El usuario ${email} ya tiene el rol de administrador`,
        });
      }
    } catch (err) {
      console.error("Error al asignar rol de administrador:", err);
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar asignar el rol",
        variant: "destructive"
      });
    }
  };

  // Actualizar el usuario específico cuando la página cargue
  useEffect(() => {
    if (users.length > 0 && !loading) {
      const adminEmail = "admin@medicenter.cu";
      const adminUser = users.find(u => u.email === adminEmail);
      
      if (adminUser) {
        // Verificar si el usuario ya tiene el rol administrador
        const isAlreadyAdmin = adminUser.roles.includes("administrador");
        
        if (!isAlreadyAdmin) {
          makeAdmin(adminUser.id, adminUser.email);
        }
      }
    }
  }, [users, loading]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Usuarios del sistema</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border text-sm rounded">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Creado el</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id.slice(0,8)}</td>
                  <td>{[u.first_name, u.last_name].filter(Boolean).join(" ")}</td>
                  <td>{u.email || <i>No email</i>}</td>
                  <td>
                    {u.roles.map((r) => (
                      <Badge variant="secondary" key={r} className="mr-1 mb-1">{ROLES_LABELS[r] || r}</Badge>
                    ))}
                  </td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
                  <td>
                    {!u.roles.includes("administrador") && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => makeAdmin(u.id, u.email)}
                      >
                        Hacer Admin
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
