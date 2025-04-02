
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clipboard, Check, ArrowDownUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type EncodingType = 'base64' | 'url' | 'hex' | 'binary' | 'morse';

const TextEncoder = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encodingType, setEncodingType] = useState<EncodingType>('base64');
  const [isEncoding, setIsEncoding] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (inputText) {
      convertText();
    }
  }, [encodingType, isEncoding]);
  
  const convertText = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    
    try {
      if (isEncoding) {
        setOutputText(encodeText(inputText, encodingType));
      } else {
        setOutputText(decodeText(inputText, encodingType));
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o texto. Verifique a entrada.",
        variant: "destructive"
      });
      setOutputText('Erro: Formato inválido');
    }
  };
  
  const encodeText = (text: string, type: EncodingType): string => {
    switch (type) {
      case 'base64':
        return btoa(text);
      case 'url':
        return encodeURIComponent(text);
      case 'hex':
        return Array.from(text)
          .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      case 'binary':
        return Array.from(text)
          .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ');
      case 'morse':
        return textToMorse(text);
      default:
        return text;
    }
  };
  
  const decodeText = (text: string, type: EncodingType): string => {
    switch (type) {
      case 'base64':
        return atob(text);
      case 'url':
        return decodeURIComponent(text);
      case 'hex':
        return text.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
      case 'binary':
        return text
          .split(' ')
          .map(bin => String.fromCharCode(parseInt(bin, 2)))
          .join('');
      case 'morse':
        return morseToText(text);
      default:
        return text;
    }
  };
  
  // Morse code conversion
  const morseCodeMap: Record<string, string> = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
    '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '$': '...-..-', '@': '.--.-.'
  };
  
  const reverseMorseCodeMap: Record<string, string> = Object.entries(morseCodeMap).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);
  
  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        if (char === ' ') return '/'
        return morseCodeMap[char] || char;
      })
      .join(' ');
  };
  
  const morseToText = (morse: string): string => {
    return morse
      .split(' ')
      .map(code => {
        if (code === '/') return ' ';
        return reverseMorseCodeMap[code] || code;
      })
      .join('');
  };
  
  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setIsEncoding(!isEncoding);
  };
  
  const copyToClipboard = async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2">
          <Select
            value={encodingType}
            onValueChange={(value) => setEncodingType(value as EncodingType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base64">Base64</SelectItem>
              <SelectItem value="url">URL</SelectItem>
              <SelectItem value="hex">Hexadecimal</SelectItem>
              <SelectItem value="binary">Binário</SelectItem>
              <SelectItem value="morse">Código Morse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Button
            variant="outline"
            onClick={() => setIsEncoding(!isEncoding)}
            className="flex items-center"
          >
            {isEncoding ? 'Codificar' : 'Decodificar'}
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Textarea
          placeholder={isEncoding ? "Digite o texto para codificar..." : "Cole o texto para decodificar..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-24"
        />
      </div>
      
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={swapTexts}
          className="rounded-full w-10 h-10 p-0"
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="relative">
        <Textarea
          placeholder="Resultado..."
          value={outputText}
          readOnly
          className="min-h-24"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          disabled={!outputText || copied}
          className="absolute right-2 top-2"
        >
          {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={convertText}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isEncoding ? 'Codificar' : 'Decodificar'}
        </Button>
      </div>
      
      <Card className="p-4 bg-blue-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Base64:</strong> Codificação útil para transferir dados binários em texto ASCII.<br />
          <strong>URL:</strong> Codifica caracteres especiais para uso em URLs.<br />
          <strong>Hexadecimal:</strong> Converte texto para representação hexadecimal (base 16).<br />
          <strong>Binário:</strong> Converte texto para representação binária (0s e 1s).<br />
          <strong>Morse:</strong> Codifica texto em código Morse usando pontos e traços.
        </p>
      </Card>
    </div>
  );
};

export default TextEncoder;
