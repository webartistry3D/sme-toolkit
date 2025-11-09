import { Category } from "./CategoryRow";
import { CurrencyInfo } from "./CurrencySelector";

interface BreakdownPreviewProps {
  totalAmount: number;
  categories: Category[];
  profitPercentage: number;
  currencyInfo: CurrencyInfo;
}

export default function BreakdownPreview({ 
  totalAmount, 
  categories, 
  profitPercentage,
  currencyInfo
}: BreakdownPreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(currencyInfo.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const profitAmount = (totalAmount * profitPercentage) / 100;

  return (
    <div className="space-y-4" data-testid="breakdown-preview">
      <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Live Breakdown
      </div>
      
      <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
        <div className="pb-3 border-b border-border">
          <div className="text-xs text-muted-foreground mb-1">Total</div>
          <div className="text-xl font-bold" data-testid="text-preview-total">
            {currencyInfo.symbol}{formatCurrency(totalAmount)}
          </div>
        </div>
        
        {profitPercentage > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="font-medium">Remaining Amount</div>
              <div className="text-xs text-muted-foreground">{profitPercentage.toFixed(1)}%</div>
            </div>
            <div className="text-right font-semibold text-primary" data-testid="text-preview-profit">
              {currencyInfo.symbol}{formatCurrency(profitAmount)}
            </div>
          </div>
        )}
        
        {categories.map((category) => {
          const amount = (totalAmount * category.percentage) / 100;
          return (
            <div 
              key={category.id} 
              className="flex items-center justify-between py-2"
              data-testid={`preview-category-${category.id}`}
            >
              <div>
                <div className="font-medium">{category.name || 'Unnamed'}</div>
                <div className="text-xs text-muted-foreground">{category.percentage}%</div>
              </div>
              <div className="text-right font-semibold">
                {currencyInfo.symbol}{formatCurrency(amount)}
              </div>
            </div>
          );
        })}
        
        {categories.length === 0 && profitPercentage === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Add expense categories to see the breakdown
          </div>
        )}
      </div>
    </div>
  );
}
