import { CostReview } from '@/lib/guardianAgent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Wallet, TrendingDown, AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CostProps {
  review: CostReview;
  onNext: () => void;
}

export default function Cost({ review, onNext }: CostProps) {
  return (
    <div className="p-6 md:p-8 space-y-10 animate-in fade-in">
      
      {/* Estimate Header */}
      <div className="bg-black/30 border border-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
            <DollarSign className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Estimated Monthly Cost</h3>
            <p className="text-3xl font-bold font-mono tracking-tight">{review.estimatedMonthly}</p>
          </div>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 text-primary-foreground p-4 rounded-lg flex items-start gap-3 max-w-md">
          <Wallet className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{review.budgetAdvice}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Tier Limits */}
        <section className="space-y-4">
          <h4 className="font-mono text-sm text-green-500 uppercase tracking-wider flex items-center">
            <TrendingDown className="w-4 h-4 mr-2" />
            Free Tier Allowances
          </h4>
          <div className="space-y-3">
            {review.freetiierItems.map((item, i) => (
              <div key={i} className="bg-green-500/5 border border-green-500/20 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-green-400">{item.service}</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 py-0 text-[10px]">
                    Free Tier
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
            {review.freetiierItems.length === 0 && (
              <div className="p-4 border border-border border-dashed rounded text-muted-foreground text-sm text-center">
                No free tier items detected.
              </div>
            )}
          </div>
        </section>

        {/* Paid Risks */}
        <section className="space-y-4">
          <h4 className="font-mono text-sm text-orange-500 uppercase tracking-wider flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Potential Charges & Risks
          </h4>
          <div className="space-y-3">
            {review.paidRisks.map((item, i) => (
              <div key={i} className="bg-orange-500/5 border border-orange-500/20 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-orange-400">{item.service}</span>
                  <Badge variant="outline" className={`py-0 text-[10px] ${
                    item.risk === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-orange-500/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {item.risk.toUpperCase()} RISK
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            ))}
            {review.paidRisks.length === 0 && (
              <div className="p-4 border border-border border-dashed rounded flex flex-col items-center justify-center text-muted-foreground text-sm text-center">
                <Check className="w-6 h-6 text-green-500 mb-2 opacity-50" />
                No high-risk paid items detected.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button onClick={onNext} className="font-mono text-sm group">
          Next: Step-by-Step Guide
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
