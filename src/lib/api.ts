
// Simulated API functions that would normally call real endpoints
// In a production app, these would make actual fetch calls

export interface IpInfo {
  ip: string;
  type: 'IPv4' | 'IPv6';
  isp?: string;
  hostname?: string;
}

export interface GeoLocation {
  country: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

// Fetch the user's IP information
export const fetchIpInfo = async (): Promise<IpInfo> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ip: '192.168.1.' + Math.floor(Math.random() * 255),
        type: 'IPv4',
        isp: 'Example ISP Provider',
        hostname: 'host-' + Math.floor(Math.random() * 100) + '.example.com'
      });
    }, 500);
  });
};

// Fetch the user's geolocation based on IP
export const fetchGeoLocation = async (): Promise<GeoLocation> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        country: 'Brasil',
        city: 'São Paulo',
        region: 'SP',
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo'
      });
    }, 800);
  });
};

// These would be actual API calls in a real application
