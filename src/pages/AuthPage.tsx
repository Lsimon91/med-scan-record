
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Si ya hay sesión, redirige a /
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) navigate("/");
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Error al iniciar sesión", description: error.message });
      } else {
        toast({ title: "Sesión iniciada" });
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: "Error al registrar", description: error.message });
      } else {
        toast({ title: "Cuenta creada", description: "Verifica tu email para activar la cuenta." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Procesando..." : isLogin ? "Entrar" : "Registrarse"}
        </Button>
      </form>
      <div className="text-center mt-4">
        {isLogin
          ? (<span>¿No tienes cuenta?{" "}
              <button className="text-primary underline" onClick={() => setIsLogin(false)}>
                Registrarse
              </button>
            </span>)
          : (<span>¿Ya tienes cuenta?{" "}
              <button className="text-primary underline" onClick={() => setIsLogin(true)}>
                Iniciar sesión
              </button>
            </span>)
        }
      </div>
    </div>
  );
};

export default AuthPage;
