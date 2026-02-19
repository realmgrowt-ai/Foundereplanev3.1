import { Answers, DiagnosticResult, Stage, Bottleneck, EngagementReadiness } from './types';

// Internal scoring axes
interface ScoreCard {
  stage: Record<Stage, number>;
  bottleneck: Record<Bottleneck, number>;
  engagement: Record<EngagementReadiness, number>;
}

// Initialize empty scorecard
const createScoreCard = (): ScoreCard => ({
  stage: { Launch: 0, Growth: 0, Scale: 0 },
  bottleneck: { Clarity: 0, Positioning: 0, Revenue: 0, Systems: 0, 'Founder Dependency': 0 },
  engagement: { 'Self-guided': 0, Guided: 0, 'Execution-ready': 0 },
});

// Scoring logic based on v2 specification
const scoreAnswers = (answers: Answers): ScoreCard => {
  const scores = createScoreCard();

  // Q1: Current Situation
  switch (answers.q1) {
    case 'idea':
      scores.stage.Launch += 3;
      scores.bottleneck.Clarity += 2;
      scores.engagement.Guided += 1;
      break;
    case 'early-launch':
      scores.stage.Launch += 2;
      scores.bottleneck.Clarity += 1;
      scores.engagement.Guided += 1;
      break;
    case 'launched-traction':
      scores.stage.Growth += 2;
      scores.bottleneck.Revenue += 1;
      scores.engagement['Execution-ready'] += 1;
      break;
    case 'consistent-revenue':
      scores.stage.Growth += 2;
      scores.bottleneck.Systems += 1;
      scores.engagement['Execution-ready'] += 1;
      break;
    case 'team-operations':
      scores.stage.Scale += 2;
      scores.bottleneck['Founder Dependency'] += 1;
      scores.engagement['Execution-ready'] += 2;
      break;
  }

  // Q2: Hardest Right Now
  switch (answers.q2) {
    case 'focus':
      scores.bottleneck.Clarity += 3;
      scores.engagement.Guided += 1;
      break;
    case 'understanding':
      scores.bottleneck.Positioning += 3;
      scores.engagement.Guided += 1;
      break;
    case 'revenue':
      scores.bottleneck.Revenue += 3;
      scores.engagement['Execution-ready'] += 1;
      break;
    case 'stepping-away':
      scores.bottleneck['Founder Dependency'] += 3;
      scores.engagement['Execution-ready'] += 1;
      break;
    case 'depends-on-me':
      scores.bottleneck['Founder Dependency'] += 3;
      scores.engagement['Execution-ready'] += 2;
      break;
  }

  // Q3: Direction Clarity
  switch (answers.q3) {
    case 'unclear':
      scores.stage.Launch += 2;
      scores.bottleneck.Clarity += 2;
      break;
    case 'shaky':
      scores.stage.Launch += 1;
      scores.stage.Growth += 1;
      scores.bottleneck.Clarity += 1;
      break;
    case 'clear-struggling':
      scores.stage.Growth += 2;
      scores.bottleneck.Systems += 1;
      break;
    case 'clear-executing':
      scores.stage.Scale += 2;
      scores.bottleneck.Systems += 1;
      break;
  }

  // Q4: Founder Dependency
  switch (answers.q4) {
    case 'fully-dependent':
      scores.stage.Growth += 1;
      scores.bottleneck['Founder Dependency'] += 3;
      break;
    case 'mostly-dependent':
      scores.stage.Growth += 1;
      scores.bottleneck['Founder Dependency'] += 2;
      break;
    case 'some-structure':
      scores.stage.Scale += 1;
      scores.bottleneck.Systems += 1;
      break;
    case 'runs-without-me':
      scores.stage.Scale += 2;
      scores.bottleneck.Systems += 1;
      break;
  }

  // Q5: Demand Shock
  switch (answers.q5) {
    case 'struggle':
      scores.stage.Growth += 1;
      scores.bottleneck.Systems += 3;
      break;
    case 'manage-effort':
      scores.stage.Growth += 1;
      scores.bottleneck.Systems += 2;
      break;
    case 'handle-it':
      scores.stage.Scale += 1;
      scores.bottleneck.Systems += 1;
      break;
    case 'built-for-it':
      scores.stage.Scale += 2;
      scores.bottleneck.Systems += 1;
      break;
  }

  // Q6: Decision Friction
  switch (answers.q6) {
    case 'what-to-build':
      scores.bottleneck.Clarity += 3;
      break;
    case 'how-to-position':
      scores.bottleneck.Positioning += 3;
      break;
    case 'how-to-sell':
      scores.bottleneck.Revenue += 3;
      break;
    case 'how-to-operate':
      scores.bottleneck.Systems += 3;
      break;
    case 'how-to-grow':
      scores.bottleneck['Founder Dependency'] += 2;
      break;
  }

  // Q7: Next 6 Months Goal
  switch (answers.q7) {
    case 'validate-idea':
      scores.stage.Launch += 2;
      scores.engagement.Guided += 2;
      break;
    case 'build-brand':
      scores.stage.Launch += 1;
      scores.stage.Growth += 1;
      scores.engagement.Guided += 1;
      break;
    case 'predictable-revenue':
      scores.stage.Growth += 2;
      scores.engagement['Execution-ready'] += 1;
      break;
    case 'stability-systems':
      scores.stage.Scale += 1;
      scores.engagement['Execution-ready'] += 1;
      break;
    case 'remove-bottleneck':
      scores.stage.Scale += 2;
      scores.engagement['Execution-ready'] += 2;
      break;
  }

  return scores;
};

