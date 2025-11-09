import { CurrencyInfo } from "./CurrencySelector";

interface ProfitDisplayProps {
  percentage: number;
  amount: number;
  currencyInfo: CurrencyInfo;
}

export default function ProfitDisplay({ percentage, amount, currencyInfo }: ProfitDisplayProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(currencyInfo.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div 
      className="p-4 bg-primary/5 border-2 border-primary/20 rounded-lg"
      data-testid="profit-display"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Remaining Amount
          </div>
          <div className="text-lg font-semibold" data-testid="text-profit-percentage">
            {percentage.toFixed(1)}%
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary" data-testid="text-profit-amount">
            {currencyInfo.symbol}{formatCurrency(amount)}
          </div>
        </div>
      </div>
    </div>
  );
}
