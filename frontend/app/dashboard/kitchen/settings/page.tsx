'use client';

import { useState } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { PrinterSettings } from '@/lib/types';

const defaultKitchenSettings: PrinterSettings = {
  kitchenPrinter: {
    enabled: true,
    name: 'Kitchen Printer A',
    ipAddress: '192.168.1.120',
  },
  billingPrinter: {
    enabled: false,
    name: 'Billing Printer',
    ipAddress: '192.168.1.121',
  },
};

export default function KitchenSettingsPage() {
  const [settings, setSettings] = useState<PrinterSettings>(defaultKitchenSettings);
  const [autoPrint, setAutoPrint] = useState(true);

  const updatePrinterField = (printer: 'kitchenPrinter' | 'billingPrinter', field: 'name' | 'ipAddress', value: string) => {
    setSettings(current => ({
      ...current,
      [printer]: {
        ...current[printer],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Kitchen Settings"
        description="Configure kitchen printer and order fulfillment preferences."
      >
        <Button className="touch-target" onClick={() => alert('Kitchen settings saved')}>
          Save Changes
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kitchen Printer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="kitchen-printer-enabled" className="justify-between">
                <span>Enable kitchen printer</span>
                <Switch
                  id="kitchen-printer-enabled"
                  checked={settings.kitchenPrinter.enabled}
                  onCheckedChange={checked =>
                    setSettings(current => ({
                      ...current,
                      kitchenPrinter: {
                        ...current.kitchenPrinter,
                        enabled: checked,
                      },
                    }))
                  }
                />
              </Label>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="kitchen-printer-name">Printer Name</Label>
                <Input
                  id="kitchen-printer-name"
                  value={settings.kitchenPrinter.name}
                  onChange={event =>
                    updatePrinterField('kitchenPrinter', 'name', event.target.value)
                  }
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="kitchen-printer-ip">Printer IP Address</Label>
                <Input
                  id="kitchen-printer-ip"
                  value={settings.kitchenPrinter.ipAddress}
                  onChange={event =>
                    updatePrinterField('kitchenPrinter', 'ipAddress', event.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kitchen Workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="auto-print-orders" className="justify-between">
                <span>Auto-print orders</span>
                <Switch
                  id="auto-print-orders"
                  checked={autoPrint}
                  onCheckedChange={setAutoPrint}
                />
              </Label>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="kitchen-ticket-note">Kitchen ticket note</Label>
              <Input
                id="kitchen-ticket-note"
                value="Include allergen requests and prep notes on every ticket."
                readOnly
              />
            </div>

            <div className="rounded-lg border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium">Printer status</p>
              <p>
                Kitchen printer is currently{' '}
                <span className="font-semibold">
                  {settings.kitchenPrinter.enabled ? 'enabled' : 'disabled'}
                </span>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
