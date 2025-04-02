
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const [year] = useState(new Date().getFullYear());
  
  const handleClick = () => {
    toast({
      title: "Obrigado!",
      description: "Agradecemos pelo feedback positivo!",
    });
  };
  
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Meu IP Plus</h3>
            <p className="text-gray-400">
              Ferramenta completa para diagnóstico e informações sobre sua conexão com a internet.
            </p>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-white border-blue-500 hover:bg-blue-700"
                onClick={handleClick}
              >
                <Heart className="mr-2 h-4 w-4 text-red-500" /> Curtir
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#ip" className="hover:text-blue-400 transition-colors">IP Público</a></li>
              <li><a href="#geolocation" className="hover:text-blue-400 transition-colors">Localização</a></li>
              <li><a href="#network" className="hover:text-blue-400 transition-colors">Ferramentas de Rede</a></li>
              <li><a href="#password" className="hover:text-blue-400 transition-colors">Gerador de Senhas</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {year} meu-ip.com | Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
