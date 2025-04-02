
import { useState, useEffect } from 'react';
import { Clipboard, Check, Globe, Cpu, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { fetchIpInfo } from '@/lib/api';

interface IpData {
  ip: string;
  type: string;
  isp?: string;
  hostname?: string;
  localIp?: string;
}

const IpInfo = () => {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const getIpInfo = async () => {
      try {
        setLoading(true);
        // Get the public IP
        const data = await fetchIpInfo();
        
        // Get local IPs
        const localIp = await getLocalIp();
        
        setIpData({
          ...data,
          localIp
        });
      } catch (error) {
        console.error('Error fetching IP info:', error);
        toast({
          title: "Erro",
          description: "Não foi possível obter informações do IP",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getIpInfo();
  }, []);
  
  // Function to get local IPs
  const getLocalIp = async (): Promise<string> => {
    return new Promise((resolve) => {
      // Fallback to a placeholder in case WebRTC is not available
      setTimeout(() => resolve("Não disponível"), 1000);
      
      try {
        const RTCPeerConnection = window.RTCPeerConnection || 
                                  (window as any).webkitRTCPeerConnection || 
                                  (window as any).mozRTCPeerConnection;
        
        if (!RTCPeerConnection) {
          resolve("Não disponível");
          return;
        }
        
        const pc = new RTCPeerConnection({
          iceServers: []
        });
        
        pc.createDataChannel("");
        pc.createOffer().then(pc.setLocalDescription.bind(pc));
        
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) return;
          
          const localIpRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
          const match = localIpRegex.exec(ice.candidate.candidate);
          const localIp = match ? match[1] : "Não disponível";
          
          pc.onicecandidate = null;
          pc.close();
          
          resolve(localIp);
        };
      } catch (e) {
        resolve("Não disponível");
      }
    });
  };
  
  const copyToClipboard = async () => {
    if (!ipData?.ip) return;
    
    try {
      await navigator.clipboard.writeText(ipData.ip);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "IP copiado para a área de transferência",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o IP",
        variant: "destructive"
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 dark:bg-gray-800 p-4 rounded-xl">
        <div className="flex items-center">
          <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Seu IP Público</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{ipData?.ip || "Não disponível"}</p>
          </div>
        </div>
        <Button 
          onClick={copyToClipboard} 
          className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700"
          disabled={copied}
        >
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
          {copied ? "Copiado" : "Copiar IP"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/70 dark:bg-gray-800/70 border-blue-100 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold">IP Local</h3>
                <p className="text-gray-700 dark:text-gray-300">{ipData?.localIp || "Não disponível"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 dark:bg-gray-800/70 border-blue-100 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold">Provedor (ISP)</h3>
                <p className="text-gray-700 dark:text-gray-300">{ipData?.isp || "Não disponível"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IpInfo;
