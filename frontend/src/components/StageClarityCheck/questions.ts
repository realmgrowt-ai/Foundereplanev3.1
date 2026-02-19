import { Question } from './types';

export const questions: Question[] = [
  {
    id: "current_situation",
    question: "Which best describes your current situation?",
    options: [
      { value: "exploring", label: "Still exploring — I have an idea but haven't started" },
      { value: "early_launch", label: "Early launch — I've started but things are unstable" },
      { value: "launched_inconsistent", label: "Launched — getting some traction but revenue is inconsistent" },
      { value: "consistent_revenue", label: "Consistent revenue — but growth feels stuck" },
      { value: "team_growing", label: "I have a team and operations are growing" }
    ]
  },
  {
    id: "hardest_right_now",
    question: "What feels hardest right now?",
    options: [
      { value: "clarity", label: "I don't know what to focus on or where to start" },
      { value: "brand_understanding", label: "People don't really understand what I do or why it matters" },
      { value: "revenue_execution", label: "I know what I'm doing — but revenue isn't coming in fast enough" },
      { value: "stability", label: "Things work, but I can't step away without it falling apart" },
      { value: "founder_dependency", label: "Everything depends on me — I'm the bottleneck" }
    ]
  },
  {
    id: "business_direction",
    question: "How clear is your business direction?",
    options: [
      { value: "unclear", label: "Unclear — I'm still trying to figure out what to build" },
      { value: "shaky", label: "Shaky — I've started, but I'm not sure if this is the right path" },
      { value: "clear_struggling", label: "Clear — but I'm struggling to execute on it" },
      { value: "clear_executing", label: "Clear — and I'm executing on it" }
    ]
  },
  {
    id: "dependency",
    question: "How dependent is the business on you personally?",
    options: [
      { value: "fully_dependent", label: "Fully dependent — nothing happens without me" },
      { value: "mostly_dependent", label: "Mostly dependent — I can step back briefly but not for long" },
      { value: "some_structure", label: "Some structure — parts run without me, but not all" },
      { value: "runs_without_me", label: "Runs without me — I'm focused on strategy and growth" }
    ]
  },
  {
    id: "scale_readiness",
    question: "What happens if demand suddenly increases?",
    options: [
      { value: "struggle", label: "We'd struggle — operations would break" },
      { value: "effort_required", label: "We'd manage — but it would take a lot of effort" },
      { value: "handle_well", label: "We'd handle it — we have systems in place" },
      { value: "built_for_growth", label: "We're built for it — we can scale without chaos" }
    ]
  },
  {
    id: "decision_bottleneck",
    question: "Where are most of your decisions stuck?",
    options: [
      { value: "what_to_build", label: "What to build — I'm unsure of my focus" },
      { value: "how_to_position", label: "How to position — I don't know how to talk about what I do" },
      { value: "how_to_sell", label: "How to sell — I can't convert interest into sales" },
      { value: "how_to_operate", label: "How to operate — things are chaotic and I'm stuck firefighting" },
      { value: "how_to_grow", label: "How to grow — I can't scale without burning out" }
    ]
  },
  {
    id: "intent",
    question: "What are you trying to achieve in the next 6 months?",
    options: [
      { value: "clarity_validation", label: "Get clarity and validate my idea before committing" },
      { value: "build_brand", label: "Build a brand that actually connects with people" },
      { value: "predictable_revenue", label: "Get predictable revenue flowing" },
      { value: "stability_systems", label: "Create stability with systems and processes" },
      { value: "scale_beyond_me", label: "Scale beyond me — remove myself as the bottleneck" }
    ]
  }
];
