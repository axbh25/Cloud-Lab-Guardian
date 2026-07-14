import { SecurityReview } from '@/lib/guardianAgent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert, AlertCircle, Info, Lock, CheckCircle2 } from 'lucide-react';

interface SecurityProps {
  review: SecurityReview;
  onNext: () => void;
}

export default function Security({ review, onNext }: SecurityProps) {
  return (
    <div className="p-6 md:p-8 space-y-10 animate-in fade-in">
      
      <section>
        <h3 className="text-2xl font-semibold mb-6 flex items-center text-red-500">
          <ShieldAlert className="w-6 h-6 mr-2" />
          Critical Security Warnings
        </h3>
        
        <div className="grid gap-4">
          {review.warnings.map((warn, idx) => {
            const isCritical = warn.level === 'critical';
            const isWarning = warn.level === 'warning';
            
            return (
              <div 
                key={idx} 
                className={`p-5 rounded-lg border flex gap-4 items-start ${
                  isCritical ? 'bg-red-500/10 border-red-500/50' : 
                  isWarning ? 'bg-yellow-500/10 border-yellow-500/50' : 
                  'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="shrink-0 mt-1">
                  {isCritical && <ShieldAlert className="w-5 h-5 text-red-500" />}
                  {isWarning && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                  {!isCritical && !isWarning && <Info className="w-5 h-5 text-blue-500" />}
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${
                    isCritical ? 'text-red-400' : 
                    isWarning ? 'text-yellow-400' : 
                    'text-blue-400'
                  }`}>
                    {warn.title}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">{warn.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h4 className="font-mono text-sm text-primary uppercase tracking-wider flex items-center">
            <Lock className="w-4 h-4 mr-2" />
            IAM Recommendations
          </h4>
          <ul className="space-y-3">
            {review.iamRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 bg-black/20 p-3 rounded border border-border/50 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
            {review.iamRecommendations.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No specific IAM recommendations for these services.</p>
            )}
          </ul>
        </section>

        <section className="space-y-4">
          <h4 className="font-mono text-sm text-green-500 uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            General Best Practices
          </h4>
          <ul className="space-y-3">
            {review.bestPractices.map((prac, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{prac}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button onClick={onNext} className="font-mono text-sm group">
          Next: Cost Analysis
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
