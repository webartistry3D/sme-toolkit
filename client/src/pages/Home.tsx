import { useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Calculator, Sun, Moon, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Twitter, Facebook, Linkedin, Instagram, Github, Mail } from "lucide-react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const tools = [
    {
      icon: FileText,
      emoji: "🧾",
      title: "Invoice Generator",
      description: "Create professional invoices with automatic calculations and PDF export",
      path: "/invoice-generator",
      testId: "card-invoice-generator",
      isNew: true
    },
    {
      icon: Calendar,
      emoji: "📅",
      title: "Content for Social Media",
      description: "Generate a 2-week content calendar (ideas + captions) for Instagram, Facebook & Tiktok",
      path: "/social-scheduler",
      testId: "card-social-scheduler",
      isNew: false
    },
    {
      icon: MessageSquare,
      emoji: "💬",
      title: "WhatsApp Link & QR Builder",
      description: "Generate WhatsApp links and QR codes for instant messaging",
      path: "/whatsapp-builder",
      testId: "card-whatsapp-builder",
      isNew: false
    },
    {
      icon: Calculator,
      emoji: "📊",
      title: "Profit Calculator",
      description: "Calculate profit margins and get suggested pricing recommendations",
      path: "/profit-calculator",
      testId: "card-profit-calculator",
      isNew: false
    },
    {
      icon: Calculator,
      emoji: "💸",
      title: "Spend Breakdown",
      description: "Break down invoice amounts into spending categories automatically",
      path: "/spend-breakdown",
      testId: "card-spend-breakdown",
      isNew: false
    },
    {
      icon: Calculator,
      emoji: "🚚",
      title: "Delivery Fee Estimator",
      description: "Quickly calculate shipping & logistics fees based on zones and weight",
      path: "/delivery-estimator",
      testId: "card-delivery-estimator",
      isNew: true
    },
    {
      icon: Calendar,
      emoji: "📅",
      title: "Client Bookings",
      description: "Manage appointments efficiently with time slots, reminders, and PDF export",
      path: "/booking-scheduler",
      testId: "card-booking-scheduler",
      isNew: true
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
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          SMETools
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Smart tools for everyday business tasks
        </motion.p>
        <Button
          variant="secondary"
          onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
        >
          Explore Tools ↓
        </Button>
      </div>

      {/* Tools Grid */}
      <div
        id="tools"
        className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16
                  bg-gray-100 dark:bg-gray-900"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Link href={tool.path}>
                <Card className="relative p-8 cursor-pointer h-full transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-300/50
                                bg-white dark:bg-gray-800">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      className="text-6xl"
                      whileHover={{ y: [-2, -8, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {tool.emoji}
                    </motion.div>

                    {/* NEW badge */}
                    {tool.isNew && (
                      <div className="absolute -top-2 -right-2 bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                        NEW
                      </div>
                    )}

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.title}</h2>
                    <p className="text-sm text-muted-foreground dark:text-gray-300">{tool.description}</p>

                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Button variant="default" className="mt-4 bg-[#6E63F1]">
                        Open Tool →
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose SMETools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <Card
                key={f.title}
                className="p-6 transform transition hover:scale-105 hover:shadow-lg hover:shadow-purple-300/50
                                            bg-white dark:bg-gray-800"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            © {new Date().getFullYear()} SMETools. Powered by WebArtistry Creations®.
            <br />
            All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">
              <Github className="h-5 w-5 inline-block mr-1" />
            </a>
            <a href="mailto:contact@smetools.com" className="hover:text-gray-900 dark:hover:text-white">
              <Mail className="h-5 w-5 inline-block mr-1" />
            </a>
            <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">
              <Twitter className="h-5 w-5 inline-block" />
            </a>
            <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">
              <Facebook className="h-5 w-5 inline-block" />
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">
              <Linkedin className="h-5 w-5 inline-block" />
            </a>
            <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white">
              <Instagram className="h-5 w-5 inline-block" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
