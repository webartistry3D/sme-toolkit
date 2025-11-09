import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Calculator, Sun, Moon } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

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
    },
    {
      icon: Calculator,
      emoji: "💸",
      title: "Spend Breakdown Calculator",
      description: "Break down invoice amounts into spending categories automatically",
      path: "/spend-breakdown",
      testId: "card-spend-breakdown"
    }
  ];

  const features = [
    { title: "Offline Ready", desc: "All tools work directly in your browser, no login needed" },
    { title: "Data Privacy", desc: "Your data never leaves your device" },
    { title: "Export Options", desc: "Download as PDF, CSV, or copy to clipboard" }
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Dark Mode Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-24 text-white text-center overflow-hidden">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">SMETools</h1>
        <p className="text-lg md:text-2xl mb-6">
          Smart tools for everyday business tasks
        </p>
        <Button
          variant="secondary"
          onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
        >
          Explore Tools ↓
        </Button>
      </div>

      {/* Tools Grid */}
      <div id="tools" className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path}>
              <Card className="p-8 cursor-pointer h-full transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-6xl">{tool.emoji}</div>
                  <h2 className="text-xl font-semibold">{tool.title}</h2>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <Button variant="default" className="mt-4">
                    Open Tool →
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose SMETools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <Card key={f.title} className="p-6 transform transition hover:scale-105">
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-4 text-gray-700 dark:text-gray-300">
          <p>© {new Date().getFullYear()} SMETools. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:contact@smetools.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
