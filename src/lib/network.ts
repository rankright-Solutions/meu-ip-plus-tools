
// Simulated network utility functions

export const pingHost = async (host: string): Promise<boolean> => {
  // In a real implementation, this would use the Fetch API to ping the host
  // For now, we'll simulate a ping with random success/fail
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() > 0.1); // 90% success rate
    }, 300 + Math.random() * 500);
  });
};

export interface DnsRecord {
  type: string;
  value: string;
}

export const dnsLookup = async (domain: string): Promise<DnsRecord[]> => {
  // Simulate DNS lookup
  return new Promise((resolve) => {
    setTimeout(() => {
      const records: DnsRecord[] = [
        { type: 'A', value: '192.168.1.' + Math.floor(Math.random() * 255) },
        { type: 'AAAA', value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
        { type: 'MX', value: 'mail.' + domain + ' priority 10' },
        { type: 'NS', value: 'ns1.' + domain },
        { type: 'NS', value: 'ns2.' + domain },
        { type: 'TXT', value: 'v=spf1 include:_spf.' + domain + ' ~all' },
      ];
      resolve(records);
    }, 1000);
  });
};

export interface PortResult {
  port: number;
  service: string;
  open: boolean;
}

export const scanPorts = async (host: string, ports: number[]): Promise<PortResult[]> => {
  // Simulate port scanning
  const getServiceName = (port: number): string => {
    const services: Record<number, string> = {
      21: 'FTP',
      22: 'SSH',
      23: 'Telnet',
      25: 'SMTP',
      53: 'DNS',
      80: 'HTTP',
      110: 'POP3',
      143: 'IMAP',
      443: 'HTTPS',
      465: 'SMTPS',
      587: 'SMTP (Submission)',
      993: 'IMAPS',
      995: 'POP3S',
      3306: 'MySQL',
      5432: 'PostgreSQL',
      8080: 'HTTP Alternate',
      8443: 'HTTPS Alternate'
    };
    return services[port] || 'Unknown';
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = ports.map(port => ({
        port,
        service: getServiceName(port),
        open: Math.random() > 0.5 // Randomly open or closed
      }));
      resolve(results);
    }, 1500);
  });
};

export interface SpeedResult {
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
}

export const testNetworkSpeed = async (): Promise<SpeedResult> => {
  // Simulate a speed test
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        downloadSpeed: 10 + Math.random() * 90, // 10-100 Mbps
        uploadSpeed: 5 + Math.random() * 45, // 5-50 Mbps
        latency: 10 + Math.random() * 90, // 10-100 ms
        jitter: Math.random() * 20, // 0-20 ms
      });
    }, 3000);
  });
};

export interface HopResult {
  hop: number;
  ip: string;
  hostname?: string;
  time: number;
}

export const performTraceroute = async (host: string): Promise<HopResult[]> => {
  // Simulate traceroute
  return new Promise((resolve) => {
    setTimeout(() => {
      const hops: HopResult[] = [];
      const totalHops = 5 + Math.floor(Math.random() * 8); // 5-12 hops
      
      for (let i = 1; i <= totalHops; i++) {
        const ip = `192.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        hops.push({
          hop: i,
          ip,
          hostname: i === totalHops ? host : `router-${i}.isp.net`,
          time: 10 + Math.floor(Math.random() * 90) // 10-100 ms
        });
      }
      
      resolve(hops);
    }, 2000);
  });
};

export interface WhoisData {
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

export const whoisLookup = async (domain: string): Promise<WhoisData> => {
  // Simulate WHOIS lookup
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const created = new Date(now);
      created.setFullYear(created.getFullYear() - 3);
      const expires = new Date(now);
      expires.setFullYear(expires.getFullYear() + 2);
      const updated = new Date(now);
      updated.setMonth(updated.getMonth() - 2);
      
      const nameServers = [
        `ns1.${domain}`,
        `ns2.${domain}`,
        `ns3.${domain}`
      ];
      
      const statusCodes = [
        'clientTransferProhibited',
        'serverDeleteProhibited',
        'serverTransferProhibited',
        'serverUpdateProhibited'
      ];
      
      const rawText = `Domain Name: ${domain}
Registrar: Example Registrar, Inc.
WHOIS Server: whois.example.com
Referral URL: http://www.example.com
Name Server: ${nameServers[0]}
Name Server: ${nameServers[1]}
Name Server: ${nameServers[2]}
Status: ${statusCodes[0]}
Status: ${statusCodes[1]}
Updated Date: ${updated.toISOString()}
Creation Date: ${created.toISOString()}
Expiration Date: ${expires.toISOString()}
>>> Last update of WHOIS database: ${now.toISOString()} <<<`;
      
      resolve({
        domainName: domain,
        registrar: 'Example Registrar, Inc.',
        creationDate: created.toISOString(),
        expiryDate: expires.toISOString(),
        updatedDate: updated.toISOString(),
        nameServers,
        registrantName: 'Domain Administrator',
        registrantOrganization: 'Example Organization',
        registrantCountry: 'BR',
        status: statusCodes,
        rawText
      });
    }, 1500);
  });
};
