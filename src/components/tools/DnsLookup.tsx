
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { dnsLookup } from '@/lib/network';

interface DnsRecord {
  type: string;
  value: string;
}

const DnsLookup = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DnsRecord[]>([]);
  
  const handleLookup = async () => {
    if (!domain) {
      toast({
        title: "Erro",
        description: "Por favor, digite um domínio válido",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResults([]);
    
    try {
      const dnsRecords = await dnsLookup(domain);
      setResults(dnsRecords);
      
      if (dnsRecords.length === 0) {
        toast({
          title: "Sem resultados",
          description: "Nenhum registro DNS encontrado",
        });
      }
    } catch (error) {
      console.error("DNS lookup error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar a consulta DNS",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Digite um domínio (ex: google.com)"
          className="flex-grow"
        />
        <Button 
          onClick={handleLookup} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Consultando...' : 'Consultar DNS'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-auto">
          <h3 className="font-semibold mb-2">Registros DNS para {domain}:</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-tl-lg">Tipo</th>
                <th className="text-left py-2 px-3 bg-gray-100 dark:bg-gray-700 rounded-tr-lg">Valor</th>
              </tr>
            </thead>
            <tbody>
              {results.map((record, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800'}>
                  <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700 font-medium">
                    {record.type}
                  </td>
                  <td className="py-2 px-3 border-t border-gray-200 dark:border-gray-700 font-mono text-sm break-all">
                    {record.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A consulta DNS (Domain Name System) converte nomes de domínio em endereços IP e fornece outros registros relacionados 
          ao domínio, como servidores de email, verificações de segurança e muito mais.
        </p>
      </Card>
    </div>
  );
};

export default DnsLookup;
