
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PingTool from '@/components/tools/PingTool';
import DnsLookup from '@/components/tools/DnsLookup';
import PortScanner from '@/components/tools/PortScanner';
import SpeedTest from '@/components/tools/SpeedTest';
import TracerouteTool from '@/components/tools/TracerouteTool';
import WhoisLookup from '@/components/tools/WhoisLookup';

const NetworkTools = () => {
  return (
    <Tabs defaultValue="ping" className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full bg-blue-50 dark:bg-gray-800 p-1">
        <TabsTrigger value="ping" className="text-xs md:text-sm">Ping</TabsTrigger>
        <TabsTrigger value="dns" className="text-xs md:text-sm">DNS</TabsTrigger>
        <TabsTrigger value="ports" className="text-xs md:text-sm">Portas</TabsTrigger>
        <TabsTrigger value="speed" className="text-xs md:text-sm">Velocidade</TabsTrigger>
        <TabsTrigger value="trace" className="text-xs md:text-sm">Traceroute</TabsTrigger>
        <TabsTrigger value="whois" className="text-xs md:text-sm">Whois</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ping" className="mt-4">
        <PingTool />
      </TabsContent>
      
      <TabsContent value="dns" className="mt-4">
        <DnsLookup />
      </TabsContent>
      
      <TabsContent value="ports" className="mt-4">
        <PortScanner />
      </TabsContent>
      
      <TabsContent value="speed" className="mt-4">
        <SpeedTest />
      </TabsContent>
      
      <TabsContent value="trace" className="mt-4">
        <TracerouteTool />
      </TabsContent>
      
      <TabsContent value="whois" className="mt-4">
        <WhoisLookup />
      </TabsContent>
    </Tabs>
  );
};

export default NetworkTools;
