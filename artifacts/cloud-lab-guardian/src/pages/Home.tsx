import React, { useState } from 'react';
import { Shield, Terminal, Cpu, Server, AlertTriangle } from 'lucide-react';
import GuardianForm from '@/components/GuardianForm';
import PlanResults from '@/components/PlanResults';
import { LabPlan, PipelineMode } from '@/lib/guardianAgent';

function ModeBadge({ mode }: { mode: PipelineMode }) {
  const configs: Record<PipelineMode, { label: string; icon: React.ReactNode; className: string }> = {
    local: {
      label: 'Local deterministic mode',
      icon: <Cpu className="w-3 h-3 mr-1.5" />,
      className: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    },
    lambda: {
      label: 'Lambda API mode',
      icon: <Server className="w-3 h-3 mr-1.5" />,
      className: 'text-blue-400 border-blue-500/40 bg-blue-500/10',
    },
    'lambda-fallback': {
      label: 'Lambda failed, using local fallback',
      icon: <AlertTriangle className="w-3 h-3 mr-1.5" />,
      className: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    },
  };
  const c = configs[mode];
  return (
    <div className={`px-2.5 py-1 rounded-md text-xs font-mono flex items-center border ${c.className}`}>
      {c.icon}
      {c.label}
    </div>
  );
}

export default function Home() {
  const [plan, setPlan] = useState<LabPlan | null>(null);

  const handleReset = () => {
    setPlan(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col items-center selection:bg-primary/30">
      
      {/* Header */}
      <header className="w-full border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto w-full px-4 h-16 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg leading-tight flex items-center gap-2">
              Cloud Lab Guardian
            </h1>
            <p className="text-xs text-muted-foreground font-mono">Agentic AWS Mentor</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col animate-in fade-in duration-500">
        {!plan ? (
          <div className="max-w-2xl mx-auto w-full mt-8 md:mt-12 space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Design your AWS project safely.
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Describe your idea. We'll generate a comprehensive, step-by-step architecture plan designed around current AWS Free Tier limits, credits, and surprise-bill safeguards.
              </p>
            </div>
            
            <div className="bg-card border border-border shadow-lg rounded-xl p-6 md:p-8 relative overflow-hidden">
              {/* Decorative terminal background elements */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Terminal className="w-64 h-64" />
              </div>
              
              <GuardianForm onPlanGenerated={setPlan} />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-end">
              <ModeBadge mode={plan.pipelineMode} />
            </div>
            <PlanResults plan={plan} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-border/40 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-muted-foreground text-xs font-mono">
          <p>Stay Safe. Stay Serverless.</p>
          <p className="text-muted-foreground/60">Cloud Lab Guardian v0.1.0</p>
        </div>
      </footer>
    </div>
  );
}
