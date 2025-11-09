import { CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ValidationStatusProps {
  totalPercentage: number;
}

export default function ValidationStatus({ totalPercentage }: ValidationStatusProps) {
  const isValid = totalPercentage === 100;
  const difference = 100 - totalPercentage;

  return (
    <div className="space-y-3" data-testid="validation-status">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Total Allocation</span>
        <span className={`font-semibold ${isValid ? 'text-primary' : 'text-muted-foreground'}`}>
          {totalPercentage}% / 100%
        </span>
      </div>
      
      <Progress 
        value={Math.min(totalPercentage, 100)} 
        className="h-2"
        data-testid="progress-total-percentage"
      />
      
      {isValid ? (
        <div className="flex items-center gap-2 text-sm text-primary" data-testid="status-valid">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-medium">Perfect! All percentages allocated</span>
        </div>
      ) : difference > 0 ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground" data-testid="status-under">
          <AlertCircle className="h-4 w-4" />
          <span>{difference.toFixed(1)}% remaining</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-destructive" data-testid="status-over">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Over by {Math.abs(difference).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
