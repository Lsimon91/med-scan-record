
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    async function fetchUsers() {
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
    }
    fetchUsers();
  }, []);

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
                      <Badge variant="secondary" key={r}>{ROLES_LABELS[r] || r}</Badge>
                    ))}
                  </td>
                  <td>{new Date(u.created_at).toLocaleString()}</td>
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
