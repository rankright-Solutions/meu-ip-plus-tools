
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { name: "IP Público", href: "#ip" },
    { name: "Localização", href: "#geolocation" },
    { name: "Ferramentas", href: "#network" },
    { name: "Gerador de Senhas", href: "#password" },
    { name: "Codificador", href: "#encoder" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-2">Meu IP</h1>
          <span className="bg-blue-500 px-2 py-0.5 rounded-full text-xs font-medium">Plus</span>
        </div>
        
        {isMobile ? (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:bg-blue-700">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white dark:bg-gray-900 w-[240px]">
                <nav className="flex flex-col mt-6">
                  {menuItems.map((item) => (
                    <a 
                      key={item.name}
                      href={item.href}
                      className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-md text-gray-800 dark:text-gray-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center">
            <nav className="mr-6">
              {menuItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className="mx-2 text-sm font-medium hover:text-blue-200 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-white hover:bg-blue-700">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
