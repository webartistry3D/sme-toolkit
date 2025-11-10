import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Trash2, Share2, RefreshCcw } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Example static zones/pricing table
const DELIVERY_ZONES = [
  { zone: "Zone 1", cities: ["Lagos", "Ikeja", "Lekki"], price: 500 },
  { zone: "Zone 2", cities: ["Abuja", "Kaduna", "Port Harcourt"], price: 1000 },
  { zone: "Zone 3", cities: ["Kano", "Ibadan", "Enugu"], price: 1500 }
];

export default function DeliveryEstimator() {
  const { toast } = useToast();
  const [weight, setWeight] = useState<number>(1);
  const [zone, setZone] = useState(DELIVERY_ZONES[0].zone);
  const [totalFee, setTotalFee] = useState<number | null>(null);

  const handleCalculate = () => {
    const selectedZone = DELIVERY_ZONES.find(z => z.zone === zone);
    if (!selectedZone) return;

    // Example: simple pricing by weight
    const fee = selectedZone.price * Math.ceil(weight);
    setTotalFee(fee);

    toast({ title: "Fee Calculated", description: `Estimated delivery fee is ₦${fee}` });
  };

  const handleReset = () => {
    setWeight(1);
    setZone(DELIVERY_ZONES[0].zone);
    setTotalFee(null);
  };

  const handleShareWhatsApp = () => {
    if (totalFee === null) {
      toast({ title: "No Fee", description: "Please calculate the fee first." });
      return;
    }
    const message = `Hi! Your delivery fee estimate for a ${weight}kg package to ${zone} is ₦${totalFee}.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Delivery Fee Estimator</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Card className="p-6 space-y-6">
          <div>
            <Label>Package Weight (kg)</Label>
            <Input
              type="number"
              min={0.1}
              step={0.1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Delivery Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DELIVERY_ZONES.map(z => (
                  <SelectItem key={z.zone} value={z.zone}>{z.zone} ({z.cities.join(", ")})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleCalculate}>Calculate Fee</Button>
            <Button variant="destructive" onClick={handleReset}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            {totalFee !== null && (
              <Button variant="secondary" onClick={handleShareWhatsApp}>
                <Share2 className="w-4 h-4 mr-2" /> Share via WhatsApp
              </Button>
            )}
          </div>

          {totalFee !== null && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold">Estimated Delivery Fee:</h2>
              <p className="text-2xl mt-2">₦{totalFee}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
