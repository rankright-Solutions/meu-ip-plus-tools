
import { useState, useEffect } from 'react';
import { MapPin, Flag, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { fetchGeoLocation } from '@/lib/api';

interface GeoData {
  country: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

const GeolocationTool = () => {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  
  useEffect(() => {
    getLocation();
  }, []);
  
  const getLocation = async () => {
    try {
      setLoading(true);
      const data = await fetchGeoLocation();
      setGeoData(data);
      setShowMap(true);
    } catch (error) {
      console.error('Error fetching location:', error);
      toast({
        title: "Erro",
        description: "Não foi possível obter sua localização",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getMapUrl = () => {
    if (!geoData) return '';
    return `https://www.openstreetmap.org/export/embed.html?bbox=${geoData.longitude-0.01},${geoData.latitude-0.01},${geoData.longitude+0.01},${geoData.latitude+0.01}&layer=mapnik&marker=${geoData.latitude},${geoData.longitude}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start">
          <Flag className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold">País</h3>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{geoData?.country || "Desconhecido"}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start">
          <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold">Cidade</h3>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{geoData?.city || "Desconhecido"}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-start">
          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold">Fuso Horário</h3>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">{geoData?.timezone || "Desconhecido"}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mb-4">
        <Button onClick={getLocation} className="bg-blue-600 hover:bg-blue-700">
          <MapPin className="mr-2 h-4 w-4" /> Atualizar Localização
        </Button>
      </div>
      
      {showMap && geoData && (
        <div className="relative rounded-lg overflow-hidden shadow-md" style={{ height: '300px' }}>
          <iframe 
            src={getMapUrl()}
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen
            aria-hidden="false" 
            tabIndex={0}
            title="User Location Map"
          ></iframe>
        </div>
      )}
      
      {loading && !showMap && (
        <div className="relative rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800" style={{ height: '300px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeolocationTool;
