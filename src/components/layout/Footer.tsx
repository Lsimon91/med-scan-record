
import React from "react";

const Footer = () => (
  <footer className="py-6 border-t bg-background">
    <div className="container mx-auto px-4 text-center text-muted-foreground">
      © {new Date().getFullYear()} MedScan Record - Sistema de Gestión Médica
    </div>
  </footer>
);

export default Footer;
