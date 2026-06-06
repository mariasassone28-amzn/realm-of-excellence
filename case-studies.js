// ═══ CASE STUDIES (Multi-step linked scenarios) ═══
// Each case has 3 sequential questions that build on each other.
// Getting one wrong still continues but affects final score.

const CASE_STUDIES = [
  {
    id: 'case-auth-denial',
    title: 'The Missing Authorization',
    intro: 'A $12,000 surgical claim is denied. CARC 197: "Precertification/authorization absent." The surgery was performed 3 weeks ago. The patient is calling daily asking why they received a bill. Your manager is asking for a resolution plan.',
    icon: '🏥',
    difficulty: 'journeyman',
    xpTotal: 60,
    steps: [
      {
        question: 'Step 1: What is your FIRST action?',
        answers: ['Call the payer to argue', 'Check internal records to verify whether authorization was actually obtained before the service', 'Bill the patient', 'Write it off as a loss'],
        correct: 1,
        explanation: 'Dive Deep first. Before any external action, verify internally: Was auth obtained and just not attached? Was it never requested? The answer changes your entire resolution path.'
      },
      {
        question: 'Step 2: You find that authorization WAS obtained (auth number exists in the system) but was never attached to the claim. What is your resolution path?',
        answers: ['Submit a formal appeal with clinical documentation', 'Resubmit the claim with the authorization number attached — this is a correctable administrative error, not a clinical dispute', 'Request a new authorization retroactively', 'Escalate to legal'],
        correct: 1,
        explanation: 'This is a resubmission, NOT an appeal. The auth exists — it just wasn\'t included. Resubmit with the auth number. Appeals are for when you disagree with the payer\'s decision. Here, we agree they need the auth — we just forgot to include it.'
      },
      {
        question: 'Step 3: The claim is now paid. What mechanism do you propose to prevent this from happening again?',
        answers: ['Send a reminder email to the team', 'Implement a pre-submission checklist that verifies auth attachment for all claims requiring prior authorization — automate the check if possible', 'Nothing — it was a one-time mistake', 'Hire someone to check all claims manually'],
        correct: 1,
        explanation: 'Invent and Simplify: Build a mechanism (automated or checklist-based) that catches missing auths BEFORE submission. One-time fixes don\'t scale. A system check prevents recurrence for every future claim.'
      }
    ]
  },
  {
    id: 'case-patient-fury',
    title: 'The Frustrated Patient',
    intro: 'A patient calls your PFS team furious. They had a routine physical (supposed to be 100% covered as preventive care) but received a $1,800 bill. They say: "I was told this would be free. I\'m switching doctors." The account shows the claim was processed with a diagnosis code for a chronic condition, not preventive care.',
    icon: '😤',
    difficulty: 'master',
    xpTotal: 75,
    steps: [
      {
        question: 'Step 1: The patient is angry and threatening to leave. What is your immediate priority? (Customer Obsession)',
        answers: ['Transfer them to billing', 'Acknowledge their frustration, assure them you will investigate personally, and commit to a callback within 24 hours with a resolution — don\'t let them feel abandoned', 'Tell them it\'s their insurance\'s fault', 'Offer to write off the balance immediately'],
        correct: 1,
        explanation: 'Customer Obsession: The patient needs to feel heard and know someone OWNS their problem. Don\'t deflect, don\'t rush. Commit to a timeline and own it.'
      },
      {
        question: 'Step 2: You investigate and find the provider documented a chronic condition discussion during the preventive visit, causing the coder to add a diagnosis code that changed the claim from "preventive" to "diagnostic." Who do you coordinate with?',
        answers: ['Just fix it yourself', 'Coordinate with Medical Coding to review whether the diagnosis code is clinically justified or if the visit should be split into preventive + diagnostic — this requires clinical and coding judgment together', 'Call the insurance company to override', 'Tell the patient it was coded correctly and they owe the money'],
        correct: 1,
        explanation: 'Cross-functional collaboration: This lives at the intersection of clinical documentation, coding, and billing. You can\'t resolve it alone. The coder needs to determine if the code was appropriate or if the claim should be resubmitted as preventive with the chronic condition handled separately.'
      },
      {
        question: 'Step 3: The coding team confirms the visit should have been split. The claim is corrected and resubmitted. The patient owes $0. How do you close the loop?',
        answers: ['Mark it resolved in the system', 'Call the patient back (as promised), explain the correction, confirm $0 balance, apologize for the confusion, and share feedback with the clinical team so documentation is clearer going forward — close EVERY loop', 'Send a letter', 'Wait for the corrected EOB to reach the patient'],
        correct: 1,
        explanation: 'Earn Trust: You promised a callback — deliver it. Ownership: Feed the lesson back to clinical documentation so it doesn\'t recur. The patient relationship is preserved because you followed through on every commitment.'
      }
    ]
  },
  {
    id: 'case-ar-spike',
    title: 'The AR Aging Crisis',
    intro: 'Your weekly dashboard shows AR over 90 days jumped by $850K in one week. Leadership is asking for root cause by end of day. You have data showing 78% of the increase is from a single payer. Collections yield dropped 6 points.',
    icon: '📊',
    difficulty: 'master',
    xpTotal: 75,
    steps: [
      {
        question: 'Step 1: Leadership wants an answer today. Where do you start? (Dive Deep)',
        answers: ['Blame the payer', 'Segment the $850K by denial code, date of service range, and service type to identify the PATTERN — is it one denial reason? One provider? One date range? Data first, conclusions second.', 'Ask the team if anyone knows what happened', 'Send an email to the payer asking what went wrong'],
        correct: 1,
        explanation: 'Dive Deep: Don\'t guess. Segment the data. The answer is in the pattern. If 78% is one payer, drill into: What denial codes? What dates? What changed? Data tells you where to look.'
      },
      {
        question: 'Step 2: Your analysis reveals: all 78% are "Medical Records Requested" — the payer sent requests 90 days ago that were never fulfilled. The records were requested but got stuck in an internal queue. What do you do NOW?',
        answers: ['Wait for the records department to clear the backlog', 'Immediately prioritize these requests — triage by dollar value and timely filing deadline, escalate the top 20 highest-value claims today, and assign dedicated capacity to clear the backlog within 5 business days', 'Appeal all of them', 'Write off anything past filing deadline'],
        correct: 1,
        explanation: 'Bias for Action: Every day these sit = more claims crossing timely filing. Prioritize by value and deadline urgency. Think Big: Clear ALL of them systematically, not just the easy ones. Assign dedicated capacity — this is an emergency.'
      },
      {
        question: 'Step 3: The backlog is cleared and claims are being resubmitted. What do you present to leadership and what mechanism do you propose?',
        answers: ['Say it\'s fixed and move on', 'Present: root cause (records request queue had no SLA monitoring), financial impact ($850K at risk, recovered X%), and mechanism: implement a 30-day aging alert on all open records requests so they never sit unmonitored again. What mechanism prevents this from happening again?', 'Blame the records team', 'Ask for more headcount'],
        correct: 1,
        explanation: 'Ownership: Present honest root cause (process gap, not people failure). Are Right, A Lot: Show the data and recovery. Mechanisms: Build the alert that ensures this never recurs. Leadership wants: What happened? What did you do? How do we prevent it?'
      }
    ]
  },
  {
    id: 'case-new-hire',
    title: 'Training Under Pressure',
    intro: 'You have a new hire starting Monday. Your team is short-staffed after two resignations. Leadership expects the new hire productive in 3 weeks instead of the usual 5. You\'re also responsible for your own queue. There is no formal training plan documented — previous training was "shadow someone for a week."',
    icon: '🎓',
    difficulty: 'journeyman',
    xpTotal: 60,
    steps: [
      {
        question: 'Step 1: You have 2 days before the new hire starts. What do you prepare? (Ownership)',
        answers: ['Nothing — just let them shadow you like before', 'Create a structured 3-week plan: Week 1 (observe + study SOPs + complete game training), Week 2 (handle simple claims with review), Week 3 (independent work with spot-checks). Document it so anyone could deliver it.', 'Ask your manager to delay the start date', 'Give them the SOP folder and wish them luck'],
        correct: 1,
        explanation: 'Ownership + Invent and Simplify: "Shadow someone" doesn\'t scale and leaves quality to chance. A documented plan means consistent outcomes regardless of WHO trains. 2 days is enough to outline the structure — it doesn\'t need to be perfect, it needs to exist.'
      },
      {
        question: 'Step 2: It\'s Day 3. The new hire is overwhelmed — too much information, can\'t remember the denial codes, and is afraid to ask questions. What do you do? (Earn Trust)',
        answers: ['Tell them to try harder', 'Normalize the overwhelm ("everyone feels this way at first"), reduce the scope for this week to 3 denial types only, and schedule 15-min daily check-ins where they can ask anything without judgment. Build psychological safety.', 'Reassign them to a different team', 'Give them more reading materials'],
        correct: 1,
        explanation: 'Earn Trust: Psychological safety accelerates learning. When people are afraid to ask, they make silent mistakes. Reduce scope (focus beats breadth early), check in daily (short and frequent > long and rare), and tell them explicitly: asking questions is the job right now.'
      },
      {
        question: 'Step 3: Week 3. The new hire is handling simple claims independently but made 2 errors yesterday. Leadership asks: "Are they going to make it?" How do you respond?',
        answers: ['Say "probably not" to lower expectations', 'Present data: "They resolved X claims correctly this week with 2 errors (Y% accuracy). Error types are [specific] and addressable with targeted coaching. Trajectory is positive. I recommend 1 more week of supported independence before full release." — be honest, specific, and forward-looking.', 'Say "absolutely" to protect them', 'Ask for 3 more weeks of training time'],
        correct: 1,
        explanation: 'Are Right, A Lot: Don\'t over-promise or under-promise. Use data. Earn Trust with leadership: be specific about WHERE they are, WHERE the gaps are, and WHAT you\'re doing about it. "Trajectory is positive" + specific plan = confidence without false promises.'
      }
    ]
  },
  {
    id: 'case-cross-site',
    title: 'The Cross-Location Gap',
    intro: 'You discover that Manila and Hyderabad are handling the same denial type differently. Manila resubmits with corrected info. Hyderabad submits formal appeals. Both get paid eventually, but appeals take 45 days longer on average. Neither team knows the other\'s approach.',
    icon: '🌐',
    difficulty: 'master',
    xpTotal: 75,
    steps: [
      {
        question: 'Step 1: You\'ve identified the variance. What\'s your first move? (Dive Deep)',
        answers: ['Tell Hyderabad they\'re wrong', 'Investigate WHY each site chose their approach — is Hyderabad appealing because they don\'t have access to correction tools? Is there a payer-specific reason? Understand before prescribing.', 'Report it to leadership immediately', 'Ignore it — both are getting paid'],
        correct: 1,
        explanation: 'Dive Deep: Don\'t assume. Maybe Hyderabad has a valid reason (different payer contract terms, different system access). Understand the context at BOTH sites before deciding which approach is correct. The faster method isn\'t always the right one for every situation.'
      },
      {
        question: 'Step 2: You learn that Hyderabad appeals because their system training didn\'t include the resubmission workflow — it\'s a knowledge gap, not a strategic choice. What do you do?',
        answers: ['Send them the SOP document', 'Organize a cross-site knowledge share: Manila demonstrates the resubmission workflow, Hyderabad learns the faster path. Document the standardized approach in a shared SOP. Both teams benefit — Manila learns from Hyderabad\'s appeal expertise too.', 'Escalate to their manager', 'Let it continue — they\'re getting paid either way'],
        correct: 1,
        explanation: 'Invent and Simplify + collaboration: A live knowledge share is more effective than sending documents. Make it bidirectional — Hyderabad likely has appeal expertise Manila can learn from. Then document the standard so future hires at both sites learn the right way.'
      },
      {
        question: 'Step 3: How do you ensure this variance doesn\'t creep back in 6 months? (Mechanisms)',
        answers: ['Hope the SOP is followed', 'Implement: (1) shared quality dashboard visible to both sites showing resubmission vs. appeal rates by denial type, (2) quarterly cross-site calibration sessions, (3) the game\'s collaboration logging to track ongoing knowledge sharing. Mechanisms, not memos.', 'Monthly email reminders', 'Have managers audit manually'],
        correct: 1,
        explanation: 'Mechanisms > memos. A visible dashboard creates social accountability. Calibration sessions force alignment. The game itself tracks whether collaboration is happening. None of these require YOU to personally monitor — they are self-sustaining systems.'
      }
    ]
  }
];

