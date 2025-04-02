
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Wifi, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { testNetworkSpeed } from '@/lib/network';

interface SpeedResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
}

const SpeedTest = () => {
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [result, setResult] = useState<SpeedResult | null>(null);
  
  const handleSpeedTest = async () => {
    setTesting(true);
    setProgress(0);
    setCurrentTest('Inicializando...');
    setResult(null);
    
    try {
      // Simulating latency test
      setCurrentTest('Testando latência');
      for (let i = 0; i < 5; i++) {
        setProgress(i * 5);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Simulating download test
      setCurrentTest('Testando download');
      for (let i = 5; i < 55; i++) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simulating upload test
      setCurrentTest('Testando upload');
      for (let i = 55; i <= 100; i++) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Get results from network module
      const speedResult = await testNetworkSpeed();
      setResult(speedResult);
    } catch (error) {
      console.error("Speed test error:", error);
      toast({
        title: "Erro",
        description: "Erro ao executar o teste de velocidade",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
      setProgress(100);
      setCurrentTest('');
    }
  };
  
  const getSpeedRating = (speed: number) => {
    if (speed >= 50) return { text: 'Excelente', color: 'text-green-600 dark:text-green-400' };
    if (speed >= 25) return { text: 'Bom', color: 'text-blue-600 dark:text-blue-400' };
    if (speed >= 10) return { text: 'Médio', color: 'text-yellow-600 dark:text-yellow-400' };
    if (speed >= 5) return { text: 'Lento', color: 'text-orange-600 dark:text-orange-400' };
    return { text: 'Muito lento', color: 'text-red-600 dark:text-red-400' };
  };
  
  const getLatencyRating = (latency: number) => {
    if (latency < 20) return { text: 'Excelente', color: 'text-green-600 dark:text-green-400' };
    if (latency < 50) return { text: 'Bom', color: 'text-blue-600 dark:text-blue-400' };
    if (latency < 100) return { text: 'Médio', color: 'text-yellow-600 dark:text-yellow-400' };
    if (latency < 150) return { text: 'Alto', color: 'text-orange-600 dark:text-orange-400' };
    return { text: 'Muito alto', color: 'text-red-600 dark:text-red-400' };
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button 
          onClick={handleSpeedTest} 
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          size="lg"
        >
          <Wifi className="mr-2 h-4 w-4" />
          {testing ? 'Testando...' : 'Iniciar Teste de Velocidade'}
        </Button>
      </div>
      
      {testing && (
        <div className="space-y-2">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">{currentTest}</p>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center mb-4">
              <ArrowDown className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Download</h3>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{result.downloadSpeed.toFixed(2)}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1 mb-1">Mbps</span>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">Classificação: </span>
              <span className={getSpeedRating(result.downloadSpeed).color}>
                {getSpeedRating(result.downloadSpeed).text}
              </span>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center mb-4">
              <ArrowUp className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Upload</h3>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{result.uploadSpeed.toFixed(2)}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1 mb-1">Mbps</span>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-medium">Classificação: </span>
              <span className={getSpeedRating(result.uploadSpeed).color}>
                {getSpeedRating(result.uploadSpeed).text}
              </span>
            </div>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Latência</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{result.latency}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1 mb-0.5">ms</span>
            </div>
            <div className="text-sm mt-1">
              <span className="font-medium">Classificação: </span>
              <span className={getLatencyRating(result.latency).color}>
                {getLatencyRating(result.latency).text}
              </span>
            </div>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2">Jitter</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold">{result.jitter}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1 mb-0.5">ms</span>
            </div>
            <div className="text-sm mt-1">
              <p className="text-gray-500 dark:text-gray-400">
                Jitter é a variação da latência ao longo do tempo
              </p>
            </div>
          </Card>
        </div>
      )}
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          O teste de velocidade mede a velocidade de download e upload da sua conexão com a internet, 
          além da latência (ping) e jitter. Os resultados podem variar dependendo do seu provedor, 
          localização e condições da rede.
        </p>
      </Card>
    </div>
  );
};

export default SpeedTest;
