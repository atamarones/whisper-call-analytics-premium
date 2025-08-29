import React, { useState } from 'react';
import { Palette, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const BrandingSettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: 'Analítica',
    logoUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    accentColor: '#8b5cf6'
  });

  const handleSave = () => {
    // Here you would save to your backend/database
    localStorage.setItem('brandingConfig', JSON.stringify(config));
    
    // Apply CSS variables for theme customization
    const root = document.documentElement;
    root.style.setProperty('--primary', `${hexToHsl(config.primaryColor)}`);
    root.style.setProperty('--secondary', `${hexToHsl(config.secondaryColor)}`);
    root.style.setProperty('--accent', `${hexToHsl(config.accentColor)}`);
    
    toast({
      title: "Configuración guardada",
      description: "Los cambios de branding se han aplicado correctamente.",
    });
  };

  const hexToHsl = (hex: string) => {
    // Convert hex to HSL for CSS variables
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuración de Marca</h3>
        <p className="text-sm text-muted-foreground">
          Personaliza los colores y logo de tu empresa para ofrecer este portal como SaaS.
        </p>
      </div>

      <Separator />

      <div className="grid gap-6">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Información de la Empresa
            </CardTitle>
            <CardDescription>
              Configura el nombre y logo de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                id="companyName"
                value={config.companyName}
                onChange={(e) => setConfig(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Mi Empresa SaaS"
              />
            </div>
            
            <div>
              <Label htmlFor="logoUrl">URL del Logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logoUrl"
                  value={config.logoUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                  placeholder="https://ejemplo.com/logo.png"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle>Esquema de Colores</CardTitle>
            <CardDescription>
              Define los colores principales de tu marca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Color Primario</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="secondaryColor">Color Secundario</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    placeholder="#1e293b"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accentColor">Color de Acento</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="accentColor"
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={config.accentColor}
                    onChange={(e) => setConfig(prev => ({ ...prev, accentColor: e.target.value }))}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-6">
              <Label>Vista Previa</Label>
              <div className="mt-2 p-4 border rounded-lg">
                <div className="flex gap-4 items-center">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: config.primaryColor }}>
                      {config.companyName}
                    </h4>
                    <p className="text-sm" style={{ color: config.secondaryColor }}>
                      Portal de Analítica
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    style={{ 
                      borderColor: config.accentColor,
                      color: config.accentColor 
                    }}
                  >
                    Botón de Ejemplo
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};

export default BrandingSettings;