import { useState } from 'react';
import { CleanupSection } from '@/lib/guardianAgent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Clock, CheckSquare, Square, Copy, Check } from 'lucide-react';

interface CleanupProps {
  cleanup: CleanupSection;
  onNext: () => void;
}

export default function Cleanup({ cleanup, onNext }: CleanupProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [isCopied, setIsCopied] = useState(false);

  const toggleCheck = (index: number) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setCheckedItems(newSet);
  };

  const handleCopy = () => {
    const text = cleanup.commands.join('\n');
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const allChecked = checkedItems.size === cleanup.checklist.length && cleanup.checklist.length > 0;

  return (
    <div className="p-6 md:p-8 space-y-10 animate-in fade-in">
      
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-destructive flex items-center gap-2 mb-2">
            <Trash2 className="w-5 h-5" />
            Destroy Phase
          </h3>
          <p className="text-muted-foreground text-sm max-w-xl">
            Never leave unused resources running. Cloud bills compound silently. Follow this checklist to cleanly destroy everything created in this lab.
          </p>
        </div>
        <div className="bg-black/40 border border-border px-4 py-3 rounded-lg flex items-center gap-3 shrink-0">
          <Clock className="w-5 h-5 text-accent" />
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase">Est. Time</p>
            <p className="font-bold text-accent">{cleanup.estimatedTime}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-mono text-sm uppercase tracking-wider text-primary">Interactive Checklist</h4>
          <div className="space-y-2">
            {cleanup.checklist.map((item, idx) => {
              const isChecked = checkedItems.has(idx);
              return (
                <div 
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    isChecked 
                      ? 'bg-black/20 border-border/40 opacity-60' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-green-500" />
                    ) : (
                      <Square className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
          
          {allChecked && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm font-medium flex items-center justify-center animate-in zoom-in">
              <Check className="w-4 h-4 mr-2" /> All resources accounted for.
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <h4 className="font-mono text-sm uppercase tracking-wider text-primary">CLI Teardown</h4>
          <div className="relative group rounded-xl overflow-hidden border border-border bg-black">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
              <span className="text-xs font-mono text-muted-foreground">bash</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs font-mono"
                onClick={handleCopy}
              >
                {isCopied ? <span className="text-green-400 flex items-center"><Check className="w-3 h-3 mr-1"/> Copied</span> : <span className="flex items-center"><Copy className="w-3 h-3 mr-1"/> Copy</span>}
              </Button>
            </div>
            <div className="p-4 text-xs font-mono text-destructive/90 overflow-x-auto whitespace-pre leading-relaxed">
              {cleanup.commands.join('\n')}
              {cleanup.commands.length === 0 && (
                <span className="text-muted-foreground"># Manual console deletion required.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button onClick={onNext} className="font-mono text-sm group">
          Next: Portfolio README
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
