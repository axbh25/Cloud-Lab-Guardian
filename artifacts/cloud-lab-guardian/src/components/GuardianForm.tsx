import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Terminal, ShieldAlert, Zap, Layers, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { runGuardianPipeline, LabPlan, SkillLevel, BudgetRisk } from '@/lib/guardianAgent';

const formSchema = z.object({
  idea: z.string().min(10, "Please describe your idea in a bit more detail (at least 10 characters)."),
  skillLevel: z.enum(["complete-beginner", "some-experience", "intermediate"] as const),
  budget: z.enum(["$0", "$1", "$5", "$10"] as const),
  region: z.string().min(2, "Region is required.").default("us-east-1"),
});

type FormValues = z.infer<typeof formSchema>;

interface GuardianFormProps {
  onPlanGenerated: (plan: LabPlan) => void;
}

const LOADING_STEPS = [
  "Analyzing idea...",
  "Detecting AWS services...",
  "Building architecture diagram...",
  "Generating security review...",
  "Compiling cost estimates...",
  "Writing implementation guide...",
  "Finalizing README..."
];

export default function GuardianForm({ onPlanGenerated }: GuardianFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idea: "",
      skillLevel: "complete-beginner",
      budget: "$0",
      region: "us-east-1",
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 800); // Progress step every 800ms to simulate deep thought
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  async function onSubmit(data: FormValues) {
    setIsGenerating(true);
    try {
      const plan = await runGuardianPipeline({
        idea: data.idea,
        skillLevel: data.skillLevel as SkillLevel,
        budget: data.budget as BudgetRisk,
        region: data.region,
      });
      
      // Artificial delay just so the user sees the cool loading steps
      setTimeout(() => {
        setIsGenerating(false);
        onPlanGenerated(plan);
      }, 1000);
      
    } catch (error) {
      console.error("Failed to generate plan", error);
      setIsGenerating(false);
    }
  }

  if (isGenerating) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-6 min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Terminal className="w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-2 text-center">
          <h3 className="font-mono text-lg font-medium text-primary">Executing Pipeline</h3>
          <div className="h-6 overflow-hidden relative w-64 mx-auto">
            <div 
              className="flex flex-col transition-transform duration-500 ease-in-out text-muted-foreground font-mono text-sm"
              style={{ transform: `translateY(-${loadingStepIndex * 24}px)` }}
            >
              {LOADING_STEPS.map((step, idx) => (
                <div key={idx} className="h-6 flex items-center justify-center">{step}</div>
              ))}
            </div>
          </div>
          <div className="w-64 h-1 bg-secondary rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${Math.max(5, (loadingStepIndex / (LOADING_STEPS.length - 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
        
        <FormField
          control={form.control}
          name="idea"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Describe your AWS project idea
              </FormLabel>
              <FormDescription>
                Be as specific or vague as you want. We'll figure out the architecture.
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="e.g. build a serverless image uploader where users can upload a photo and it automatically resizes it and stores metadata in a database..." 
                  className="min-h-[120px] font-mono text-sm resize-y bg-black/20 focus-visible:ring-primary"
                  data-testid="input-idea"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="skillLevel"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Your Skill Level
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {[
                      { value: "complete-beginner", label: "Complete Beginner", desc: "First time using AWS" },
                      { value: "some-experience", label: "Some Experience", desc: "I've clicked around the console" },
                      { value: "intermediate", label: "Intermediate", desc: "I know the basics but want a plan" }
                    ].map((opt) => (
                      <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0 bg-secondary/30 border border-border/50 p-3 rounded-lg hover:bg-secondary/60 cursor-pointer transition-colors">
                        <FormControl>
                          <RadioGroupItem value={opt.value} />
                        </FormControl>
                        <div className="flex flex-col">
                          <FormLabel className="font-medium cursor-pointer">{opt.label}</FormLabel>
                          <span className="text-xs text-muted-foreground">{opt.desc}</span>
                        </div>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-accent" />
                  Monthly Budget Risk Tolerance
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {[
                      { value: "$0", label: "$0 (Free Tier Only)", color: "text-green-500" },
                      { value: "$1", label: "Up to $1", color: "text-green-400" },
                      { value: "$5", label: "Up to $5", color: "text-yellow-500" },
                      { value: "$10", label: "Up to $10", color: "text-orange-500" }
                    ].map((opt) => (
                      <FormItem key={opt.value} className="flex items-center space-x-3 space-y-0 bg-secondary/30 border border-border/50 p-3 rounded-lg hover:bg-secondary/60 cursor-pointer transition-colors">
                        <FormControl>
                          <RadioGroupItem value={opt.value} />
                        </FormControl>
                        <FormLabel className={`font-mono font-medium cursor-pointer ${opt.color}`}>
                          {opt.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem className="max-w-xs">
              <FormLabel className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                AWS Region
              </FormLabel>
              <FormControl>
                <Input 
                  className="font-mono bg-black/20" 
                  data-testid="input-region"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          size="lg" 
          className="w-full md:w-auto font-mono text-sm tracking-wider uppercase"
          data-testid="button-generate"
        >
          <Play className="w-4 h-4 mr-2" />
          Generate Plan
        </Button>
      </form>
    </Form>
  );
}
