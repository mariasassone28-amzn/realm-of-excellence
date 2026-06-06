// Realm of Excellence - Game Data
const GAME_DATA = {
    houses: {
        'medical-coding': {
            name: 'Medical Coding', icon: '🦉', img: 'images/owlbanner.png', color: '#6b2fa0',
            stats: { wisdom: 3, precision: 2, speed: 0, tenacity: 0, empathy: 1 }
        },
        'charge-capture': {
            name: 'Charge Capture', icon: '🦅', img: 'images/notsurewhatbirdbanner.png', color: '#1e3a6e',
            stats: { wisdom: 1, precision: 2, speed: 3, tenacity: 0, empathy: 0 }
        },
        'collections': {
            name: 'Collections', icon: '🦁', img: 'images/lionbanner.png', color: '#b8860b',
            stats: { wisdom: 0, precision: 0, speed: 1, tenacity: 3, empathy: 2 }
        },
        'cash-application': {
            name: 'Cash Application', icon: '🐉', img: 'images/snakebanner.png', color: '#1a5c3a',
            stats: { wisdom: 1, precision: 3, speed: 0, tenacity: 2, empathy: 0 }
        },
        'patient-financial': {
            name: 'Patient Financial Services', icon: '🧸', img: 'images/bearbanner.png', iconHtml: '<span style="position:relative;display:inline-block;">🧸<span style="position:absolute;bottom:22%;left:50%;transform:translateX(-50%);font-size:0.35em;">❤️</span></span>', color: '#8b1a1a',
            stats: { wisdom: 2, precision: 0, speed: 0, tenacity: 0, empathy: 3 }
        }
    },

    ranks: [
        { level: 1, xpRequired: 0, title: 'Initiate' },
        { level: 2, xpRequired: 100, title: 'Apprentice I' },
        { level: 3, xpRequired: 300, title: 'Apprentice II' },
        { level: 4, xpRequired: 600, title: 'Apprentice III' },
        { level: 5, xpRequired: 1000, title: 'Adept I' },
        { level: 6, xpRequired: 2000, title: 'Adept II' },
        { level: 7, xpRequired: 3500, title: 'Adept III' },
        { level: 8, xpRequired: 5000, title: 'Expert I' },
        { level: 9, xpRequired: 7000, title: 'Expert II' },
        { level: 10, xpRequired: 10000, title: 'Master' },
        { level: 11, xpRequired: 15000, title: 'Grand Master' },
        { level: 12, xpRequired: 25000, title: 'Grandmaster' }
    ],

    // World Map Nodes — spread out for scrollable map
    mapNodes: [
        { id: 'training', name: 'Training Mesa', icon: '⛏️', x: 12, y: 82, completed: true,
          desc: 'Sharpen your skills with trivia and knowledge checks.', activities: ['trivia', 'rapid-fire'] },
        { id: 'audit', name: 'Audit Outpost', icon: '🏰', x: 28, y: 72, completed: true,
          desc: 'Test your auditing precision.', activities: ['match-pairs', 'trivia'] },
        { id: 'mentorship', name: 'Mentorship Keep', icon: '🏯', x: 22, y: 48,
          desc: 'Learn from the masters. Study SOPs and practice teaching.', activities: ['library', 'case-study', 'wwyd'] },
        { id: 'deepdive', name: 'Deep Dive Canyon', icon: '🌋', x: 48, y: 60,
          desc: 'Word scrambles and advanced scenario challenges.', activities: ['word-scramble', 'case-study', 'rapid-fire'] },
        { id: 'future', name: 'Future Outpost', icon: '🍰', x: 45, y: 30,
          desc: 'Coming soon...', activities: ['trivia'] },
        { id: 'coe', name: 'COE Citadel', icon: '🏰', x: 70, y: 20,
          desc: 'Center of Excellence. Master-level challenges and leadership scenarios.', activities: ['trivia-master', 'wwyd', 'case-study', 'exam-mode'] },
        { id: 'certification', name: 'Certification Peak', icon: '🏔️', x: 80, y: 50,
          desc: 'Prove your mastery at the summit. CRCR exam prep and train-the-trainer.', activities: ['exam-mode', 'case-study', 'wwyd'] }
    ],

    // Active quests shown in bottom strip
    activeQuests: [
        { id: 'aq-1', name: 'Weekly Mini-Quest', desc: 'Answer 3 Escalation Tickets', xp: 15, status: 'In Progress: 2/3', chibi: '📋' },
        { id: 'aq-2', name: 'Facilitation Quest', desc: 'Host Department Deep Dive (SLA Variance)', xp: 100, status: 'Awaiting Survey Verification', chibi: '🎤' },
        { id: 'aq-3', name: "Quality Challenge", desc: 'Audit 5 PFS Records', xp: 25, status: 'New', chibi: '🔍' },
        { id: 'aq-4', name: 'Close-the-Loop Deep Dive', desc: 'Participate in Calibration Session', xp: 200, status: '⭐ LEGENDARY', chibi: '🌟' },
        { id: 'aq-5', name: 'QA Weekly Business Review', desc: 'Submit WBR document to leadership', xp: 125, status: '⭐ LEGENDARY', chibi: '📊' }
    ],

    // Tasks with chibi images - includes the renamed Dipstick (Focus Targeted Remediation Audit Protocol)
    tasks: [
        {
            id: 'task-ftra',
            name: 'FOCUS Protocol',
            sop: 'CHB-TQ-SOP-2026-003.V1',
            description: 'Complete the FOCUS Targeted Remediation Audit Protocol. Assess knowledge gaps and document findings.',
            instructions: '1. Select 3-5 critical parameters to assess.\n2. Conduct round-robin knowledge check with each SME.\n3. Rate each: ✓ Current, ⚠ Needs Refresh, ✗ Gap Identified.\n4. Document findings in the FOCUS template.\n5. Submit completed audit via email with subject line: "FOCUS Complete - [Your Name] - [Date]".',
            verification: 'email',
            verifyLabel: 'Paste the email subject line or forward confirmation:',
            chibi: '🧙‍♂️',
            xp: 75,
            gold: 30,
            status: 'new',
            category: 'audit'
        },
        {
            id: 'task-deepdive',
            name: 'Host a Deep Dive Session',
            sop: null,
            description: 'Facilitate a department deep dive on SLA Variance or process improvement topic.',
            instructions: '1. Choose a topic (SLA Variance, denial trends, process gap).\n2. Prepare a 15-20 min presentation with data.\n3. Schedule and host the session with your team.\n4. Collect attendee feedback via survey.\n5. Submit proof: forward the calendar invite + survey link to your Guild Founder.',
            verification: 'email',
            verifyLabel: 'Paste the meeting invite link or forward confirmation email:',
            chibi: '🧝‍♀️',
            xp: 100,
            gold: 50,
            status: 'progress',
            category: 'facilitation'
        },
        {
            id: 'task-coaching',
            name: 'Coaching Session',
            sop: null,
            description: 'Complete a 1-on-1 coaching session with a junior analyst. Document outcomes.',
            instructions: '1. Identify a junior analyst who needs support.\n2. Schedule a 30-min 1-on-1 session.\n3. Focus on one specific skill or process gap.\n4. Document: topic covered, key takeaways, follow-up actions.\n5. Email summary to your Guild Founder with subject: "Coaching Complete - [Mentee Name]".',
            verification: 'email',
            verifyLabel: 'Paste the coaching summary email subject or confirmation:',
            chibi: '🧑‍🏫',
            xp: 50,
            gold: 20,
            status: 'new',
            category: 'mentorship'
        },
        {
            id: 'task-sop-draft',
            name: 'Draft an SOP',
            sop: null,
            description: 'Create or update an SOP using the official template. Submit for vetting.',
            instructions: '1. Use the official SOP template from OneSource.\n2. Draft the SOP with clear steps, definitions, and scope.\n3. Save to the shared guild repository.\n4. Notify the guild that it is ready for vetting.\n5. Email the document link to the Guild Founder with subject: "SOP Draft Ready - [SOP Title]".',
            verification: 'email',
            verifyLabel: 'Paste the SOP document link or email confirmation:',
            chibi: '📜',
            xp: 80,
            gold: 35,
            status: 'new',
            category: 'documentation'
        },
        {
            id: 'task-audit-claims',
            name: 'Audit 5 PFS Records',
            sop: null,
            description: 'Perform quality audit on 5 Patient Financial Services records. Document findings and error patterns.',
            instructions: '1. Pull 5 records from the PFS queue.\n2. Review each for insurance verification accuracy, prior auth compliance, and patient estimation.\n3. Document errors found (type, root cause, severity).\n4. Log results in the quality tracker.\n5. Email your findings summary with subject: "PFS Audit Complete - [5] Records - [Your Name]".',
            verification: 'email',
            verifyLabel: 'Paste the audit tracker link or email confirmation:',
            chibi: '🕵️',
            xp: 25,
            gold: 10,
            status: 'progress',
            category: 'audit'
        },
        {
            id: 'task-knowledge-share',
            name: 'Knowledge Share Presentation',
            sop: null,
            description: 'Present a 10-minute knowledge share at the bi-weekly guild meeting.',
            instructions: '1. Choose a topic: common error, process update, or best practice.\n2. Prepare 5-10 slides or a live demo.\n3. Present at the next bi-weekly guild meeting.\n4. Answer questions from the team.\n5. Share your slides via email with subject: "Knowledge Share - [Topic] - [Date]".',
            verification: 'email',
            verifyLabel: 'Paste the slide deck link or meeting confirmation:',
            chibi: '🧙‍♀️',
            xp: 60,
            gold: 25,
            status: 'new',
            category: 'facilitation'
        },
        {
            id: 'task-rca',
            name: 'Root Cause Analysis',
            sop: null,
            description: 'Conduct RCA on a recurring quality defect. Propose solution to guild.',
            instructions: '1. Identify a recurring defect from quality reports.\n2. Gather data: frequency, impacted accounts, error type.\n3. Apply 5-Whys or fishbone analysis.\n4. Draft a proposed solution with expected impact.\n5. Present findings to guild and email summary: "RCA Complete - [Defect Type] - [Your Name]".',
            verification: 'email',
            verifyLabel: 'Paste the RCA document link or email confirmation:',
            chibi: '🔬',
            xp: 90,
            gold: 40,
            status: 'new',
            category: 'quality'
        },
        {
            id: 'task-tutorial',
            name: 'Complete Training Module',
            sop: null,
            description: 'Finish one assigned training module and pass the assessment.',
            instructions: '1. Log into the training portal.\n2. Complete the assigned module (watch all videos, read materials).\n3. Take the end-of-module assessment.\n4. Score 80% or higher to pass.\n5. Screenshot your completion certificate and email: "Training Complete - [Module Name]".',
            verification: 'email',
            verifyLabel: 'Paste your completion certificate link or screenshot confirmation:',
            chibi: '📚',
            xp: 10,
            gold: 5,
            status: 'new',
            category: 'training'
        },
        {
            id: 'task-qa-wbr',
            name: 'QA Weekly Business Review',
            sop: null,
            description: 'Compile and submit the QA Weekly Business Review document to leadership.',
            instructions: '1. Pull quality scores from all RCM teams for the current week.\n2. Identify top defect categories and trending errors.\n3. Include week-over-week comparison (improvement or regression).\n4. Document action items from last WBR and current status.\n5. Format using the official WBR template.\n6. Submit to leadership before Friday EOD.\n7. Email confirmation with subject: "QA WBR - Week of [Date] - [Your Name]".\n\n⭐ BONUS: Timely submission (before Friday 3 PM) earns extra gold.',
            verification: 'email',
            verifyLabel: 'Paste the WBR email subject line or document link:',
            chibi: '📊',
            xp: 125,
            gold: 60,
            status: 'new',
            category: 'quality'
        }
    ],

    // Full quest board
    quests: [
        { id: 'q-trivia-daily', name: 'Daily Knowledge Check', description: 'Complete one trivia battle', xp: 15, type: 'daily', icon: '⚔️', instructions: 'Go to Training Mesa on the map and complete any trivia battle at any difficulty. Score at least 1 correct answer.' },
        { id: 'q-scramble', name: 'Word Smith', description: 'Unscramble 3 RCM terms', xp: 20, type: 'daily', icon: '🔤', instructions: 'Visit Deep Dive Canyon and play Word Scramble. Successfully unscramble at least 3 words in a single session.' },
        { id: 'q-rapid', name: 'Lightning Round', description: 'Score 7+ in Rapid Fire', xp: 25, type: 'daily', icon: '⚡', instructions: 'Play Rapid Fire from any location or monster encounter. Answer at least 7 out of 10 questions correctly.' },
        { id: 'q-weekly-trivia', name: 'Weekly Mini-Quest', description: 'Answer 3 Escalation Tickets', xp: 15, type: 'weekly', icon: '📋', instructions: 'In your real work queue, resolve 3 escalation tickets this week. Mark complete when done and email proof to your lead.' },
        { id: 'q-facilitation', name: 'Facilitation Quest', description: 'Host a Department Deep Dive', xp: 100, type: 'epic', icon: '🎤', instructions: 'Schedule and host a deep dive session for your department. Topic must be data-driven (SLA variance, denial trends, etc). Submit survey results as proof.' },
        { id: 'q-audit-5', name: 'Quality Challenge', description: 'Audit 5 PFS Records', xp: 25, type: 'weekly', icon: '🔍', instructions: 'Pull 5 records from the Patient Financial Services queue. Audit each against SOP standards for insurance verification, prior auth, and patient estimation accuracy. Document findings and email summary.' },
        { id: 'q-mentor', name: 'Mentorship Mission', description: 'Complete a coaching session', xp: 50, type: 'weekly', icon: '🏯', instructions: 'Schedule a 1-on-1 with a junior analyst. Cover one specific skill gap. Document the session outcomes and email to Guild Founder.' },
        { id: 'q-ftra', name: 'FOCUS Protocol', description: 'Complete FOCUS Targeted Remediation Audit (CHB-TQ-SOP-2026-003.V1)', xp: 75, type: 'epic', icon: '🧙‍♂️', instructions: 'Follow the full FOCUS protocol: select parameters, conduct round-robin assessment, rate SMEs, document gaps, and submit the completed audit form.' },
        { id: 'q-certification', name: 'Certification Climb', description: 'Pass Master trivia with 100%', xp: 75, type: 'epic', icon: '🏔️', instructions: 'Go to Certification Peak or COE Citadel. Complete a Master-level trivia battle with a perfect score (5/5 correct).' },
        { id: 'q-streak-3', name: 'Consistency Streak', description: 'Log in 3 days in a row', xp: 30, type: 'weekly', icon: '🔥', instructions: 'Open the Realm of Excellence on 3 consecutive days. Your streak counter in the profile tracks this automatically.' },
        { id: 'q-close-loop', name: 'Close-the-Loop Deep Dive', description: 'Participate in the Close-the-Loop Deep Dive & Calibration Session', xp: 200, type: 'legendary', icon: '🌟', instructions: 'Attend and actively participate in the Close-the-Loop Deep Dive and Calibration Session. This is a major guild event where findings from audits are reviewed, calibration is performed across teams, and action plans are finalized. Submit attendance confirmation and your calibration notes as proof.' },
        { id: 'q-calibration', name: 'Calibration Champion', description: 'Complete calibration scoring alignment exercise', xp: 150, type: 'legendary', icon: '⚖️', instructions: 'During the Calibration Session, independently score 5 sample cases. Compare your scores with the guild consensus. Achieve 90%+ alignment with the calibrated standard. Submit your scoring sheet as proof.' },
        { id: 'q-qa-wbr', name: 'QA Weekly Business Review', description: 'Submit the QA Weekly Business Review document', xp: 125, type: 'legendary', icon: '📊', instructions: 'Compile and submit the QA Weekly Business Review (WBR) document. This includes:\n1. Aggregate quality scores across all RCM teams for the week.\n2. Highlight top defect categories and trending error types.\n3. Include week-over-week comparison metrics.\n4. Document action items from previous WBR and their status.\n5. Submit the completed WBR to leadership with subject: "QA WBR - Week of [Date] - [Your Name]".\n\n⭐ BONUS: This is a high-impact deliverable. Extra XP awarded for timely submission (before Friday EOD).' }
    ],

    // Boss raid
    bossRaid: {
        name: 'THE DEFECT SURGE',
        maxHP: 100,
        currentHP: 75
    },

    // Trivia questions
    triviaQuestions: {
        apprentice: [
            { question: 'What does RCM stand for?', answers: ['Revenue Cycle Management', 'Resource Control Method', 'Regulatory Compliance Manual', 'Record Collection Module'], correct: 0 },
            { question: 'What is the Single Source of Truth (SSoT) for all official SOP content?', answers: ['SharePoint', 'OneSource', 'Amazon Approvals', 'Google Drive'], correct: 1 },
            { question: 'What system is used for formal approval hierarchy in the Guild?', answers: ['Slack', 'Email', 'Amazon Approvals', 'JIRA'], correct: 2 },
            { question: 'How often does the Guild hold its regular meetings?', answers: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'], correct: 1 },
            { question: 'What is the standard duration of a Guild meeting?', answers: ['15 minutes', '30 minutes', '45 minutes', '60 minutes'], correct: 1 },
            { question: 'Which guild value is NOT one of the five core values?', answers: ['Integrity', 'Speed', 'Empathy', 'Excellence'], correct: 1 },
            { question: 'What does SOP stand for?', answers: ['Standard Operating Procedure', 'System of Operations', 'Structured Operational Plan', 'Service Optimization Protocol'], correct: 0 },
            { question: 'Who serves as the primary liaison between the guild and senior leadership?', answers: ['Core Member', 'Contributing Member', 'Founder', 'CCB Chair'], correct: 2 }
        ],
        journeyman: [
            { question: 'What is the first step in the Guild Process lifecycle?', answers: ['Collaborative Drafting', 'Pre-Drafting Scoping', 'Initiation', 'Formal Approvals'], correct: 2 },
            { question: 'What triggers the automated notification to the relevant audience?', answers: ['Draft completion', 'Final approval', 'Guild meeting vote', 'Founder decision'], correct: 1 },
            { question: 'Which of these is OUT of scope for the Guild?', answers: ['SOP Documentation', 'Root Cause Analysis', 'IT System Administration', 'Training Materials'], correct: 2 },
            { question: 'What is the purpose of the Vetting Period?', answers: ['Performance review', 'Guild members review and provide feedback on drafts', 'Budget approval', 'System testing'], correct: 1 },
            { question: 'What does the Focus Targeted Remediation Audit assess?', answers: ['System performance', 'Budget compliance', 'Whether associates have up-to-date knowledge', 'Customer satisfaction'], correct: 2 },
            { question: 'What is the SOP number for the Focus Targeted Remediation Audit Protocol?', answers: ['CHB-TQ-SOP-2026-001', 'CHB-TQ-SOP-2026-003.V1', 'HFO-SOP-MNL-002', 'TQ-AUDIT-001'], correct: 1 },
            { question: 'What rating indicates a significant knowledge gap in a FOCUS audit?', answers: ['✓ Current', '⚠ Needs Refresh', '✗ Gap Identified', '⊘ Not Applicable'], correct: 2 },
            { question: 'Who is responsible for monitoring quality metrics post-implementation?', answers: ['IT Department', 'The Guild', 'External Auditors', 'HR'], correct: 1 }
        ],
        master: [
            { question: 'In the Guild Process, what happens immediately after Formal Approvals?', answers: ['Publication to SSoT', 'Automated Documentation Control', 'Training Roll-out', 'Implementation'], correct: 1 },
            { question: 'What is the target percentage for SMEs with current knowledge?', answers: ['75%+', '80%+', '85%+', '90%+'], correct: 3 },
            { question: 'What is the target timeframe to close knowledge gaps?', answers: ['<7 days', '<14 days', '<30 days', '<60 days'], correct: 2 },
            { question: 'Which body has Final Decision-Making Authority over SOPs?', answers: ['The Guild Founder', 'Core Members', 'CCB and senior leadership', 'Contributing Members'], correct: 2 },
            { question: 'What is the recommended rotation for multi-team FOCUS audits?', answers: ['One team per day', 'One team per week over 4 weeks', 'All teams same day', 'Random selection'], correct: 1 },
            { question: 'What document number format does the Guild SOP use?', answers: ['GUILD-001', 'HFO-SOP-MNL-002', 'RCM-DOC-001', 'AOM-SOP-001'], correct: 1 },
            { question: 'Core Members now serve as what additional role per v2.1?', answers: ['Project managers', 'Backup auditors', 'System administrators', 'Budget approvers'], correct: 1 },
            { question: 'What is the backup auditor availability requirement?', answers: ['Same day', '24-hour', '48-hour', '72-hour'], correct: 1 }
        ]
    },

    wordScramble: [
        { word: 'REVENUE', hint: '_____ Cycle Management' },
        { word: 'COMPLIANCE', hint: 'Following rules and regulations' },
        { word: 'MODIFIER', hint: 'Added to CPT codes for specificity' },
        { word: 'DENIAL', hint: 'When a claim is rejected' },
        { word: 'POSTING', hint: 'Recording payments to accounts' },
        { word: 'CODING', hint: 'Translating diagnoses to numbers' },
        { word: 'AUDIT', hint: 'Systematic review of records' },
        { word: 'BILLING', hint: 'Submitting claims for payment' },
        { word: 'COPAY', hint: 'Patient responsibility at visit' },
        { word: 'DEDUCTIBLE', hint: 'Amount paid before insurance kicks in' },
        { word: 'REMITTANCE', hint: 'Payment explanation from payer' },
        { word: 'REMEDIATION', hint: 'Corrective action for identified gaps' },
        { word: 'ADJUDICATION', hint: 'Payer decides how to process the claim' },
        { word: 'CLEARINGHOUSE', hint: 'Routes electronic claims to payers' },
        { word: 'ELIGIBILITY', hint: 'Is the patient covered?' },
        { word: 'COINSURANCE', hint: 'Patient percentage after deductible' },
        { word: 'AUTHORIZATION', hint: 'Prior approval for services' },
        { word: 'RECOUPMENT', hint: 'Payer takes back money previously paid' },
        { word: 'SCRUBBING', hint: 'Checking claims for errors before submission' },
        { word: 'ESCALATION', hint: 'Moving issue to higher authority' },
        { word: 'RESUBMISSION', hint: 'Sending corrected claim again' },
        { word: 'APPEAL', hint: 'Challenging a payer decision' },
        { word: 'CHARGEMASTER', hint: 'Master price list for all billable items' },
        { word: 'PREMIUM', hint: 'Monthly fee for insurance coverage' },
        { word: 'RECONCILIATION', hint: 'Matching payments to claims' },
        { word: 'CREDENTIAL', hint: 'Provider network enrollment status' },
        { word: 'PREREGISTRATION', hint: 'Collecting data before the visit' },
        { word: 'BENCHMARK', hint: 'Industry standard to measure against' }
    ],

    matchPairs: [
        { term: 'OneSource', definition: 'Single Source of Truth for SOPs' },
        { term: 'Amazon Approvals', definition: 'Formal approval workflow system' },
        { term: 'Vetting Period', definition: 'Time for guild feedback on drafts' },
        { term: 'Core Member', definition: 'Seasoned SME with deep knowledge' },
        { term: 'CCB', definition: 'Change Control Board' },
        { term: 'FOCUS', definition: 'FOCUS Targeted Remediation Audit Protocol' },
        { term: 'RCM', definition: 'Revenue Cycle Management' },
        { term: 'SOP', definition: 'Standard Operating Procedure' },
        { term: 'ERA', definition: 'Electronic Remittance Advice' },
        { term: 'EOB', definition: 'Explanation of Benefits' },
        { term: 'CARC', definition: 'Claim Adjustment Reason Code' },
        { term: 'RARC', definition: 'Remittance Advice Remark Code' },
        { term: 'PR', definition: 'Patient Responsibility (adjustment code)' },
        { term: 'CO', definition: 'Contractual Obligation (write-off)' },
        { term: 'VOB', definition: 'Verification of Benefits' },
        { term: 'AOB', definition: 'Assignment of Benefits (pay provider directly)' },
        { term: 'POS Collections', definition: 'Collecting payment while patient is present' },
        { term: 'Clean Claim', definition: 'Claim paid on first submission without errors' },
        { term: 'AR Aging', definition: 'How long claims sit unpaid' },
        { term: 'FCR', definition: 'First Contact Resolution' },
        { term: 'Timely Filing', definition: 'Deadline to submit a claim to a payer' },
        { term: 'Recoupment', definition: 'Payer takes back previously paid money' },
        { term: 'Chargemaster', definition: 'Comprehensive list of all billable items and prices' },
        { term: 'Scrubbing', definition: 'Automated error check before claim submission' }
    ],

    rapidFire: [
        { statement: 'The Guild meets weekly.', answer: false, explanation: 'The Guild meets bi-weekly.' },
        { statement: 'OneSource is the Single Source of Truth for SOPs.', answer: true, explanation: 'Correct!' },
        { statement: 'The Guild has final decision-making authority over SOPs.', answer: false, explanation: 'The CCB and senior leadership have final authority.' },
        { statement: 'Guild meetings are 30 minutes long.', answer: true, explanation: 'Correct!' },
        { statement: 'Core Members can handle individual performance reviews.', answer: false, explanation: 'Direct people management is out of scope.' },
        { statement: 'The Guild is responsible for IT system administration.', answer: false, explanation: 'IT/System Admin is out of scope.' },
        { statement: 'Amazon Approvals serves as the audit trail tool.', answer: true, explanation: 'Correct!' },
        { statement: 'Contributing Members lead guild initiatives.', answer: false, explanation: 'Core Members lead initiatives.' },
        { statement: 'The FOCUS Protocol target for SME knowledge is 90%+.', answer: true, explanation: 'Correct!' },
        { statement: 'Knowledge gaps should be closed within 60 days.', answer: false, explanation: 'Target is less than 30 days.' },
        { statement: 'The Guild Founder is the primary liaison to senior leadership.', answer: true, explanation: 'Correct!' },
        { statement: 'Root Cause Analysis is within the Guild scope.', answer: true, explanation: 'Correct!' },
        { statement: 'Core Members serve as backup auditors per v2.1.', answer: true, explanation: 'Correct!' },
        { statement: 'The FOCUS Protocol SOP number is CHB-TQ-SOP-2026-003.V1.', answer: true, explanation: 'Correct!' },
        { statement: 'A clean claim is one that requires manual edits before payment.', answer: false, explanation: 'A clean claim is paid on FIRST attempt WITHOUT edits.' },
        { statement: 'HIPAA allows sharing PHI for Treatment, Payment, and Operations (TPO).', answer: true, explanation: 'TPO is the core exception that allows RCM to function.' },
        { statement: 'Under FDCPA, you can call a patient about a debt at 10 PM.', answer: false, explanation: 'FDCPA restricts calls to between 8 AM and 9 PM.' },
        { statement: 'The Allowed Amount is always equal to the Billed Amount.', answer: false, explanation: 'Allowed Amount is usually LESS than Billed (per contract). The difference is the contractual write-off.' },
        { statement: 'PR adjustment code means the provider is responsible.', answer: false, explanation: 'PR = Patient Responsibility, not provider.' },
        { statement: 'A HIPAA breach must be reported within 60 days.', answer: true, explanation: 'Affected individuals must be notified within 60 days of discovering a breach.' },
        { statement: 'CMS-1500 is used for institutional (hospital) claims.', answer: false, explanation: 'CMS-1500 is for professional claims. UB-04 is for institutional.' },
        { statement: 'Coinsurance is the patient percentage share after the deductible is met.', answer: true, explanation: 'Correct! Usually 20% patient / 80% insurance.' },
        { statement: 'A missing charge means revenue is permanently lost.', answer: true, explanation: 'If a service is never documented, it can never be billed. Permanent leakage.' },
        { statement: 'AR aging of 90+ days is considered healthy.', answer: false, explanation: '90+ days is critical. Industry benchmark is 35-45 days.' },
        { statement: 'Payer adjudication is when the patient pays their bill.', answer: false, explanation: 'Adjudication is when the INSURANCE processes and decides payment.' },
        { statement: 'Pre-Service errors compound into Post-Service denials.', answer: true, explanation: 'A typo at registration creates a denial at adjudication.' },
        { statement: 'The Minimum Necessary Standard means using the cheapest treatment.', answer: false, explanation: 'It means accessing only the minimum PHI needed for your specific job task.' },
        { statement: 'An appeal is used when WE made an error on the claim.', answer: false, explanation: 'Appeals challenge the PAYER decision. Resubmissions correct OUR errors.' },
        { statement: 'Collections Yield measures total collected divided by total billed.', answer: true, explanation: 'Correct! Higher yield = better revenue recovery.' },
        { statement: 'First Contact Resolution means resolving a patient issue on the first interaction.', answer: true, explanation: 'Correct! FCR reduces callbacks and improves patient satisfaction.' }
    ],

    shopItems: [
        { id: 'badge-bronze', name: 'Bronze Guild Badge', icon: '🥉', description: 'Show your guild membership', cost: 50 },
        { id: 'badge-silver', name: 'Silver Guild Badge', icon: '🥈', description: 'Recognized contributor', cost: 150 },
        { id: 'badge-gold', name: 'Gold Guild Badge', icon: '🥇', description: 'Elite guild member', cost: 300 },
        { id: 'title-mentor', name: 'Mentor Title', icon: '🎓', description: 'Unlock "Mentor" display title', cost: 200 },
        { id: 'title-champion', name: 'Champion Title', icon: '🏆', description: 'Unlock "Champion" display title', cost: 500 },
        { id: 'frame-crown', name: 'Crown Avatar Frame', icon: '👑', description: 'Golden crown frame for avatar', cost: 400 },
        { id: 'xp-boost', name: 'XP Boost (1 day)', icon: '⚡', description: '2x XP for 24 hours', cost: 100 }
    ],

    // Skill Training Mode — Function-specific tracks aligned with HFO SME Development Program 2.0
    skillTraining: {
        // ═══ CROSS-FUNCTIONAL (All teams) ═══
        shared: {
            title: 'Core SME Skills',
            description: 'Foundation skills required for all RCM functions.',
            modules: [
                { id: 'sk-empathy', name: 'Building Empathy', description: 'Developing a patient-centered mindset in RCM work.', xp: 20, type: 'e-learning', duration: '1 hour' },
                { id: 'sk-time', name: 'Time Management & Time Boxing', description: 'Managing high-volume queues effectively under deadline pressure.', xp: 20, type: 'e-learning', duration: '1 hour' },
                { id: 'sk-hipaa', name: 'HIPAA & PHI Awareness', description: 'Secure handling of Protected Health Information in daily RCM work.', xp: 20, type: 'e-learning', duration: '1 hour' },
                { id: 'sk-teamwork', name: 'Teamwork & Collaboration', description: 'Cross-functional coordination across all RCM teams.', xp: 20, type: 'e-learning', duration: '1 hour' },
                { id: 'sk-pressure', name: 'Thriving Under Pressure', description: 'Building resilience during payer deadlines and high-volume periods.', xp: 15, type: 'e-learning', duration: 'Wiki-based' },
                { id: 'sk-rca', name: 'Think Big, Invent & Simplify', description: 'Root cause analysis, SIPOC diagrams, and process mapping for RCM workflows.', xp: 50, type: 'ilt', duration: '3 hours' },
                { id: 'sk-compliance', name: 'RCM Controllership & Compliance', description: 'HIPAA, PCI DSS, and FDCPA requirements applied to daily RCM operations.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-automation', name: 'Automation in RCM', description: 'Identifying automation opportunities and building business cases for investment.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-teems', name: 'T.E.E.M.S Stakeholder Management', description: 'Stakeholder communication, payer escalations, and cross-site collaboration.', xp: 50, type: 'ilt', duration: '3 hours' },
                { id: 'sk-facilitation', name: 'Leading Effective Meetings', description: 'Running huddles, calibration sessions, and business reviews with confidence.', xp: 60, type: 'ilt', duration: '4 hours' },
                { id: 'sk-metrics', name: 'Revenue Cycle Metrics & Reporting', description: 'Interpreting dashboards and translating data into actionable insights.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-sipoc', name: 'SIPOC & Problem Statement (Assignment)', description: 'Develop a SIPOC diagram and structured problem statement for a real RCM challenge.', xp: 75, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your SIPOC submission link or email confirmation:' }
            ]
        },

        // ═══ COLLECTIONS ═══
        'collections': {
            title: 'Collections Mastery',
            description: 'Note standardization, process SOPs, and denial resolution for the Collections function.',
            modules: [
                { id: 'sk-col-notes', name: '8-Field Pipe-Delimited Note Syntax', description: 'Master the Collections documentation standard:\n[STATUS] | [DENIAL CODE] | [PAYER CODE] | [RESEARCH] | [ACTION] | REF: | [TAG] | FU:', xp: 60, type: 'ilt', duration: '2 hours', verification: 'email', verifyLabel: 'Paste your note syntax assessment score or email confirmation:' },
                { id: 'sk-col-sop01', name: 'SOP 01: Eligibility & Coverage Denials', description: 'Verifying active coverage, enrollment status, and benefit eligibility at time of service.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop02', name: 'SOP 02: Medical Necessity & Chart Reviews', description: 'Documenting clinical justification and chart review outcomes for payer requirements.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop03', name: 'SOP 03: Coding, Modifiers & Bundling', description: 'Addressing coding disputes, modifier usage, and bundling/unbundling issues.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop04', name: 'SOP 04: Out of Network & Credentialing', description: 'Managing OON claims and provider credentialing-related denials.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop05', name: 'SOP 05: Medical Records Requests', description: 'Fulfilling payer requests for clinical documentation and records.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop06', name: 'SOP 06: Payment Postings & Recoupments', description: 'Reconciling posted payments, identifying recoupments, and correcting misapplications.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop07', name: 'SOP 07: Reversals', description: 'Processing and documenting claim reversals with proper authorization.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop08', name: 'SOP 08: Appeals & Escalation', description: 'Structuring and submitting formal payer appeals; escalation protocols.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop09', name: 'SOP 09: Timely Filing Risk', description: 'Identifying claims approaching filing deadlines; maintaining timely filing evidence.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop10', name: 'SOP 10: Claim Status & Pending', description: 'Following up on pending claims, verifying payer receipt, and documenting status.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-sop11', name: 'SOP 11: Unbillable, Write-Off & Refunds', description: 'Processing write-offs per OM.BIL.POL.020 approval requirements.', xp: 25, type: 'sop-study', duration: '30 min' },
                { id: 'sk-col-writeoff', name: 'OM.BIL.POL.020 Write-Off Documentation', description: 'Write-offs >$40 require L6 approval; >$500 require L7 approval plus payer outreach documentation.', xp: 40, type: 'ilt', duration: '1 hour' },
                { id: 'sk-col-sop-project', name: 'SOP Excellence Project (Collections)', description: 'Draft or revise a process-specific SOP using the 8-field note template, including research steps, tagging values, and critical failure risks.', xp: 80, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your SOP draft link or submission email:' }
            ]
        },

        // ═══ CASH APPLICATION ═══
        'cash-application': {
            title: 'Cash Application Mastery',
            description: 'Payment posting precision, ERA reconciliation, and financial accuracy for Cash Application.',
            modules: [
                { id: 'sk-ca-posting', name: 'Payment Posting Standards', description: 'Posting payments accurately to the correct patient accounts with zero misapplication.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-ca-notes', name: 'Legacy Notes Process (Cash App)', description: 'Documenting payment posting actions, adjustments, and research using the legacy freeform notes process per team standards.', xp: 25, type: 'sop-study', duration: '45 min' },
                { id: 'sk-ca-era', name: 'ERA/EOB Reconciliation', description: 'Matching Electronic Remittance Advice to posted payments and resolving discrepancies.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-ca-recoup', name: 'Recoupment Identification & Correction', description: 'Identifying payer recoupments, documenting justification, and correcting misapplied takeback amounts.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-ca-unapplied', name: 'Unapplied Payment Resolution', description: 'Researching and resolving payments that cannot be matched to a specific claim or patient.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-ca-denials', name: 'Denial & Adjustment Codes', description: 'Interpreting CARC/RARC codes and applying correct adjustment reason codes during posting.', xp: 30, type: 'sop-study', duration: '45 min' },
                { id: 'sk-ca-bank', name: 'Bank Reconciliation Processes', description: 'Reconciling posted payments against bank deposit records to ensure financial integrity.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-ca-safe', name: 'S.A.F.E. SOP Authoring Format', description: 'Writing and maintaining SOPs using the S.A.F.E. structure with Amazon Approvals routing. (This is for SOP documents, not daily notes.)', xp: 30, type: 'ilt', duration: '1 hour' },
                { id: 'sk-ca-sop-project', name: 'SOP Excellence Project (Cash App)', description: 'Draft or revise a Cash Application SOP using S.A.F.E. format. Route through Amazon Approvals workflow.', xp: 80, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your SOP draft link or submission email:' },
                { id: 'sk-ca-deepdive', name: 'RCM Data Deep Dive (Cash App)', description: 'Create a structured report analyzing payment posting accuracy, unapplied trends, or recoupment patterns over a defined period.', xp: 75, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your report link or submission email:' }
            ]
        },

        // ═══ CHARGE CAPTURE ═══
        'charge-capture': {
            title: 'Charge Capture Mastery',
            description: 'Charge timing, modifier compliance, and reconciliation for the Charge Capture function.',
            modules: [
                { id: 'sk-cc-timing', name: 'Charge Capture Timing & Deadlines', description: 'Understanding standard timeframes for charge capture and exceptions to timing rules.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-cc-notes', name: 'Legacy Notes Process (Charge Capture)', description: 'Documenting charge capture actions, exceptions, and reconciliation findings using the legacy freeform notes process per team standards.', xp: 25, type: 'sop-study', duration: '45 min' },
                { id: 'sk-cc-modifiers', name: 'Modifier Usage & Compliance', description: 'When specific modifiers are required, compliance implications of incorrect usage, and recent changes.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-cc-recon', name: 'Charge Reconciliation', description: 'Reconciling charges against encounters, identifying discrepancies that require escalation.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-cc-denial', name: 'Denial Prevention in Charge Capture', description: 'Top reasons for charge denials, prevention strategies, and pre-submission checks.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-cc-docs', name: 'Documentation Requirements', description: 'Required documentation before submitting a charge and verification of completeness.', xp: 30, type: 'sop-study', duration: '45 min' },
                { id: 'sk-cc-safe', name: 'S.A.F.E. SOP Authoring Format', description: 'Writing and maintaining SOPs using the S.A.F.E. structure with Amazon Approvals routing. (This is for SOP documents, not daily notes.)', xp: 30, type: 'ilt', duration: '1 hour' },
                { id: 'sk-cc-sop-project', name: 'SOP Excellence Project (Charge Capture)', description: 'Draft or revise a Charge Capture SOP using S.A.F.E. format. Route through Amazon Approvals workflow.', xp: 80, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your SOP draft link or submission email:' },
                { id: 'sk-cc-automation', name: 'Automation Pitch (Charge Capture)', description: 'Identify a charge capture process suitable for automation. Submit a proposal with current-state, proposed solution, and expected impact.', xp: 75, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your automation pitch link or submission email:' }
            ]
        },

        // ═══ MEDICAL CODING (CHB) ═══
        'medical-coding': {
            title: 'Medical Coding Mastery',
            description: 'CPT/ICD-10 accuracy, modifier application, and coding compliance for CHB Coding.',
            modules: [
                { id: 'sk-mc-cpt', name: 'CPT/ICD-10 Coding Accuracy', description: 'Translating diagnoses and procedures into correct codes with precision and compliance.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-mc-notes', name: 'Legacy Notes Process (Coding)', description: 'Documenting coding decisions, query responses, and chart review findings using the legacy freeform notes process per team standards.', xp: 25, type: 'sop-study', duration: '45 min' },
                { id: 'sk-mc-modifiers', name: 'Modifier Application', description: 'Correct modifier usage for specificity, compliance implications, and common errors.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-mc-bundling', name: 'Bundling & Unbundling Rules', description: 'Understanding when codes should be bundled or reported separately per payer guidelines.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-mc-medical-necessity', name: 'Medical Necessity Documentation', description: 'Ensuring clinical justification supports the codes assigned; chart review best practices.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-mc-denials', name: 'Coding Denial Resolution', description: 'Analyzing coding-related denials, identifying root causes, and implementing corrections.', xp: 30, type: 'sop-study', duration: '45 min' },
                { id: 'sk-mc-safe', name: 'S.A.F.E. SOP Authoring Format', description: 'Writing and maintaining SOPs using the S.A.F.E. structure with Amazon Approvals routing. (This is for SOP documents, not daily notes.)', xp: 30, type: 'ilt', duration: '1 hour' },
                { id: 'sk-mc-sop-project', name: 'SOP Excellence Project (Coding)', description: 'Draft or revise a Coding SOP using S.A.F.E. format. Route through Amazon Approvals workflow.', xp: 80, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your SOP draft link or submission email:' },
                { id: 'sk-mc-deepdive', name: 'RCM Data Deep Dive (Coding)', description: 'Create a structured report analyzing coding denial trends, modifier error patterns, or bundling issues over a defined period.', xp: 75, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your report link or submission email:' }
            ]
        },

        // ═══ PATIENT FINANCIAL SERVICES ═══
        'patient-financial': {
            title: 'Patient Financial Services Mastery',
            description: 'Insurance verification, prior authorization, patient estimation, and compassionate financial counseling.',
            modules: [
                { id: 'sk-pfs-insurance', name: 'Insurance Verification Procedures', description: 'Verifying active coverage, plan details, and benefit eligibility before and after service delivery.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-pfs-notes', name: 'Legacy Notes Process (PFS)', description: 'Documenting patient interactions, verification outcomes, and financial counseling using the legacy freeform notes process per team standards.', xp: 25, type: 'sop-study', duration: '45 min' },
                { id: 'sk-pfs-priorauth', name: 'Prior Authorization Requirements', description: 'Identifying services requiring prior auth, submitting requests, and tracking approvals.', xp: 40, type: 'ilt', duration: '2 hours' },
                { id: 'sk-pfs-estimation', name: 'Patient Estimation Accuracy', description: 'Calculating patient responsibility estimates using benefit details, contracted rates, and deductible status.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-pfs-copay', name: 'Co-pay & Deductible Calculations', description: 'Accurately determining co-pay amounts and deductible application for patient-facing communications.', xp: 30, type: 'sop-study', duration: '45 min' },
                { id: 'sk-pfs-counseling', name: 'Financial Counseling Protocols', description: 'Guiding patients through their financial options with empathy, clarity, and compliance.', xp: 35, type: 'sop-study', duration: '1 hour' },
                { id: 'sk-pfs-assistance', name: 'Financial Assistance Screening', description: 'Identifying patients eligible for financial assistance programs and guiding them through the application process.', xp: 30, type: 'sop-study', duration: '45 min' },
                { id: 'sk-pfs-safe', name: 'S.A.F.E. SOP Authoring Format', description: 'Writing and maintaining SOPs using the S.A.F.E. structure with Amazon Approvals routing. (This is for SOP documents, not daily notes.)', xp: 30, type: 'ilt', duration: '1 hour' },
                { id: 'sk-pfs-sop-project', name: 'SOP Excellence Project (PFS)', description: 'Draft or revise a Patient Financial Services SOP using S.A.F.E. format. Route through Amazon Approvals workflow.', xp: 80, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your SOP draft link or submission email:' },
                { id: 'sk-pfs-writing', name: 'Business Writing (PFS)', description: 'Produce a polished one-pager: patient communication template, financial assistance FAQ, or process update memo for your team.', xp: 75, type: 'assignment', duration: '4 hours', verification: 'email', verifyLabel: 'Paste your document link or submission email:' }
            ]
        }
    },

    // Team Points — each faction accumulates points from all members
    teamPoints: {
        'medical-coding': { points: 3420, members: 8, motto: 'We translate care into clarity.\nWe code the story of healing.', bannerColor: 'purple' },
        'charge-capture': { points: 2980, members: 6, motto: 'We capture today\nso care can continue.', bannerColor: 'blue' },
        'collections': { points: 3150, members: 7, motto: 'We follow through with purpose.\nWe recover today to protect tomorrow.', bannerColor: 'gold' },
        'cash-application': { points: 2650, members: 5, motto: 'We post with precision.\nWe power the mission.', bannerColor: 'green' },
        'patient-financial': { points: 2890, members: 7, motto: 'We support every patient journey\nwith care, clarity, and compassion.', bannerColor: 'red' }
    },

    // Leaderboard NPC data (simulated guild members)
    leaderboard: [
        { name: 'Aria Codewise', house: 'medical-coding', xp: 8750, rank: 'Expert II', title: 'The Owl Sage' },
        { name: 'Marcus Ledger', house: 'cash-application', xp: 6200, rank: 'Expert I', title: 'Dragon Keeper' },
        { name: 'Elena Recover', house: 'collections', xp: 5100, rank: 'Expert I', title: 'Lion Heart' },
        { name: 'Kai Chargewell', house: 'charge-capture', xp: 4300, rank: 'Adept III', title: 'Swift Griffin' },
        { name: 'Luna Carepath', house: 'patient-financial', xp: 3800, rank: 'Adept III', title: 'Bear Guardian' },
        { name: 'Vince Auditore', house: 'collections', xp: 3200, rank: 'Adept II', title: 'Quality Knight' },
        { name: 'Priya Docscribe', house: 'medical-coding', xp: 2800, rank: 'Adept II', title: 'Codex Scholar' },
        { name: 'Jordan Claimwell', house: 'charge-capture', xp: 2100, rank: 'Adept I', title: 'Charge Runner' },
        { name: 'Sam Patientfirst', house: 'patient-financial', xp: 1500, rank: 'Apprentice III', title: 'Compassion Acolyte' },
        { name: 'Riley Cashpost', house: 'cash-application', xp: 900, rank: 'Apprentice II', title: 'Coin Apprentice' }
    ]
};
