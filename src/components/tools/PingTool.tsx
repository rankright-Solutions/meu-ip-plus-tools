
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { pingHost } from '@/lib/network';

interface PingResult {
  time: number;
  success: boolean;
  timestamp: Date;
}

const PingTool = () => {
  const [host, setHost] = useState('google.com');
  const [pinging, setPinging] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  
  const handlePing = async () => {
    if (!host) {
      toast({
        title: "Erro",
        description: "Por favor, digite um host válido",
        variant: "destructive"
      });
      return;
    }
    
    setPinging(true);
    setResults([]);
    setAverageTime(null);
    
    let totalSuccessful = 0;
    let totalTime = 0;
    
    // Send 4 pings
    for (let i = 0; i < 4; i++) {
      try {
        const startTime = Date.now();
        const success = await pingHost(host);
        const endTime = Date.now();
        const time = endTime - startTime;
        
        const result = { time, success, timestamp: new Date() };
        setResults(prev => [...prev, result]);
        
        if (success) {
          totalSuccessful++;
          totalTime += time;
        }
        
        // Adding a small delay between pings
        if (i < 3) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error("Ping error:", error);
        setResults(prev => [...prev, { time: 0, success: false, timestamp: new Date() }]);
      }
    }
    
    if (totalSuccessful > 0) {
      setAverageTime(totalTime / totalSuccessful);
    }
    
    setPinging(false);
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
          onClick={handlePing} 
          disabled={pinging}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {pinging ? 'Pingando...' : 'Iniciar Ping'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Resultados:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${result.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="mr-2">Pacote {index + 1}:</span>
                {result.success ? (
                  <span>Tempo: {result.time}ms</span>
                ) : (
                  <span className="text-red-500">Tempo esgotado</span>
                )}
              </div>
            ))}
          </div>
          {averageTime !== null && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="font-semibold">
                Tempo médio: <span className="text-blue-600 dark:text-blue-400">{averageTime.toFixed(2)}ms</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pacotes recebidos: {results.filter(r => r.success).length} de {results.length}
              </p>
            </div>
          )}
        </div>
      )}
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          O ping mede o tempo que leva para um pacote de dados viajar do seu computador até um servidor e voltar. 
          É útil para verificar a conectividade e a latência da rede.
        </p>
      </Card>
    </div>
  );
};

export default PingTool;
