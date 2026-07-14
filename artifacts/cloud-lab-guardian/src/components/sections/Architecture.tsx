import { ArchitectureSection } from '@/lib/guardianAgent';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Server, Lightbulb } from 'lucide-react';

interface ArchitectureProps {
  architecture: ArchitectureSection;
  onNext: () => void;
}

export default function Architecture({ architecture, onNext }: ArchitectureProps) {
  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in">
      <div className="max-w-3xl">
        <h3 className="text-2xl font-semibold mb-3">System Architecture</h3>
        <p className="text-muted-foreground">{architecture.description}</p>
      </div>

      {architecture.diagram && (
        <div className="space-y-3">
          <h4 className="font-mono text-sm text-primary uppercase tracking-wider">Topology</h4>
          <div className="terminal-block p-6 bg-black/60 shadow-inner">
            <pre className="text-green-400 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto whitespace-pre">
              {architecture.diagram}
            </pre>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-mono text-sm text-primary uppercase tracking-wider">Components</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {architecture.components.map((comp, idx) => (
            <div key={idx} className="bg-secondary/20 border border-border p-5 rounded-lg flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <h5 className="font-semibold text-lg">{comp.name}</h5>
              </div>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{comp.purpose}</p>
              <div className="bg-primary/5 border border-primary/20 rounded p-3 mt-auto flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-primary/90 leading-relaxed">{comp.beginner_tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border/50">
        <Button onClick={onNext} className="font-mono text-sm group">
          Next: Security Review
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
