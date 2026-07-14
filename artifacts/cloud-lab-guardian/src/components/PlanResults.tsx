import { useState } from 'react';
import { ArrowLeft, Terminal, Server, Shield, DollarSign, CheckSquare, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LabPlan } from '@/lib/guardianAgent';

import Architecture from './sections/Architecture';
import Services from './sections/Services';
import Security from './sections/Security';
import Cost from './sections/Cost';
import Steps from './sections/Steps';
import Cleanup from './sections/Cleanup';
import Readme from './sections/Readme';

interface PlanResultsProps {
  plan: LabPlan;
  onReset: () => void;
}

export default function PlanResults({ plan, onReset }: PlanResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-4 border-b border-border/50">
        <div>
          <Button variant="ghost" size="sm" onClick={onReset} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to ideation
          </Button>
          <h2 className="text-2xl font-semibold tracking-tight">Your Lab Plan is Ready</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1 border-l-2 border-primary pl-2">
            Target: {plan.normalizedIdea}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-secondary rounded-md text-xs font-mono text-muted-foreground flex items-center border border-border">
            <Shield className="w-3 h-3 mr-1.5 text-green-500" />
            Safe Mode Enabled
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Scrollable tab list for mobile friendliness */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
          <TabsList className="bg-card border border-border h-12 inline-flex w-max md:w-full justify-start p-1">
            <TabsTrigger value="overview" className="gap-2 font-mono text-xs">
              <Layers className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="architecture" className="gap-2 font-mono text-xs">
              <Server className="w-4 h-4" /> Architecture
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 font-mono text-xs">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="cost" className="gap-2 font-mono text-xs">
              <DollarSign className="w-4 h-4" /> Cost
            </TabsTrigger>
            <TabsTrigger value="steps" className="gap-2 font-mono text-xs">
              <Terminal className="w-4 h-4" /> Steps
            </TabsTrigger>
            <TabsTrigger value="cleanup" className="gap-2 font-mono text-xs">
              <CheckSquare className="w-4 h-4" /> Cleanup
            </TabsTrigger>
            <TabsTrigger value="readme" className="gap-2 font-mono text-xs">
              <FileText className="w-4 h-4" /> README
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6 bg-card border border-border rounded-xl min-h-[500px] overflow-hidden shadow-xl">
          
          <TabsContent value="overview" className="m-0 p-6 md:p-8 animate-in fade-in focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-10">
              <section>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="bg-primary/20 text-primary w-8 h-8 rounded flex items-center justify-center mr-3 text-sm font-mono">01</span>
                  Services Required
                </h3>
                <Services services={plan.detectedServices} />
              </section>

              <div className="h-px w-full bg-border/50" />

              <section>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="bg-primary/20 text-primary w-8 h-8 rounded flex items-center justify-center mr-3 text-sm font-mono">02</span>
                  Things to Consider
                </h3>
                <div className="grid gap-3">
                  {plan.clarifyingQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-3 bg-secondary/30 p-4 rounded-lg border border-border/50">
                      <div className="mt-0.5 text-primary">?</div>
                      <p className="text-sm">{q}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setActiveTab("architecture")} className="font-mono text-sm group">
                  Next: Architecture
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <Architecture architecture={plan.architecture} onNext={() => setActiveTab("security")} />
          </TabsContent>

          <TabsContent value="security" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <Security review={plan.securityReview} onNext={() => setActiveTab("cost")} />
          </TabsContent>

          <TabsContent value="cost" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <Cost review={plan.costReview} onNext={() => setActiveTab("steps")} />
          </TabsContent>

          <TabsContent value="steps" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <Steps steps={plan.steps} onNext={() => setActiveTab("cleanup")} />
          </TabsContent>

          <TabsContent value="cleanup" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <Cleanup cleanup={plan.cleanup} onNext={() => setActiveTab("readme")} />
          </TabsContent>

          <TabsContent value="readme" className="m-0 focus-visible:outline-none focus-visible:ring-0">
            <Readme readme={plan.readme} />
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
