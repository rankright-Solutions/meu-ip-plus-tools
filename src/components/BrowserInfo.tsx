
import { useState, useEffect } from 'react';
import { Monitor, Cpu, Globe, Clock, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface SystemInfo {
  browser: string;
  browserVersion: string;
  os: string;
  screenResolution: string;
  language: string;
  timezone: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  touchscreen: boolean;
  memoryUsage?: number;
}

const BrowserInfo = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryCharging, setBatteryCharging] = useState<boolean | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    getSystemInfo();
    getBatteryInfo();
    
    // Update memory usage every 5 seconds
    const memoryInterval = setInterval(() => {
      if ((performance as any).memory) {
        setSystemInfo(prev => {
          if (!prev) return prev;
          
          const memory = (performance as any).memory;
          const usedMemory = memory.usedJSHeapSize;
          const totalMemory = memory.jsHeapSizeLimit;
          const memoryUsage = (usedMemory / totalMemory) * 100;
          
          return {
            ...prev,
            memoryUsage
          };
        });
      }
    }, 5000);
    
    return () => clearInterval(memoryInterval);
  }, []);
  
  const getSystemInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Desconhecido';
    let browserVersion = 'Desconhecido';
    let os = 'Desconhecido';
    
    // Detect browser and version
    if (userAgent.indexOf("Firefox") > -1) {
      browser = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf("Edg") > -1) {
      browser = "Edge";
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf("Chrome") > -1) {
      browser = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
      browser = "Safari";
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
      browser = "Internet Explorer";
      browserVersion = userAgent.match(/(?:MSIE |rv:)([0-9.]+)/)?.[1] || '';
    }
    
    // Detect OS
    if (userAgent.indexOf("Win") > -1) {
      os = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
      os = "MacOS";
    } else if (userAgent.indexOf("Linux") > -1) {
      os = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
      os = "Android";
    } else if (userAgent.indexOf("iOS") > -1 || userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
      os = "iOS";
    }
    
    const screenResolution = `${window.screen.width} x ${window.screen.height}`;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cookiesEnabled = navigator.cookieEnabled;
    
    // Check for localStorage and sessionStorage support
    let localStorage = false;
    let sessionStorage = false;
    
    try {
      localStorage = !!window.localStorage;
      sessionStorage = !!window.sessionStorage;
    } catch (e) {
      // Access might be denied due to browser settings
    }
    
    const touchscreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Get memory usage if available
    let memoryUsage;
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize;
      const totalMemory = memory.jsHeapSizeLimit;
      memoryUsage = (usedMemory / totalMemory) * 100;
    }
    
    setSystemInfo({
      browser,
      browserVersion,
      os,
      screenResolution,
      language,
      timezone,
      cookiesEnabled,
      localStorage,
      sessionStorage,
      touchscreen,
      memoryUsage
    });
  };
  
  const getBatteryInfo = async () => {
    if ((navigator as any).getBattery) {
      try {
        const battery = await (navigator as any).getBattery();
        
        // Initial battery info
        setBatteryLevel(battery.level * 100);
        setBatteryCharging(battery.charging);
        
        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
        
        battery.addEventListener('chargingchange', () => {
          setBatteryCharging(battery.charging);
        });
      } catch (error) {
        console.error('Error getting battery info:', error);
      }
    }
  };
  
  if (!systemInfo) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-semibold">Navegador</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Navegador:</span>
              <span className="font-medium">{systemInfo.browser}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Versão:</span>
              <span className="font-medium">{systemInfo.browserVersion}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Idioma:</span>
              <span className="font-medium">{systemInfo.language}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Cookies Habilitados:</span>
              <span className="font-medium">{systemInfo.cookiesEnabled ? 'Sim' : 'Não'}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-semibold">Sistema</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Sistema Operacional:</span>
              <span className="font-medium">{systemInfo.os}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Resolução da Tela:</span>
              <span className="font-medium">{systemInfo.screenResolution}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Touchscreen:</span>
              <span className="font-medium">{systemInfo.touchscreen ? 'Sim' : 'Não'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Fuso Horário:</span>
              <span className="font-medium">{systemInfo.timezone}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center mb-3">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-semibold">Armazenamento</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">LocalStorage:</span>
              <span className="font-medium">{systemInfo.localStorage ? 'Disponível' : 'Indisponível'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">SessionStorage:</span>
              <span className="font-medium">{systemInfo.sessionStorage ? 'Disponível' : 'Indisponível'}</span>
            </li>
            {systemInfo.memoryUsage !== undefined && (
              <li className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Uso de Memória:</span>
                  <span className="font-medium">{systemInfo.memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={systemInfo.memoryUsage} className="h-2" />
              </li>
            )}
          </ul>
        </div>
        
        {batteryLevel !== null && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-semibold">Bateria</h3>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500 dark:text-gray-400">Nível da Bateria:</span>
                <span className="font-medium">{batteryLevel.toFixed(0)}%</span>
              </div>
              <Progress value={batteryLevel} className="h-2" />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Status: {batteryCharging ? 'Carregando' : 'Descarregando'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserInfo;
