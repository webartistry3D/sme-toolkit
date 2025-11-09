import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInfo } from "./CurrencySelector";

interface TotalAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  currencyInfo: CurrencyInfo;
}

export default function TotalAmountInput({ value, onChange, currencyInfo }: TotalAmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9]/g, '');
    onChange(input);
  };

  const formatDisplay = (val: string) => {
    if (!val) return '';
    return new Intl.NumberFormat(currencyInfo.locale).format(Number(val));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="total-amount" className="text-sm font-medium">
        Total Amount
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-foreground">
          {currencyInfo.symbol}
        </span>
        <Input
          id="total-amount"
          data-testid="input-total-amount"
          type="text"
          value={formatDisplay(value)}
          onChange={handleChange}
          placeholder="0"
          className="pl-12 text-right text-2xl font-semibold h-14"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Enter the total amount to break down into categories
      </p>
    </div>
  );
}
