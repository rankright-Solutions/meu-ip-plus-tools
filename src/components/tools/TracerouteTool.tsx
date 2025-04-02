
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { performTraceroute } from '@/lib/network';

interface HopResult {
  hop: number;
  ip: string;
  hostname?: string;
  time: number;
}

const TracerouteTool = () => {
  const [host, setHost] = useState('');
  const [tracing, setTracing] = useState(false);
  const [results, setResults] = useState<HopResult[]>([]);
  
  const handleTrace = async () => {
    if (!host) {
      toast({
        title: "Erro",
        description: "Por favor, digite um host válido",
        variant: "destructive"
      });
      return;
    }
    
    setTracing(true);
    setResults([]);
    
    try {
      const hops = await performTraceroute(host);
      setResults(hops);
      
      if (hops.length === 0) {
        toast({
          title: "Sem resultados",
          description: "Não foi possível traçar a rota",
        });
      }
    } catch (error) {
      console.error("Traceroute error:", error);
      toast({
        title: "Erro",
        description: "Erro ao executar o traceroute",
        variant: "destructive"
      });
    } finally {
      setTracing(false);
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
          onClick={handleTrace} 
          disabled={tracing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {tracing ? 'Rastreando...' : 'Iniciar Traceroute'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto">
          <h3 className="font-semibold mb-2">Rota para {host}:</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">#</th>
                <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">IP</th>
                <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">Hostname</th>
                <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {results.map((hop) => (
                <tr key={hop.hop} className={hop.hop % 2 === 0 ? 'bg-white dark:bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700">
                    {hop.hop}
                  </td>
                  <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700 font-mono text-sm">
                    {hop.ip}
                  </td>
                  <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700 font-mono text-sm">
                    {hop.hostname || '*'}
                  </td>
                  <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700">
                    {hop.time} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {tracing && results.length === 0 && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Rastreando rota até {host}...</p>
        </div>
      )}
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          O traceroute mostra o caminho que os pacotes de rede percorrem do seu computador até um destino, 
          exibindo cada roteador no caminho e o tempo que leva para alcançá-lo.
        </p>
      </Card>
    </div>
  );
};

export default TracerouteTool;