// ═══ WHAT WOULD YOU DO? (Best/Worst ranking) ═══
// Player sees a scenario and 4 options. Must pick the BEST and WORST response.
// Tests judgment and prioritization, not just right/wrong.

const WWYD_SCENARIOS = [
  {
    id: 'wwyd-system-down',
    scenario: 'It\'s Monday morning. The payment posting system crashes. 12 analysts are sitting idle. Your manager is in a meeting. IT says 2-hour ETA for fix.',
    options: [
      {label: 'Send everyone to lunch early', value: 'worst', explanation: 'Frugality violation: You\'re paying 12 people to eat. This wastes 24 labor hours.'},
      {label: 'Have analysts review their own QA feedback from last week and discuss improvement areas in pairs', value: 'best', explanation: 'Bias for Action + Develop the Best: Productive learning that requires no systems. Turns downtime into development time.'},
      {label: 'Tell everyone to just wait and refresh the system every 5 minutes', value: 'bad', explanation: 'Passive waiting = wasted capacity and frustrated team.'},
      {label: 'Send an email to IT asking for updates every 15 minutes', value: 'ok', explanation: 'Appropriate to stay informed, but doesn\'t solve the capacity problem.'}
    ],
    xp: 30
  },
  {
    id: 'wwyd-competing-priorities',
    scenario: 'You have 3 urgent tasks due today: (1) A $50K claim hitting timely filing deadline at 5pm, (2) Your manager asked for a report by 3pm, (3) A new hire needs help with their first denial. It\'s 1pm.',
    options: [
      {label: 'Work on the report first since your manager asked', value: 'ok', explanation: 'Manager asks are important but the $50K has a hard external deadline that causes permanent revenue loss if missed.'},
      {label: 'Handle the $50K timely filing claim first, then help the new hire for 10 minutes, then do the report — communicate the delay to your manager', value: 'best', explanation: 'Prioritize by irreversibility: Timely filing = permanent loss if missed (1-way door). Report can be 30 min late (2-way door). New hire needs 10 min, not an hour. Communicate proactively.'},
      {label: 'Help the new hire first because people come first', value: 'bad', explanation: 'People matter, but the new hire\'s question isn\'t time-critical. The $50K is. You can help them after securing the revenue.'},
      {label: 'Tell your manager you can\'t do the report today', value: 'worst', explanation: 'Giving up on a commitment without attempting to manage it shows lack of Ownership.'}
    ],
    xp: 30
  },
  {
    id: 'wwyd-quality-vs-speed',
    scenario: 'Leadership is pushing for higher volume targets this month. Your team is already at 95% quality. Hitting the new volume target would likely drop quality to 88%. A senior analyst says: "Just do more, they won\'t notice the quality drop."',
    options: [
      {label: 'Push for volume — leadership asked for it', value: 'bad', explanation: 'Short-term compliance, long-term damage. Quality drops create denials that cost MORE to rework than the volume gained.'},
      {label: 'Refuse the volume target entirely', value: 'worst', explanation: 'Refusing without proposing alternatives shows neither Ownership nor Bias for Action.'},
      {label: 'Present data to leadership: "We can hit X volume at 95% quality, or Y volume at 88% quality. Here\'s the rework cost of each percentage point lost. What\'s the right tradeoff?"', value: 'best', explanation: 'Have Backbone; Disagree and Commit: Present the tradeoff with data. Let leadership make an informed decision. You\'re not saying no — you\'re saying "here\'s what each choice costs."'},
      {label: 'Quietly keep quality standards and miss the volume target without telling anyone', value: 'ok', explanation: 'Protecting quality is right, but lack of transparency erodes trust with leadership.'}
    ],
    xp: 30
  },
  {
    id: 'wwyd-knowledge-hoarding',
    scenario: 'One analyst on your team is the only person who knows how to resolve a specific complex payer\'s denials. They\'ve been asked to document their process three times but never do. They say they\'re "too busy." Meanwhile, when they\'re out sick, those claims sit untouched.',
    options: [
      {label: 'Accept it — they\'re a high performer and you don\'t want to upset them', value: 'worst', explanation: 'This creates a single point of failure. When they leave (and everyone eventually does), the knowledge vanishes.'},
      {label: 'Schedule a recorded 30-min session where they walk through 2 live examples while someone takes notes. Convert into an SOP. Make it easy for them — don\'t ask them to write, ask them to SHOW.', value: 'best', explanation: 'Invent and Simplify: Remove the friction. They said they\'re too busy to WRITE — so don\'t ask them to write. Record them doing it. Convert to SOP after. Knowledge captured without burdening the expert.'},
      {label: 'Mandate documentation and set a deadline', value: 'ok', explanation: 'Directionally right but creates resistance. Making it easier to comply is better than making consequences for non-compliance.'},
      {label: 'Learn it yourself by shadowing them', value: 'bad', explanation: 'Solves for YOU but not for the team. Now two people know instead of one — still a fragile system.'}
    ],
    xp: 30
  },
  {
    id: 'wwyd-process-change',
    scenario: 'A major payer just changed their prior authorization requirements effective immediately. Claims submitted without the new auth are being denied. Your team submitted 45 claims this week before you found out. All will deny.',
    options: [
      {label: 'Wait for the denials to come back, then appeal each one', value: 'bad', explanation: 'Reactive and slow. Each appeal takes 45+ days. Proactive resubmission is faster.'},
      {label: 'Immediately halt submissions to this payer, obtain auths for the 45 pending claims retroactively where possible, alert the entire team to the change, and update the SOP today', value: 'best', explanation: 'Bias for Action: Stop the bleeding (halt). Recover what you can (retro auths). Prevent recurrence (team alert + SOP update). All three must happen simultaneously, not sequentially.'},
      {label: 'Email the team about the change and move on to other work', value: 'ok', explanation: 'Communication is right but insufficient without action on the 45 claims already at risk.'},
      {label: 'Blame the payer for not giving adequate notice', value: 'worst', explanation: 'May be true, but blaming doesn\'t recover revenue. Ownership means handling the situation regardless of whose fault it is.'}
    ],
    xp: 30
  }
];
