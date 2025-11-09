import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Copy, Download, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeCanvas as QRCode } from "qrcode.react";

export default function WhatsAppBuilder() {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("whatsappData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPhoneNumber(data.phoneNumber || "");
        setMessage(data.message || "");
      } catch (e) {
        console.error("Failed to load saved data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("whatsappData", JSON.stringify({ phoneNumber, message }));
  }, [phoneNumber, message]);

  const generateWhatsAppLink = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ""}`;
  };

  const whatsappLink = phoneNumber ? generateWhatsAppLink() : "";

  const copyToClipboard = async () => {
    if (!whatsappLink) return;

    try {
      await navigator.clipboard.writeText(whatsappLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "WhatsApp link copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    try {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `whatsapp-qr-${Date.now()}.png`;
      link.href = url;
      link.click();

      toast({
        title: "QR Code Downloaded",
        description: "Your QR code has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
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
          <h1 className="text-xl font-semibold" data-testid="text-page-title">WhatsApp Link & QR Builder</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number (with country code)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 1234567890"
                    data-testid="input-phone"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter without + or spaces (e.g., 1234567890 for +1 234 567 890)
                  </p>
                </div>

                <div>
                  <Label htmlFor="message">Pre-filled Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hello! I'd like to know more about..."
                    rows={4}
                    data-testid="input-message"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This message will appear when someone clicks your link
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">How to Use</h2>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Enter your WhatsApp number with country code</li>
                <li>Optionally add a pre-filled message</li>
                <li>Copy the generated link or download the QR code</li>
                <li>Share it with your customers or add it to your website</li>
              </ol>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Generated Link</h2>
              
              {whatsappLink ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={whatsappLink}
                      readOnly
                      className="font-mono text-sm"
                      data-testid="text-generated-link"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      data-testid="button-copy-link"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <Button
                    onClick={() => window.open(whatsappLink, "_blank")}
                    variant="default"
                    className="w-full"
                    data-testid="button-test-link"
                  >
                    Test Link
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Enter a phone number to generate a link
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">QR Code</h2>
              
              {whatsappLink ? (
                <div className="space-y-4">
                  <div 
                    ref={qrRef} 
                    className="flex justify-center p-8 bg-white rounded-lg"
                    data-testid="container-qr-code"
                  >
                    <QRCode
                      value={whatsappLink}
                      size={256}
                      level="H"
                      includeMargin
                    />
                  </div>

                  <Button
                    onClick={downloadQR}
                    variant="outline"
                    className="w-full"
                    data-testid="button-download-qr"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Customers can scan this QR code to start a WhatsApp chat
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">
                  QR code will appear here once you enter a phone number
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
