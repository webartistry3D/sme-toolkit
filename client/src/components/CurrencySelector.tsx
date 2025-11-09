import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Currency = 'NGN' | 'GHS';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    locale: 'en-NG',
  },
  GHS: {
    code: 'GHS',
    symbol: 'GH₵',
    name: 'Ghanaian Cedi',
    locale: 'en-GH',
  },
};

interface CurrencySelectorProps {
  value: Currency;
  onChange: (value: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="currency" className="text-sm font-medium">
        Currency
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="currency" data-testid="select-currency" className="w-full">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(CURRENCIES).map((currency) => (
            <SelectItem 
              key={currency.code} 
              value={currency.code}
              data-testid={`option-currency-${currency.code}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">{currency.symbol}</span>
                <span>{currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
