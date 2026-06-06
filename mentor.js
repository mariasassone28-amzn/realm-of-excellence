// ═══ ARCHON MERITUS — The Guild Mentor ═══
// A persistent guide character who appears throughout the game,
// providing wisdom, encouragement, and contextual teaching.

const MENTOR = {
    name: 'Archon Meritus',
    icon: '🧙‍♂️',
    img: 'images/lookslikeasamurai.png',
    title: 'Guild Sage & First Mentor',
    color: '#c9a84c',

    // ─── GREETINGS (shown on first login, after leveling, randomly) ───
    greetings: [
        "Welcome back, adventurer. The guild grows stronger with each mind that sharpens itself here.",
        "Ah, you return. Good. Consistency is the quiet weapon that defeats even the mightiest defects.",
        "The Revenue Cycle awaits. Every question you answer here saves a real patient from confusion tomorrow.",
        "I see your error bank has items in it. That is not weakness — it is self-awareness. Shall we review?",
        "Another day, another chance to close the gap between what you know and what the work demands."
    ],

    // ─── BEFORE CHALLENGES (contextual by type) ───
    beforeChallenge: {
        trivia: {
            apprentice: "Let us begin with the foundations. Every master coder, every expert collector, started exactly where you stand now. The 12 steps of the Revenue Cycle — these are your first runes to learn.",
            journeyman: "You have learned the words. Now let us test if you understand their meaning. An EOB is not just a document — it is a story. Can you read between the lines?",
            master: "The surface-level questions are behind you. Now we deal in strategy. Root cause. Resolution paths. The thinking that separates an analyst from a leader."
        },
        'case-study': "A real scenario unfolds before you. There is no single right answer in isolation — each decision creates the next. Think three steps ahead, as the guild teaches.",
        'wwyd': "Leadership is not a title. It is a series of judgment calls made under pressure. I present you with situations where reasonable people might disagree. Show me your reasoning.",
        'rapid-fire': "Speed and accuracy together — that is the mark of fluency. You should not need to think about whether the guild meets weekly or bi-weekly. It should be instinct.",
        'word-scramble': "The language of our craft matters. When you can speak in RCM without hesitation — claim, denial, adjudication, recoupment — you earn the trust of those you teach.",
        'match-pairs': "Connections. Relationships. Understanding how one concept links to another is what separates rote memory from true comprehension.",
        'exam-mode': "This is as close to the real certification as we can simulate here. Treat it with the weight it deserves. No explanations during the test — just you and your knowledge.",
        'error-review': "You chose to return and face what once defeated you. That single choice — the willingness to confront weakness — is rarer and more valuable than you know.",
        'boss-raid': "The Defect Surge threatens us all. But a guild united cannot be broken. Every correct answer you give strikes a blow for quality, for accuracy, for the patients who depend on us."
    },

    // ─── AFTER CHALLENGES (by performance) ───
    afterChallenge: {
        perfect: [
            "Flawless. Not because you memorized — but because you understood. That is the difference between knowledge and wisdom.",
            "I have nothing more to teach you on this topic. You are ready to teach others. And that, adventurer, is the highest honor the guild bestows.",
            "Perfect marks. But remember — the real test is not here. It is tomorrow morning, when a real claim lands in your queue. Carry this confidence with you."
        ],
        good: [
            "Strong showing. The foundation is solid. The gaps that remain? They are not walls — they are doors waiting to be opened.",
            "You are close to mastery. The questions you missed are not random — they reveal exactly where to focus next. Use that information.",
            "Well done. Now ask yourself: could you explain the ones you got wrong to a new hire? If not, that is your next step."
        ],
        needsWork: [
            "Do not be discouraged. I have watched many analysts in this guild — the ones who succeed are not the ones who score highest on day one. They are the ones who come back.",
            "Every item you got wrong is a gift — it shows you precisely where to invest your study time. Wandering without direction is harder than having a clear target.",
            "The guild does not demand perfection on the first attempt. It demands persistence. Return tomorrow. Return next week. The knowledge will come."
        ]
    },

    // ─── MILESTONE MOMENTS ───
    onLevelUp: [
        "A new rank. You have earned this through action, not luck. The guild sees you.",
        "Higher ground brings wider perspective. From here, you can see connections that were invisible before.",
        "Rank alone means nothing — but the journey that earned it? That changes who you are."
    ],

    onFirstPerfect: "Your first perfect score. Remember this moment — not for pride, but as proof that mastery is real and achievable. You have done it once. You will do it again.",

    onStreakMilestone: "Consistency compounds. Every day you return, the knowledge deepens, the reflexes sharpen. This streak is not just a number — it is a habit that will serve you for your entire career.",

    onErrorBankCleared: "Every error mastered. Every gap closed. You began with uncertainty and ended with clarity. This is the guild's promise fulfilled: we turn stumbling blocks into stepping stones.",

    onCRCRPass: "You passed the practice exam. This is significant — not because a screen said so, but because the knowledge required to pass is the same knowledge required to do this work with excellence. You are ready.",

    // ─── CONTEXTUAL TIPS (shown randomly during gameplay) ───
    tips: [
        "Tip from Meritus: When you see a denial code you don't recognize, don't skip it — look it up. Each new code learned is one fewer surprise in your queue.",
        "Tip from Meritus: The best analysts I have trained share one trait: they ask 'why' one more time than everyone else.",
        "Tip from Meritus: Cross-team collaboration is not extra credit. It is how you learn the full picture. A coder who understands collections resolves denials faster.",
        "Tip from Meritus: Your notes are your reputation. Six months from now, someone will read what you wrote today. Make it clear enough for a stranger to follow.",
        "Tip from Meritus: When the system goes down, the unprepared wait. The prepared use the time to study, to teach, to review. Never waste idle time.",
        "Tip from Meritus: If a process feels broken, it probably is. Document what is wrong, quantify the impact, and propose the fix. That is how analysts become leaders.",
        "Tip from Meritus: The patient on the other end of every claim does not know your name. But they will feel the quality of your work in every bill they receive."
    ],

    // Helper: get a random item from an array
    random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // Helper: get contextual message
    getGreeting() { return this.random(this.greetings); },
    getBeforeMessage(type, difficulty) {
        const msg = this.beforeChallenge[type];
        if (typeof msg === 'object' && difficulty) return msg[difficulty] || msg.apprentice || '';
        return msg || '';
    },
    getAfterMessage(score, total) {
        const pct = total > 0 ? score / total : 0;
        if (pct === 1) return this.random(this.afterChallenge.perfect);
        if (pct >= 0.6) return this.random(this.afterChallenge.good);
        return this.random(this.afterChallenge.needsWork);
    },
    getLevelUpMessage() { return this.random(this.onLevelUp); },
    getTip() { return this.random(this.tips); }
};