// Determine highest score with tie-breaker
const determineStage = (scores: Record<Stage, number>): Stage => {
  const entries = Object.entries(scores) as [Stage, number][];
  const maxScore = Math.max(...entries.map(([, score]) => score));
  const tied = entries.filter(([, score]) => score === maxScore).map(([stage]) => stage);
  
  // If tie, prefer earlier stage (Launch < Growth < Scale)
  if (tied.includes('Launch')) return 'Launch';
  if (tied.includes('Growth')) return 'Growth';
  return 'Scale';
};

const determineBottleneck = (scores: Record<Bottleneck, number>): Bottleneck => {
  const entries = Object.entries(scores) as [Bottleneck, number][];
  const maxScore = Math.max(...entries.map(([, score]) => score));
  const winner = entries.find(([, score]) => score === maxScore);
  return winner ? winner[0] : 'Clarity'; // Default fallback
};

const determineEngagement = (scores: Record<EngagementReadiness, number>): EngagementReadiness => {
  const entries = Object.entries(scores) as [EngagementReadiness, number][];
  const maxScore = Math.max(...entries.map(([, score]) => score));
  const winner = entries.find(([, score]) => score === maxScore);
  return winner ? winner[0] : 'Guided';
};

// System recommendations based on Stage + Bottleneck
const getRecommendedSystem = (stage: Stage, bottleneck: Bottleneck) => {
  const systemMap: Record<string, { name: string; description: string; route: string }> = {
    'Launch-Clarity': {
      name: 'BoltGuider',
      description: 'A guided clarity system designed to help you decide what to build, who to serve, and what to prioritize — before you invest more time or money.',
      route: '/services/boltguider#hero',
    },
    'Launch-Positioning': {
      name: 'BrandToFly',
      description: 'A positioning system that helps people understand what you do, who you serve, and why it matters — so you stop explaining and start connecting.',
      route: '/services/brandtofly#hero',
    },
    'Growth-Revenue': {
      name: 'D2CBolt',
      description: 'A revenue acceleration system designed to help you attract, convert, and retain customers predictably — without burning out.',
      route: '/services/d2cbolt#hero',
    },
    'Growth-Systems': {
      name: 'BoltRunway',
      description: 'An operational systems framework that helps you build sustainable processes, so growth doesn\'t break everything.',
      route: '/services/boltrunway#hero',
    },
    'Scale-Founder Dependency': {
      name: 'ScaleRunway',
      description: 'A founder-offloading system designed to help you step back from daily execution without losing momentum or control.',
      route: '/services/scalerunway#hero',
    },
  };

  const key = `${stage}-${bottleneck}`;
  return systemMap[key] || systemMap['Launch-Clarity']; // Fallback to BoltGuider
};

// Stage descriptions
const getStageDescription = (stage: Stage): string => {
  const descriptions: Record<Stage, string> = {
    Launch: "You're still shaping direction — testing, validating, and figuring out what's worth committing to. At this stage, clarity matters more than speed. The right focus now prevents expensive mistakes later.",
    Growth: "You've proven the concept, and now you're building momentum. The challenge isn't whether it works — it's making it work consistently, at scale, without everything depending on you.",
    Scale: "You're past early-stage chaos and have real traction. Now the goal is stability, repeatability, and removing yourself as the bottleneck — so the business can grow without you being the engine.",
  };
  return descriptions[stage];
};

// Bottleneck descriptions
const getBottleneckDescription = (bottleneck: Bottleneck): string => {
  const descriptions: Record<Bottleneck, string> = {
    Clarity: "You're not short on effort — you're short on certainty. Decisions feel heavy because the direction isn't fully locked, which slows everything else down.",
    Positioning: "People are confused about what you do or who it's for. Until positioning is clear, marketing feels inefficient and sales conversations take too long.",
    Revenue: "The business has potential, but revenue isn't coming in predictably or fast enough. You need a reliable system to attract, convert, and retain customers.",
    Systems: "Things are working, but barely. There's no repeatable process, so growth creates chaos instead of momentum. You need operational structure before scaling further.",
    'Founder Dependency': "Everything runs through you. If you step away, things slow down or break. The business needs to function without you being the bottleneck.",
  };
  return descriptions[bottleneck];
};

// What to avoid
const getWhatToAvoid = (stage: Stage): string => {
  const avoidance: Record<Stage, string> = {
    Launch: "Avoid scaling tactics, paid ads, or complex systems. Those are Growth and Scale problems. Right now, your job is to validate direction before optimizing execution.",
    Growth: "Avoid premature delegation or trying to remove yourself too early. You still need to be in execution mode. Don't chase new markets until you've stabilized the current one.",
    Scale: "Avoid getting pulled back into execution. Your job now is building systems and teams, not doing the work yourself. Don't ignore the operational gaps just because revenue is coming in.",
  };
  return avoidance[stage];
};

// Main interpretation function
export const interpretAnswers = (answers: Answers): DiagnosticResult => {
  const scores = scoreAnswers(answers);
  
  const stage = determineStage(scores.stage);
  const bottleneck = determineBottleneck(scores.bottleneck);
  const engagementReadiness = determineEngagement(scores.engagement);
  
  const recommendedSystem = getRecommendedSystem(stage, bottleneck);
  const stageDescription = getStageDescription(stage);
  const bottleneckDescription = getBottleneckDescription(bottleneck);
  const whatToAvoid = getWhatToAvoid(stage);

  return {
    stage,
    bottleneck,
    engagementReadiness,
    recommendedSystem,
    stageDescription,
    bottleneckDescription,
    whatToAvoid,
  };
};
