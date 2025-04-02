
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { whoisLookup } from '@/lib/network';

interface WhoisData {
  domainName: string;
  registrar?: string;
  creationDate?: string;
  expiryDate?: string;
  updatedDate?: string;
  nameServers?: string[];
  registrantName?: string;
  registrantOrganization?: string;
  registrantCountry?: string;
  status?: string[];
  rawText: string;
}

const WhoisLookup = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhoisData | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  
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
    setResult(null);
    setShowRaw(false);
    
    try {
      const whoisData = await whoisLookup(domain);
      setResult(whoisData);
    } catch (error) {
      console.error("WHOIS lookup error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível obter informações WHOIS",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
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
          {loading ? 'Consultando...' : 'Consultar WHOIS'}
        </Button>
      </div>
      
      {result && (
        <div className="space-y-4">
          <Card className="p-4 bg-white dark:bg-gray-800">
            <h3 className="font-semibold mb-2">Informações para {result.domainName}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Registro</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 font-medium">Registrador:</td>
                      <td className="py-2">{result.registrar || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 font-medium">Data de Criação:</td>
                      <td className="py-2">{formatDate(result.creationDate)}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 font-medium">Data de Expiração:</td>
                      <td className="py-2">{formatDate(result.expiryDate)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Última Atualização:</td>
                      <td className="py-2">{formatDate(result.updatedDate)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Registrante</h4>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 font-medium">Nome:</td>
                      <td className="py-2">{result.registrantName || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-2 font-medium">Organização:</td>
                      <td className="py-2">{result.registrantOrganization || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">País:</td>
                      <td className="py-2">{result.registrantCountry || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {result.nameServers && result.nameServers.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Servidores de Nome</h4>
                <ul className="list-disc list-inside text-sm">
                  {result.nameServers.map((ns, index) => (
                    <li key={index} className="py-1">{ns}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.status && result.status.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {result.status.map((status, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs"
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? 'Ocultar WHOIS bruto' : 'Mostrar WHOIS bruto'}
              </Button>
            </div>
          </Card>
          
          {showRaw && (
            <Card className="p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="font-semibold mb-2">WHOIS bruto</h3>
              <pre className="whitespace-pre-wrap text-xs font-mono bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-auto max-h-64">
                {result.rawText}
              </pre>
            </Card>
          )}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Consultando informações WHOIS...</p>
        </div>
      )}
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          O WHOIS fornece informações sobre o registrante de um domínio, incluindo quem o registrou, 
          quando foi registrado e quando expira. Essas informações podem ser úteis para determinar a 
          legitimidade de um site ou entrar em contato com seu proprietário.
        </p>
      </Card>
    </div>
  );
};

export default WhoisLookup;
