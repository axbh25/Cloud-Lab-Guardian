import { DetectedService } from '@/lib/guardianAgent';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ServicesProps {
  services: DetectedService[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service, idx) => (
        <div 
          key={idx} 
          className="bg-black/20 border border-border rounded-lg p-5 hover:border-primary/50 transition-colors flex flex-col h-full"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">{service.icon}</span>
              <div>
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-xs text-muted-foreground font-mono">{service.awsName}</p>
              </div>
            </div>
            
            {service.riskLevel === 'safe' && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 py-0.5">
                <ShieldCheck className="w-3 h-3 mr-1" /> Safe
              </Badge>
            )}
            {service.riskLevel === 'caution' && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 py-0.5">
                <AlertTriangle className="w-3 h-3 mr-1" /> Caution
              </Badge>
            )}
            {service.riskLevel === 'high' && (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 py-0.5">
                <ShieldAlert className="w-3 h-3 mr-1" /> High Risk
              </Badge>
            )}
          </div>
          
          <div className="mt-auto pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">Free Tier: </span>
              {service.freetier}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
