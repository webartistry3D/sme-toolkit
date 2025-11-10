import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Booking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

const SERVICES = ["Haircut", "Massage", "Facial", "Manicure", "Repair Service"];

export default function BookingScheduler() {
  const { toast } = useToast();
  const scheduleRef = useRef<HTMLDivElement>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [form, setForm] = useState<Omit<Booking, "id">>({
    clientName: "",
    service: SERVICES[0],
    date: "",
    time: "",
    notes: ""
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookings");
    if (saved) setBookings(JSON.parse(saved));
  }, []);

  // Save to localStorage
  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem("bookings", JSON.stringify(newBookings));
  };

  const handleAddBooking = () => {
    if (!form.clientName || !form.date || !form.time) {
      toast({ title: "Missing Fields", description: "Client name, date, and time are required.", variant: "destructive" });
      return;
    }

    const newBooking: Booking = { ...form, id: Date.now().toString() };
    saveBookings([...bookings, newBooking]);
    setForm({ clientName: "", service: SERVICES[0], date: "", time: "", notes: "" });
  };

  const handleRemoveBooking = (id: string) => {
    saveBookings(bookings.filter(b => b.id !== id));
  };

  const generatePDF = async () => {
    if (!scheduleRef.current) return;

    try {
      const canvas = await html2canvas(scheduleRef.current, { scale: 2, logging: false, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`schedule-${Date.now()}.pdf`);

      toast({ title: "PDF Generated", description: "Your schedule has been downloaded successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Client Booking Scheduler</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Add Booking</h2>
          
          <div>
            <Label>Client Name</Label>
            <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Client Name" />
          </div>

          <div>
            <Label>Service</Label>
            <Select value={form.service} onValueChange={(value) => setForm({ ...form, service: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
          </div>

          <Button onClick={handleAddBooking} className="mt-2 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Booking
          </Button>
        </Card>

        {/* Booking Schedule */}
        <div className="space-y-4">
          <Card className="p-6" ref={scheduleRef}>
            <h2 className="text-lg font-semibold mb-2">Upcoming Bookings</h2>
            {bookings.length === 0 && <p>No bookings yet.</p>}

            {bookings.map((b) => (
              <div key={b.id} className="border rounded-lg p-3 flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{b.clientName} ({b.service})</p>
                  <p className="text-sm text-muted-foreground">{b.date} @ {b.time}</p>
                  {b.notes && <p className="text-sm">{b.notes}</p>}
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleRemoveBooking(b.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </Card>

          <Button onClick={generatePDF} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Schedule PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
