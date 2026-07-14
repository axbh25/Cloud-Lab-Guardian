import { useState } from 'react';
import { Step } from '@/lib/guardianAgent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, ExternalLink, Check } from 'lucide-react';

interface StepsProps {
  steps: Step[];
  onNext: () => void;
}

export default function Steps({ steps, onNext }: StepsProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 space-y-10 animate-in fade-in">
      
      <div className="max-w-3xl">
        <h3 className="text-2xl font-semibold mb-3">Implementation Guide</h3>
        <p className="text-muted-foreground">Follow these steps sequentially to build your project safely. CLI commands are provided where useful.</p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-card bg-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -ml-5 md:ml-0 z-10 text-primary-foreground font-mono font-bold text-sm">
              {step.number}
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-lg">{step.title}</h4>
                {step.consoleLink && (
                  <a 
                    href={step.consoleLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-xs font-mono bg-primary/10 px-2 py-1 rounded"
                    title="Open AWS Console"
                  >
                    Console <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              
              {step.commands && step.commands.length > 0 && (
                <div className="mt-4 space-y-2">
                  {step.commands.map((cmd, cmdIdx) => {
                    const id = `${idx}-${cmdIdx}`;
                    const isCopied = copiedIndex === id;
                    return (
                      <div key={cmdIdx} className="relative group/cmd">
                        <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/cmd:opacity-100 transition-opacity">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6 bg-black/50 hover:bg-black text-white rounded"
                            onClick={() => handleCopy(cmd, id)}
                          >
                            {isCopied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                        <div className="terminal-block p-3 text-xs text-blue-300 pr-10">
                          <code>{cmd}</code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-8 border-t border-border/50">
        <Button onClick={onNext} className="font-mono text-sm group">
          Next: Cleanup
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
