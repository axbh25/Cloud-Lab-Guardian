import { Button } from '@/components/ui/button';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface ReadmeProps {
  readme: string;
}

export default function Readme({ readme }: ReadmeProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = 'README.md'; 
    a.click();
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="p-0 flex flex-col h-full animate-in fade-in">
      
      {/* Action Bar */}
      <div className="bg-black/40 border-b border-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-bold">Portfolio Ready</h3>
            <p className="text-xs text-muted-foreground font-mono">Include this in your GitHub repository</p>
          </div>
        </div>
        
        <Button onClick={handleDownload} variant={downloaded ? "secondary" : "default"} className="font-mono w-full sm:w-auto">
          {downloaded ? (
            <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Downloaded</>
          ) : (
            <><Download className="w-4 h-4 mr-2" /> Download README.md</>
          )}
        </Button>
      </div>

      {/* Editor View */}
      <div className="bg-[#0d1117] p-6 overflow-y-auto max-h-[600px] font-mono text-sm text-gray-300 leading-relaxed custom-scrollbar">
        <pre className="whitespace-pre-wrap font-mono">
          {readme}
        </pre>
      </div>
      
    </div>
  );
}
