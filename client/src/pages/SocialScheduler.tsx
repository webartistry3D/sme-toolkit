import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Download, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PostPlan {
  day: string;
  postType: string;
  caption: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const BUSINESS_TYPES = [
  "Fashion",
  "Food & Drinks",
  "Fitness & Wellness",
  "Beauty & Spa",
  "Tech & Digital",
  "Education",
  "Real Estate",
  "Entertainment"
];

const GOALS = ["Brand Awareness", "Engagement", "Sales Conversion", "Community Growth"];

export default function SocialScheduler() {
  const { toast } = useToast();
  const scheduleRef = useRef<HTMLDivElement>(null);

  const [businessType, setBusinessType] = useState("Fashion");
  const [goal, setGoal] = useState("Brand Awareness");
  const [plan, setPlan] = useState<PostPlan[]>([]);

  // Load saved plan
  useEffect(() => {
    const saved = localStorage.getItem("socialPlan");
    if (saved) setPlan(JSON.parse(saved));
  }, []);

  const generatePlan = () => {
    const ideas: Record<string, string[]> = {
      Fashion: ["Show product of the week", "Behind-the-scenes tailoring", "Customer testimonial", "Outfit inspiration", "New arrival teaser", "Style tip video", "Team photo"],
      Food: ["Menu highlight", "Chef in action", "Customer enjoying meal", "New dish teaser", "Ingredient spotlight", "Behind-the-scenes cooking", "Weekend special"],
      Tech: ["App feature highlight", "User success story", "Tech tip", "Behind the code", "Feature update", "Team snapshot", "Tutorial video"],
      Fitness: ["Workout tip", "Client transformation", "Healthy recipe", "Motivational quote", "Behind-the-scenes training", "Product spotlight", "Weekend wellness challenge"]
    };

    const chosen = ideas[businessType.split(" ")[0] as keyof typeof ideas] || ideas.Tech;

    const newPlan = DAYS.map((day, i) => ({
      day,
      postType: goal === "Sales Conversion" ? "Promotional" :
                 goal === "Engagement" ? "Interactive" :
                 goal === "Brand Awareness" ? "Educational" : "Community",
      caption: chosen[i % chosen.length]
    }));

    setPlan(newPlan);
    localStorage.setItem("socialPlan", JSON.stringify(newPlan));

    toast({ title: "Plan Generated", description: "A 7-day post plan has been created!" });
  };

  const updateCaption = (day: string, caption: string) => {
    const updated = plan.map(p => p.day === day ? { ...p, caption } : p);
    setPlan(updated);
    localStorage.setItem("socialPlan", JSON.stringify(updated));
  };

  const exportCSV = () => {
    const csv = "Day,Post Type,Caption\n" + plan.map(p => `${p.day},${p.postType},"${p.caption}"`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "social_plan.csv";
    a.click();
    toast({ title: "CSV Downloaded", description: "Your plan has been exported successfully." });
  };

  const exportPDF = async () => {
  if (!scheduleRef.current) return;

  // Clone the schedule container
  const clone = scheduleRef.current.cloneNode(true) as HTMLElement;

  // Replace inputs with divs
  clone.querySelectorAll("input").forEach((input) => {
    const span = document.createElement("div");
    span.textContent = (input as HTMLInputElement).value;
    const style = getComputedStyle(input);
    span.style.fontFamily = style.fontFamily;
    span.style.fontSize = style.fontSize;
    span.style.fontWeight = style.fontWeight;
    span.style.color = style.color;
    span.style.padding = style.padding;
    span.style.width = style.width;
    span.style.height = style.height;
    span.style.background = "transparent";
    span.style.border = "none";
    span.style.boxSizing = "border-box";
    (input.parentNode as HTMLElement).replaceChild(span, input);
  });

  // Append clone off-screen
  clone.style.position = "fixed";
  clone.style.top = "-9999px";
  document.body.appendChild(clone);

  try {
    // Moderate scale to avoid zoomed text
    const canvas = await html2canvas(clone, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;

    // Calculate height based on PDF page width
    const imgProps = {
      width: pageWidth,
      height: (canvas.height * pageWidth) / canvas.width,
    };

    let heightLeft = imgProps.height;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgProps.width, imgProps.height);
      heightLeft -= pageHeight;
      position -= pageHeight;
      if (heightLeft > 0) pdf.addPage();
    }

    pdf.save("social_plan.pdf");
    toast({ title: "PDF Generated", description: "Your plan has been downloaded successfully." });
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast({ title: "Error", description: "Failed to generate PDF." });
  } finally {
    document.body.removeChild(clone);
  }
};



  const autoGenerateCaptions = () => {
    const updated = plan.map(p => ({
      ...p,
      caption: `✨ ${p.postType} idea for ${businessType}: "${p.caption}"`
    }));
    setPlan(updated);
    localStorage.setItem("socialPlan", JSON.stringify(updated));
    toast({ title: "AI Captions Generated", description: "Smart captions have been added!" });
  };

  const resetPlan = () => {
    setPlan([]);
    localStorage.removeItem("socialPlan");
    toast({ title: "Plan Reset", description: "Your post plan has been cleared." });
    };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Social Media Post Scheduler
          </h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Form Section */}
      <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8 md:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <Label>Business Type</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Goal</Label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generatePlan} className="w-full">Generate Plan</Button>
          <Button variant="destructive" onClick={resetPlan}>
            Reset Plan
        </Button>


          {plan.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="secondary" onClick={autoGenerateCaptions}>
                <Sparkles className="w-4 h-4 mr-2" /> Auto Generate Captions
              </Button>
              <Button variant="outline" onClick={exportCSV}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
              <Button variant="outline" onClick={exportPDF}>
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            </div>
          )}
        </Card>

        {/* Plan Preview */}
        {plan.length > 0 && (
          <Card className="p-6 space-y-4" ref={scheduleRef}>
            <h2 className="text-lg font-semibold mb-2">Weekly Post Schedule</h2>
            {plan.map(p => (
              <div key={p.day} className="border rounded-lg p-3 bg-muted/40">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{p.day}</span>
                  <span className="text-sm text-muted-foreground">{p.postType}</span>
                </div>
                <Input
                  value={p.caption}
                  onChange={(e) => updateCaption(p.day, e.target.value)}
                  placeholder="Edit caption..."
                />
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
