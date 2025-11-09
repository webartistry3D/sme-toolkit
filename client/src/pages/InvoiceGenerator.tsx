import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CURRENCIES = [
  { value: "USD", label: "Dollar", symbol: "$" },
  { value: "EUR", label: "Euro", symbol: "€" },
  { value: "GBP", label: "Pound", symbol: "£" },
  { value: "NGN", label: "Naira", symbol: "₦" },
  { value: "GHS", label: "Cedi", symbol: "₵" }
];

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  businessName: string;
  clientName: string;
  items: InvoiceItem[];
  taxPercent: number;
  discountPercent: number;
  paymentInfo: string;
  logo: string;
  currency: string;
}

export default function InvoiceGenerator() {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<InvoiceData>({
    businessName: "",
    clientName: "",
    items: [{ id: "1", description: "", quantity: 1, unitPrice: 0 }],
    taxPercent: 0,
    discountPercent: 0,
    paymentInfo: "",
    logo: "",
    currency: "USD"
  });

  // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("invoiceData");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  const saveToLocalStorage = (data: InvoiceData) => {
    localStorage.setItem("invoiceData", JSON.stringify(data));
  };

  const updateField = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    saveToLocalStorage(newData);
  };

  const addItem = () => {
    const newItems = [...formData.items, {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0
    }];
    updateField("items", newItems);
  };

  const removeItem = (id: string) => {
    const newItems = formData.items.filter(item => item.id !== id);
    updateField("items", newItems);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const newItems = formData.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateField("items", newItems);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField("logo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currencySymbol = CURRENCIES.find(c => c.value === formData.currency)?.symbol || "$";
  
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subtotal * formData.taxPercent) / 100;
  const discountAmount = (subtotal * formData.discountPercent) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const generatePDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${Date.now()}.pdf`);

      toast({
        title: "PDF Generated",
        description: "Your invoice has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

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
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Invoice Generator</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Business Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    placeholder="Your Business Name"
                    data-testid="input-business-name"
                  />
                </div>

                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => updateField("clientName", e.target.value)}
                    placeholder="Client Name"
                    data-testid="input-client-name"
                  />
                </div>

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
                  <Label htmlFor="logo">Logo (Optional)</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    data-testid="input-logo"
                  />
                  {formData.logo && (
                    <img src={formData.logo} alt="Logo preview" className="mt-2 h-16 object-contain" />
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Items</h2>
                <Button size="sm" onClick={addItem} data-testid="button-add-item">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      {formData.items.length > 1 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          data-testid={`button-remove-item-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Description"
                      data-testid={`input-item-description-${index}`}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                          data-testid={`input-item-quantity-${index}`}
                        />
                      </div>
                      <div>
                        <Label>Unit Price ({currencySymbol})</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))}
                          data-testid={`input-item-price-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tax">Tax (%)</Label>
                    <Input
                      id="tax"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.taxPercent}
                      onChange={(e) => updateField("taxPercent", Number(e.target.value))}
                      data-testid="input-tax"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.discountPercent}
                      onChange={(e) => updateField("discountPercent", Number(e.target.value))}
                      data-testid="input-discount"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="payment">Payment Information</Label>
                  <Textarea
                    id="payment"
                    value={formData.paymentInfo}
                    onChange={(e) => updateField("paymentInfo", e.target.value)}
                    placeholder="Bank details, payment terms, etc."
                    rows={3}
                    data-testid="input-payment-info"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6" ref={invoiceRef}>
              <div className="space-y-6">
                {formData.logo && (
                  <div className="flex justify-center">
                    <img src={formData.logo} alt="Business Logo" className="h-20 object-contain" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold">INVOICE</h3>
                  {formData.businessName && (
                    <p className="text-lg font-semibold mt-2">{formData.businessName}</p>
                  )}
                </div>

                {formData.clientName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Bill To:</p>
                    <p className="font-semibold">{formData.clientName}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm">Description</th>
                        <th className="text-right py-2 text-sm">Qty</th>
                        <th className="text-right py-2 text-sm">Price</th>
                        <th className="text-right py-2 text-sm">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 text-sm">{item.description || "-"}</td>
                          <td className="text-right py-2 text-sm">{item.quantity}</td>
                          <td className="text-right py-2 text-sm">{currencySymbol}{item.unitPrice.toFixed(2)}</td>
                          <td className="text-right py-2 text-sm">{currencySymbol}{(item.quantity * item.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span data-testid="text-subtotal">{currencySymbol}{subtotal.toFixed(2)}</span>
                  </div>
                  {formData.taxPercent > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Tax ({formData.taxPercent}%):</span>
                      <span data-testid="text-tax">{currencySymbol}{taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {formData.discountPercent > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Discount ({formData.discountPercent}%):</span>
                      <span data-testid="text-discount">-{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span data-testid="text-total">{currencySymbol}{total.toFixed(2)}</span>
                  </div>
                </div>

                {formData.paymentInfo && (
                  <div className="text-sm border-t pt-4">
                    <p className="font-semibold mb-1">Payment Information:</p>
                    <p className="whitespace-pre-line text-muted-foreground">{formData.paymentInfo}</p>
                  </div>
                )}
              </div>
            </Card>

            <Button onClick={generatePDF} className="w-full" size="lg" data-testid="button-generate-pdf">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
