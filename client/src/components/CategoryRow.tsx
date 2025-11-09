import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CurrencyInfo } from "./CurrencySelector";

export interface Category {
  id: string;
  name: string;
  percentage: number;
}

interface CategoryRowProps {
  category: Category;
  totalAmount: number;
  onUpdate: (id: string, field: 'name' | 'percentage', value: string | number) => void;
  onDelete: (id: string) => void;
  currencyInfo: CurrencyInfo;
  isAnimating?: boolean;
}

export default function CategoryRow({ 
  category, 
  totalAmount, 
  onUpdate, 
  onDelete,
  currencyInfo,
  isAnimating = false 
}: CategoryRowProps) {
  const calculatedAmount = (totalAmount * category.percentage) / 100;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currencyInfo.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div 
      className={`flex items-center gap-3 p-4 bg-card border border-card-border rounded-lg transition-all ${
        isAnimating ? 'animate-in slide-in-from-top-2 fade-in duration-300' : ''
      }`}
      data-testid={`category-row-${category.id}`}
    >
      <div className="flex-1 min-w-0">
        <Input
          data-testid={`input-category-name-${category.id}`}
          value={category.name}
          onChange={(e) => onUpdate(category.id, 'name', e.target.value)}
          placeholder="Category name"
          className="border-0 bg-transparent px-0 focus-visible:ring-0 font-medium"
        />
      </div>
      
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative w-20">
          <Input
            data-testid={`input-category-percentage-${category.id}`}
            type="number"
            min="0"
            max="100"
            value={category.percentage || ''}
            onChange={(e) => onUpdate(category.id, 'percentage', Number(e.target.value))}
            className="pr-6 text-right"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            %
          </span>
        </div>
        
        <div className="text-right min-w-[120px]">
          <div className="text-lg font-semibold" data-testid={`text-category-amount-${category.id}`}>
            {currencyInfo.symbol}{formatCurrency(calculatedAmount)}
          </div>
        </div>
        
        <Button
          data-testid={`button-delete-category-${category.id}`}
          size="icon"
          variant="ghost"
          onClick={() => onDelete(category.id)}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
