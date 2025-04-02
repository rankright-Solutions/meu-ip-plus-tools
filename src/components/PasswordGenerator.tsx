
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clipboard, Check, RefreshCw, ShieldCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);
  
  useEffect(() => {
    generatePassword();
  }, []);
  
  useEffect(() => {
    calculateStrength();
  }, [password]);
  
  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let newPassword = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    setCopied(false);
  };
  
  const calculateStrength = () => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set strength score (0-5)
    setStrength(Math.min(5, score));
  };
  
  const getStrengthText = () => {
    switch (strength) {
      case 0: return { text: 'Muito fraca', color: 'text-red-600 dark:text-red-400' };
      case 1: return { text: 'Fraca', color: 'text-red-500 dark:text-red-400' };
      case 2: return { text: 'Média', color: 'text-orange-500 dark:text-orange-400' };
      case 3: return { text: 'Boa', color: 'text-yellow-500 dark:text-yellow-400' };
      case 4: return { text: 'Forte', color: 'text-green-500 dark:text-green-400' };
      case 5: return { text: 'Muito forte', color: 'text-green-600 dark:text-green-400' };
      default: return { text: 'Desconhecida', color: 'text-gray-500 dark:text-gray-400' };
    }
  };
  
  const strengthColors = [
    'bg-red-500',
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-green-500'
  ];
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Senha copiada para a área de transferência",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={password}
          readOnly
          className="font-mono text-lg py-6 pr-24"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
          <Button 
            onClick={generatePassword}
            variant="ghost" 
            size="icon"
            className="mr-1"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            onClick={copyToClipboard}
            variant="ghost" 
            size="icon"
            disabled={copied}
          >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <Label>Comprimento da senha: {length}</Label>
          </div>
          <Slider
            value={[length]}
            min={6}
            max={32}
            step={1}
            onValueChange={(value) => setLength(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>6</span>
            <span>12</span>
            <span>18</span>
            <span>24</span>
            <span>32</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="uppercase">Incluir letras maiúsculas (A-Z)</Label>
            <Switch 
              id="uppercase" 
              checked={useUppercase} 
              onCheckedChange={setUseUppercase} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="numbers">Incluir números (0-9)</Label>
            <Switch 
              id="numbers" 
              checked={useNumbers} 
              onCheckedChange={setUseNumbers} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="symbols">Incluir símbolos (!@#$%^&*)</Label>
            <Switch 
              id="symbols" 
              checked={useSymbols} 
              onCheckedChange={setUseSymbols} 
            />
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">Força da senha</Label>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`h-full w-1/5 ${i < strength ? strengthColors[strength] : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center">
            <ShieldCheck className={`h-4 w-4 mr-1 ${getStrengthText().color}`} />
            <span className={`text-sm ${getStrengthText().color}`}>
              {getStrengthText().text}
            </span>
          </div>
        </div>
        
        <div className="pt-2">
          <Button onClick={generatePassword} className="w-full bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" /> Gerar Nova Senha
          </Button>
        </div>
      </div>
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Senhas fortes são aquelas que combinam letras maiúsculas e minúsculas, números e símbolos, 
          e possuem pelo menos 12 caracteres. Evite usar informações pessoais ou palavras do dicionário.
        </p>
      </Card>
    </div>
  );
};

export default PasswordGenerator;
