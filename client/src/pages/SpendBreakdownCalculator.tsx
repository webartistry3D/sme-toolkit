import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import TotalAmountInput from "@/components/TotalAmountInput";
import CategoryRow, { Category } from "@/components/CategoryRow";
import ProfitDisplay from "@/components/ProfitDisplay";
import ValidationStatus from "@/components/ValidationStatus";
import BreakdownPreview from "@/components/BreakdownPreview";
import ExportButtons from "@/components/ExportButtons";
import CurrencySelector, { Currency, CURRENCIES } from "@/components/CurrencySelector";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'spend-breakdown-data';

export default function SpendBreakdownCalculator() {
  const [totalAmount, setTotalAmount] = useState('100000');
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const { toast } = useToast();

  // ✅ Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.totalAmount) setTotalAmount(data.totalAmount);
        if (data.categories) setCategories(data.categories);
        if (data.currency) setCurrency(data.currency);
      } catch (err) {
        console.error('Failed to load saved data:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      totalAmount,
      categories,
      currency,
    }));
  }, [totalAmount, categories, currency]);

  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  const profitPercentage = Math.max(0, 100 - totalPercentage);
  const profitAmount = (Number(totalAmount) * profitPercentage) / 100;
  const isValid = totalPercentage === 100;
  const currencyInfo = CURRENCIES[currency];

  const addCategory = () => {
    const newId = Date.now().toString();
    const newCategory: Category = {
      id: newId,
      name: '',
      percentage: 0,
    };
    setCategories([...categories, newCategory]);
    setAnimatingId(newId);
    setTimeout(() => setAnimatingId(null), 300);
  };

  const updateCategory = (id: string, field: 'name' | 'percentage', value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Category removed",
      description: "Expense category has been deleted",
    });
  };

  const resetAll = () => {
    setTotalAmount('');
    setCategories([]);
    toast({
      title: "Reset complete",
      description: "All data has been cleared",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Spend Breakdown Calculator
          </h1>
          <p className="text-muted-foreground">
            Enter your total amount and break it down into spending categories based on percentages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CurrencySelector value={currency} onChange={setCurrency} />
          <TotalAmountInput value={totalAmount} onChange={setTotalAmount} currencyInfo={currencyInfo} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Expense Categories
                </h2>
                <Button
                  data-testid="button-add-category"
                  onClick={addCategory}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              <div className="space-y-3">
                {categories.length === 0 ? (
                  <div className="text-center py-12 bg-card border border-card-border rounded-lg">
                    <div className="text-muted-foreground mb-4">
                      No expense categories yet
                    </div>
                    <Button
                      data-testid="button-add-first-category"
                      onClick={addCategory}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Expense
                    </Button>
                  </div>
                ) : (
                  categories.map(category => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      totalAmount={Number(totalAmount)}
                      onUpdate={updateCategory}
                      onDelete={deleteCategory}
                      currencyInfo={currencyInfo}
                      isAnimating={category.id === animatingId}
                    />
                  ))
                )}
              </div>
            </div>

            {categories.length > 0 && (
              <div className="space-y-4">
                <ProfitDisplay 
                  percentage={profitPercentage} 
                  amount={profitAmount}
                  currencyInfo={currencyInfo}
                />
                
                <ValidationStatus totalPercentage={totalPercentage} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <BreakdownPreview
              totalAmount={Number(totalAmount)}
              categories={categories}
              profitPercentage={profitPercentage}
              currencyInfo={currencyInfo}
            />

            <ExportButtons
              totalAmount={Number(totalAmount)}
              categories={categories}
              profitPercentage={profitPercentage}
              isValid={isValid}
              currencyInfo={currencyInfo}
            />

            <div className="pt-4 border-t border-border">
              <Button
                data-testid="button-reset"
                onClick={resetAll}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
