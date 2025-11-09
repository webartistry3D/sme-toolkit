import { Button } from "@/components/ui/button";
import { FileText, FileDown, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import { Category } from "./CategoryRow";
import { CurrencyInfo } from "./CurrencySelector";
import autoTable from 'jspdf-autotable';


interface ExportButtonsProps {
  totalAmount: number;
  categories: Category[];
  profitPercentage: number;
  isValid: boolean;
  currencyInfo: CurrencyInfo;
}

export default function ExportButtons({ 
  totalAmount, 
  categories, 
  profitPercentage,
  isValid,
  currencyInfo
}: ExportButtonsProps) {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currencyInfo.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const generateBreakdownText = () => {
    const profitAmount = (totalAmount * profitPercentage) / 100;
    let text = `Total: ${currencyInfo.symbol}${formatCurrency(totalAmount)}\nBreakdown:\n`;
    
    if (profitPercentage > 0) {
      text += `- My Profit (${profitPercentage.toFixed(1)}%): ${currencyInfo.symbol}${formatCurrency(profitAmount)}\n`;
    }
    
    categories.forEach(cat => {
      const amount = (totalAmount * cat.percentage) / 100;
      text += `- ${cat.name} (${cat.percentage}%): ${currencyInfo.symbol}${formatCurrency(amount)}\n`;
    });
    
    return text;
  };

  const handleCopyToClipboard = async () => {
    const text = generateBreakdownText();
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Breakdown copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleExportText = () => {
    const text = generateBreakdownText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breakdown-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Breakdown exported as text file",
    });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const profitAmount = (totalAmount * profitPercentage) / 100;

    // Header
    doc.setFontSize(18);
    doc.text('Spend Breakdown', 20, 20);

    // Summary
    doc.setFontSize(12);
    doc.text(
      `Total: ${currencyInfo.symbol}${formatCurrency(totalAmount)} (${currencyInfo.name})`,
      20,
      30
    );

    // Build table data
    const tableRows: any[] = [];
    if (profitPercentage > 0) {
      tableRows.push([
        `My Profit (${profitPercentage.toFixed(1)}%)`,
        `${currencyInfo.symbol}${formatCurrency(profitAmount)}`,
      ]);
    }

    categories.forEach(cat => {
      const amount = (totalAmount * cat.percentage) / 100;
      tableRows.push([
        `${cat.name} (${cat.percentage}%)`,
        `${currencyInfo.symbol}${formatCurrency(amount)}`,
      ]);
    });

    // Generate table
    autoTable(doc, {
      startY: 40,
      head: [['Category', 'Amount']],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [33, 150, 243], textColor: 255, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 110 }, // category column
        1: { halign: 'right' }, // amount column
      },
    });

    // Save file
    doc.save(`breakdown-${Date.now()}.pdf`);

    toast({
      title: "Downloaded!",
      description: "Breakdown exported as a formatted PDF",
    });
  };


  const canExport = totalAmount > 0 && isValid;

  return (
    <div className="space-y-3" data-testid="export-buttons">
      <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Export Options
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button
          data-testid="button-export-pdf"
          onClick={handleExportPDF}
          disabled={!canExport}
          className="flex-1 min-w-[140px]"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        
        <Button
          data-testid="button-export-text"
          onClick={handleExportText}
          disabled={!canExport}
          variant="secondary"
          className="flex-1 min-w-[140px]"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Text
        </Button>
      </div>
      
      <Button
        data-testid="button-copy-clipboard"
        onClick={handleCopyToClipboard}
        disabled={!canExport}
        variant="outline"
        className="w-full"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy to Clipboard
      </Button>
      
      {!isValid && totalAmount > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Complete 100% allocation to enable export
        </p>
      )}
    </div>
  );
}
