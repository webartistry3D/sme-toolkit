import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Calculator } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const tools = [
    {
      icon: FileText,
      emoji: "🧾",
      title: "Invoice Generator",
      description: "Create professional invoices with automatic calculations and PDF export",
      path: "/invoice-generator",
      testId: "card-invoice-generator"
    },
    {
      icon: MessageSquare,
      emoji: "💬",
      title: "WhatsApp Link & QR Builder",
      description: "Generate WhatsApp links and QR codes for instant messaging",
      path: "/whatsapp-builder",
      testId: "card-whatsapp-builder"
    },
    {
      icon: Calculator,
      emoji: "📊",
      title: "Profit Calculator",
      description: "Calculate profit margins and get suggested pricing recommendations",
      path: "/profit-calculator",
      testId: "card-profit-calculator"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-title">
            SMETools
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-tagline">
            Smart tools for everyday business tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={tool.path}>
                <Card 
                  className="p-8 hover-elevate active-elevate-2 cursor-pointer h-full transition-all duration-200"
                  data-testid={tool.testId}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-5xl" aria-hidden="true">
                      {tool.emoji}
                    </div>
                    <h2 className="text-xl font-semibold" data-testid={`text-${tool.testId}-title`}>
                      {tool.title}
                    </h2>
                    <p className="text-sm text-muted-foreground" data-testid={`text-${tool.testId}-description`}>
                      {tool.description}
                    </p>
                    <Button 
                      variant="default" 
                      className="mt-4"
                      data-testid={`button-${tool.testId}-open`}
                    >
                      Open Tool →
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            No login required • All tools work offline • Your data stays in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
