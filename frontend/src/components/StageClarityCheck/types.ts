export interface Question {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

export interface Answers {
  current_situation?: string;
  hardest_right_now?: string;
  business_direction?: string;
  dependency?: string;
  scale_readiness?: string;
  decision_bottleneck?: string;
  intent?: string;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  country: string;
}

export type Stage = 'Launch' | 'Growth' | 'Scale';

export type Bottleneck = 
  | 'Clarity' 
  | 'Positioning' 
  | 'Revenue' 
  | 'Systems' 
  | 'Founder Dependency';

export type EngagementReadiness = 'Self-guided' | 'Guided' | 'Execution-ready';

export interface DiagnosticResult {
  stage: Stage;
  bottleneck: Bottleneck;
  engagementReadiness?: EngagementReadiness; // Internal only, not shown to user
  recommendedSystem: {
    name: string;
    description: string;
    route: string;
  };
  stageDescription: string;
  bottleneckDescription: string;
  whatToAvoid: string;
  personalizedInsight?: string; // AI-generated personalized insight
  leadId?: string; // ID from backend
}

export interface StageClarityCheckProps {
  isOpen: boolean;
  onClose: () => void;
}
