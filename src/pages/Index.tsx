
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import IpInfo from "@/components/IpInfo";
import GeolocationTool from "@/components/GeolocationTool";
import BrowserInfo from "@/components/BrowserInfo";
import NetworkTools from "@/components/NetworkTools";
import PasswordGenerator from "@/components/PasswordGenerator";
import TextEncoder from "@/components/TextEncoder";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
  const [activeTab, setActiveTab] = useState("ip");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-100 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400">Qual é Meu IP?</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Descubra seu IP público, localização e muito mais.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IpInfo />
          </CardContent>
        </Card>

        <Tabs defaultValue="geolocation" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4 bg-blue-50 dark:bg-gray-800 p-1">
            <TabsTrigger value="geolocation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Localização
            </TabsTrigger>
            <TabsTrigger value="browser" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Navegador
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Ferramentas
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Senhas
            </TabsTrigger>
            <TabsTrigger value="encoder" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Codificador
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Sobre
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geolocation" className="mt-0">
            <Card className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Sua Localização</CardTitle>
                <CardDescription>
                  Visualize sua localização baseada no seu endereço IP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GeolocationTool />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browser" className="mt-0">
            <Card className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Informações do Navegador</CardTitle>
                <CardDescription>
                  Detalhes sobre seu navegador e sistema operacional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BrowserInfo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="mt-0">
            <Card className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Ferramentas de Rede</CardTitle>
                <CardDescription>
                  Diagnóstico de rede e teste de conectividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkTools />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-0">
            <Card className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Gerador de Senhas</CardTitle>
                <CardDescription>
                  Crie senhas fortes e seguras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encoder" className="mt-0">
            <Card className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Codificador de Texto</CardTitle>
                <CardDescription>
                  Codifique e decodifique texto em vários formatos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextEncoder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <Card className="border-blue-100 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Sobre o Meu IP</CardTitle>
                <CardDescription>
                  Informações sobre o nosso serviço
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    O "Qual é Meu IP?" é uma ferramenta completa para diagnosticar e obter informações sobre sua conexão com a internet. 
                    Nosso objetivo é fornecer informações precisas e ferramentas úteis para usuários técnicos e não técnicos.
                  </p>
                  <p>
                    Todas as ferramentas são executadas diretamente no seu navegador, garantindo que suas informações permaneçam privadas.
                    Não armazenamos nenhum dado pessoal ou de navegação dos nossos usuários.
                  </p>
                  <div className="flex justify-center mt-6">
                    <Button variant="outline" className="mr-2" onClick={() => window.open("https://github.com", "_blank")}>
                      Código Fonte
                    </Button>
                    <Button variant="outline" onClick={() => window.open("mailto:contato@meu-ip.com")}>
                      Contato
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
