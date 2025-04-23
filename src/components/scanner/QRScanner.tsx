
import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScanQrCode } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => console.error("Error stopping scanner:", error));
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      if (!containerRef.current) return;
      
      // Initialize scanner if not already done
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }
      
      const qrCodeSuccessCallback = (decodedText: string) => {
        onScanSuccess(decodedText);
        setScanning(false);
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(error => console.error("Error stopping scanner:", error));
        }
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      setScanning(true);
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
          if (onScanError) {
            onScanError(errorMessage);
          }
        }
      );
      
      setPermission(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setPermission(false);
      setScanning(false);
      if (onScanError) {
        onScanError(err instanceof Error ? err.message : String(err));
      }
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        setScanning(false);
      }).catch(error => {
        console.error("Error stopping scanner:", error);
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div 
            id="qr-reader" 
            ref={containerRef} 
            className={`w-full ${scanning ? 'h-64' : 'h-0'} overflow-hidden rounded-lg`}
          />
          
          {permission === false && (
            <div className="text-center text-red-500 mb-4">
              No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara e intenta de nuevo.
            </div>
          )}
          
          {!scanning ? (
            <Button 
              onClick={startScanner} 
              className="w-full"
            >
              <ScanQrCode className="mr-2 h-5 w-5" />
              Escanear Código QR
            </Button>
          ) : (
            <Button 
              onClick={stopScanner} 
              variant="destructive"
              className="w-full"
            >
              Detener Escáner
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;
