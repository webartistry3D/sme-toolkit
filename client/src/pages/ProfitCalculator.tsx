import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, TrendingUp } from "lucide-react";

const CURRENCIES = [
  { value: "USD", label: "Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "Pound", symbol: "£" },
  { value: "NGN", label: "Naira", symbol: "₦" },
  { value: "GHS", label: "Cedi", symbol: "₵" }
];

interface CalculatorData {
  cost: number;
  sellingPrice: number;
  expenses: number;
  currency: string;
}

export default function ProfitCalculator() {
  const [formData, setFormData] = useState<CalculatorData>({
    cost: 0,
    sellingPrice: 0,
    expenses: 0,
    currency: "USD"
  });

  // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("profitCalculatorData");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  const updateField = <K extends keyof CalculatorData>(field: K, value: CalculatorData[K]) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem("profitCalculatorData", JSON.stringify(newData));
  };

  const clearAll = () => {
    const emptyData = { cost: 0, sellingPrice: 0, expenses: 0, currency: formData.currency };
    setFormData(emptyData);
    localStorage.setItem("profitCalculatorData", JSON.stringify(emptyData));
  };

  const currencySymbol = CURRENCIES.find(c => c.value === formData.currency)?.symbol || "$";

  const profit = formData.sellingPrice - formData.cost - formData.expenses;
  const profitMargin = formData.sellingPrice > 0 
    ? ((profit / formData.sellingPrice) * 100) 
    : 0;

  const suggestedPrice30 = (formData.cost + formData.expenses) / 0.7;
  const suggestedPrice40 = (formData.cost + formData.expenses) / 0.6;
  const suggestedPrice50 = (formData.cost + formData.expenses) / 0.5;

  const isProfitable = profit > 0;
  const hasData = formData.cost > 0 || formData.sellingPrice > 0 || formData.expenses > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Profit Calculator</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Product Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => updateField("currency", value)}
                  >
                    <SelectTrigger id="currency" data-testid="select-currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.symbol} - {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cost">Product Cost ({currencySymbol})</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost || ""}
                    onChange={(e) => updateField("cost", Number(e.target.value))}
                    placeholder="0.00"
                    data-testid="input-cost"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The cost to produce or purchase the product
                  </p>
                </div>

                <div>
                  <Label htmlFor="sellingPrice">Selling Price ({currencySymbol})</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.sellingPrice || ""}
                    onChange={(e) => updateField("sellingPrice", Number(e.target.value))}
                    placeholder="0.00"
                    data-testid="input-selling-price"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The price you plan to sell at
                  </p>
                </div>

                <div>
                  <Label htmlFor="expenses">Additional Expenses ({currencySymbol})</Label>
                  <Input
                    id="expenses"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.expenses || ""}
                    onChange={(e) => updateField("expenses", Number(e.target.value))}
                    placeholder="0.00"
                    data-testid="input-expenses"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shipping, marketing, fees, etc. (optional)
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="flex-1"
                  disabled={!hasData}
                  data-testid="button-clear"
                >
                  Clear All
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">How to Use</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Enter your product cost</li>
                <li>Add your desired selling price</li>
                <li>Include any additional expenses (optional)</li>
                <li>View your profit calculations and margin percentage</li>
                <li>Check suggested pricing for different profit margins</li>
              </ol>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Results</h2>
              
              {hasData ? (
                <div className="space-y-4">
                  <div className="border-2 rounded-lg p-6 bg-card">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Net Profit</p>
                      <p 
                        className={`text-4xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}
                        data-testid="text-profit"
                      >
                        {currencySymbol}{profit.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                      <p 
                        className="text-2xl font-bold"
                        data-testid="text-margin"
                      >
                        {profitMargin.toFixed(1)}%
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Total Costs</p>
                      <p className="text-2xl font-bold" data-testid="text-total-costs">
                        {currencySymbol}{(formData.cost + formData.expenses).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground">Product Cost:</span>
                      <span className="font-medium">{currencySymbol}{formData.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground">Additional Expenses:</span>
                      <span className="font-medium">{currencySymbol}{formData.expenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-muted-foreground">Selling Price:</span>
                      <span className="font-medium">{currencySymbol}{formData.sellingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Enter product information to see results
                </p>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Suggested Selling Prices</h2>
              </div>
              
              {(formData.cost > 0 || formData.expenses > 0) ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">30% Margin</p>
                      <p className="text-xs text-muted-foreground">Industry standard</p>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-suggested-30">
                      {currencySymbol}{suggestedPrice30.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">40% Margin</p>
                      <p className="text-xs text-muted-foreground">Good profit</p>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-suggested-40">
                      {currencySymbol}{suggestedPrice40.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">50% Margin</p>
                      <p className="text-xs text-muted-foreground">Premium pricing</p>
                    </div>
                    <p className="text-lg font-bold" data-testid="text-suggested-50">
                      {currencySymbol}{suggestedPrice50.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Suggested prices will appear once you enter costs
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
