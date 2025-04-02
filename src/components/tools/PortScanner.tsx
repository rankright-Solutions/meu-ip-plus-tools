
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { scanPorts } from '@/lib/network';

interface PortResult {
  port: number;
  service: string;
  open: boolean;
}

const commonPorts = [
  { port: 21, service: 'FTP' },
  { port: 22, service: 'SSH' },
  { port: 23, service: 'Telnet' },
  { port: 25, service: 'SMTP' },
  { port: 53, service: 'DNS' },
  { port: 80, service: 'HTTP' },
  { port: 110, service: 'POP3' },
  { port: 143, service: 'IMAP' },
  { port: 443, service: 'HTTPS' },
  { port: 465, service: 'SMTPS' },
  { port: 587, service: 'SMTP (Submission)' },
  { port: 993, service: 'IMAPS' },
  { port: 995, service: 'POP3S' },
  { port: 3306, service: 'MySQL' },
  { port: 5432, service: 'PostgreSQL' },
  { port: 8080, service: 'HTTP Alternate' },
  { port: 8443, service: 'HTTPS Alternate' }
];

const PortScanner = () => {
  const [host, setHost] = useState('');
  const [customPort, setCustomPort] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<PortResult[]>([]);
  const [selectedPorts, setSelectedPorts] = useState<number[]>([80, 443]);
  
  const togglePort = (port: number) => {
    if (selectedPorts.includes(port)) {
      setSelectedPorts(selectedPorts.filter(p => p !== port));
    } else {
      setSelectedPorts([...selectedPorts, port]);
    }
  };
  
  const addCustomPort = () => {
    const port = parseInt(customPort);
    if (isNaN(port) || port < 1 || port > 65535) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de porta válido (1-65535)",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPorts.includes(port)) {
      setSelectedPorts([...selectedPorts, port]);
      setCustomPort('');
    } else {
      toast({
        title: "Aviso",
        description: "Esta porta já está selecionada",
      });
    }
  };
  
  const handleScan = async () => {
    if (!host) {
      toast({
        title: "Erro",
        description: "Por favor, digite um host válido",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedPorts.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos uma porta",
        variant: "destructive"
      });
      return;
    }
    
    setScanning(true);
    setResults([]);
    
    try {
      // For each port, simulate a scan
      const results = await scanPorts(host, selectedPorts);
      setResults(results);
    } catch (error) {
      console.error("Port scanning error:", error);
      toast({
        title: "Erro",
        description: "Erro ao escanear portas",
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="Digite um host (ex: google.com)"
          className="flex-grow"
        />
        <Button 
          onClick={handleScan} 
          disabled={scanning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {scanning ? 'Escaneando...' : 'Escanear Portas'}
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <Card className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-2">Portas Comuns</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {commonPorts.map((item) => (
                <div key={item.port} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`port-${item.port}`}
                    checked={selectedPorts.includes(item.port)}
                    onCheckedChange={() => togglePort(item.port)}
                  />
                  <label
                    htmlFor={`port-${item.port}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.port} ({item.service})
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="md:w-1/2">
          <Card className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-2">Porta Personalizada</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                value={customPort}
                onChange={(e) => setCustomPort(e.target.value)}
                placeholder="Digite um número de porta"
                min="1"
                max="65535"
              />
              <Button onClick={addCustomPort} variant="outline">Adicionar</Button>
            </div>
            
            {selectedPorts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Portas Selecionadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPorts.sort((a, b) => a - b).map((port) => (
                    <div key={port} className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-xs flex items-center">
                      {port}
                      <button 
                        onClick={() => togglePort(port)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Resultados para {host}:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">Porta</th>
                  <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">Serviço</th>
                  <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'}>
                    <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700">
                      {result.port}
                    </td>
                    <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700">
                      {result.service || 'Desconhecido'}
                    </td>
                    <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700">
                      <span className={`px-2 py-1 rounded text-xs ${result.open ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {result.open ? 'Aberta' : 'Fechada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          O escaneador de portas verifica quais portas TCP estão abertas em um host remoto. Isso pode ser útil para 
          diagnosticar problemas de conectividade ou verificar a segurança de um servidor.
        </p>
      </Card>
    </div>
  );
};

export default PortScanner;
