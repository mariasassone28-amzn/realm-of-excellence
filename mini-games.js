// Realm of Excellence - Mini Games Engine
class MiniGames {
    constructor(engine) { this.engine = engine; }

    // ===== TRIVIA =====
    startTrivia(container, difficulty, onComplete) {
        // Merge base questions with expanded + scenario + trainer content
        let allQuestions = [...GAME_DATA.triviaQuestions[difficulty]];
        if (typeof EXPANDED_TRIVIA !== 'undefined' && EXPANDED_TRIVIA[difficulty]) {
            allQuestions = [...allQuestions, ...EXPANDED_TRIVIA[difficulty]];
        }
        if (typeof SCENARIO_TRIVIA !== 'undefined' && SCENARIO_TRIVIA[difficulty]) {
            allQuestions = [...allQuestions, ...SCENARIO_TRIVIA[difficulty]];
        }
        if (typeof TRAINER_SCENARIOS !== 'undefined' && TRAINER_SCENARIOS[difficulty]) {
            allQuestions = [...allQuestions, ...TRAINER_SCENARIOS[difficulty]];
        }
        // Remove duplicates by question text
        const seen = new Set();
        allQuestions = allQuestions.filter(q => {
            if (seen.has(q.question)) return false;
            seen.add(q.question);
            return true;
        });

        const questions = this.shuffle(allQuestions).slice(0, 5);
        const xpPer = difficulty === 'apprentice' ? 10 : difficulty === 'journeyman' ? 25 : 50;
        const baseTime = difficulty === 'apprentice' ? 30 : difficulty === 'journeyman' ? 25 : 20;
        const timeBonus = this.engine.getTriviaTimeBonus();
        const timePer = baseTime + timeBonus;
        let state = { questions, current: 0, score: 0, xpPer, timePer, timer: null, difficulty };

        // Story intro before challenge
        const storyIntros = {
            apprentice: "You enter the Guild Hall for the first time. The Revenue Cycle stretches before you like an ancient map — 12 steps from check-in to final payment. Each step is a link in a chain. Master the basics, and you hold the key to keeping care flowing.",
            journeyman: "The EOB arrives — a cryptic scroll from the payer. Numbers, codes, adjustments. To the untrained eye, it's noise. But to you, it tells a story: what was billed, what was allowed, what was paid, and why. Decode it correctly, and you unlock the path to resolution.",
            master: "A complex denial lands in your queue. The surface says 'not covered.' But you know better. You dive deep — pulling the patient record, the original claim, the payer policy. The root cause reveals itself. This is where analysts become strategists."
        };

        // Show story intro with Archon Meritus
        const mentorMsg = typeof MENTOR !== 'undefined' ? MENTOR.getBeforeMessage('trivia', difficulty) : storyIntros[difficulty];
        const mentorName = typeof MENTOR !== 'undefined' ? MENTOR.name : '';
        const mentorIconDisplay = typeof MENTOR !== 'undefined' ? MENTOR.icon : '📜';
        container.innerHTML = `
            <div style="text-align:center;padding:1.5rem;">
                <div style="font-size:3rem;margin-bottom:0.3rem;">${mentorIconDisplay}</div>
                <div style="font-family:'Cinzel',serif;font-size:0.75rem;color:var(--gold-dark);margin:0.5rem 0;">${mentorName}</div>
                <p style="color:var(--text-light);font-size:0.9rem;line-height:1.7;max-width:500px;margin:0 auto 1.5rem;font-style:italic;padding:1rem;background:rgba(0,0,0,0.15);border-radius:10px;border-left:3px solid var(--gold-dark);">"${mentorMsg}"</p>
                <button class="btn-guild" id="btn-start-challenge">Begin Challenge</button>
            </div>
        `;

        document.getElementById('btn-start-challenge').addEventListener('click', () => {
            render();
        });

        const render = () => {
            if (state.current >= state.questions.length) { end(); return; }
            const q = state.questions[state.current];
            let timeLeft = state.timePer;

            container.innerHTML = `
                <div class="trivia-hud">
                    <span>Q${state.current + 1}/${state.questions.length}</span>
                    <span class="timer" id="t-timer">⏱️ ${timeLeft}s</span>
                    <span class="score">Score: ${state.score}</span>
                </div>
                <div class="trivia-q">${q.question}</div>
                <div class="trivia-options">${q.answers.map((a, i) => `<button class="trivia-opt" data-i="${i}">${a}</button>`).join('')}</div>
                <div class="trivia-feedback" id="t-fb"></div>`;

            if (state.timer) clearInterval(state.timer);
            state.timer = setInterval(() => {
                timeLeft--;
                const el = document.getElementById('t-timer');
                if (el) el.textContent = `⏱️ ${timeLeft}s`;
                if (timeLeft <= 0) { clearInterval(state.timer); answer(-1); }
            }, 1000);

            container.querySelectorAll('.trivia-opt').forEach(btn => {
                btn.addEventListener('click', () => answer(parseInt(btn.dataset.i)));
            });
        };

        const answer = (idx) => {
            if (state.timer) clearInterval(state.timer);
            const q = state.questions[state.current];
            container.querySelectorAll('.trivia-opt').forEach(btn => {
                btn.classList.add('disabled');
                if (parseInt(btn.dataset.i) === q.correct) btn.classList.add('correct');
                if (parseInt(btn.dataset.i) === idx && idx !== q.correct) btn.classList.add('incorrect');
            });
            const fb = document.getElementById('t-fb');
            const explanation = q.explanation ? `<br><span style="font-size:0.75rem;color:var(--text-muted);font-style:italic;display:block;margin-top:0.3rem;">${q.explanation}</span>` : '';
            if (idx === q.correct) { state.score++; fb.innerHTML = `<span style="color:var(--accent-green)">✓ Correct! +${state.xpPer} XP</span>${explanation}`; }
            else {
                fb.innerHTML = `<span style="color:var(--accent-red)">${idx === -1 ? '⏱️ Time\'s up!' : '✗ Incorrect!'}</span>${explanation}`;
                // Track wrong answer for review
                this.engine.trackWrongAnswer(q.question, q.answers[q.correct], q.explanation || '', q.domain || state.difficulty);
            }
            setTimeout(() => { state.current++; render(); }, explanation ? 3000 : 1500);
        };

        const end = () => {
            if (state.timer) clearInterval(state.timer);
            const totalXP = state.score * state.xpPer;
            const gold = state.score * 5;
            const perfect = state.score === state.questions.length;
            this.engine.player.triviaCompleted++;
            if (perfect) this.engine.player.perfectScores++;
            if (totalXP > 0) this.engine.addXP(totalXP, 'trivia');
            if (gold > 0) this.engine.addGold(gold);
            this.engine.player.minigamesCompleted++;

            // Track level completion
            if (!this.engine.player.completedLevels) this.engine.player.completedLevels = {};
            const levelKey = `trivia-${state.difficulty}`;
            const prevBest = this.engine.player.completedLevels[levelKey] || 0;
            if (state.score > prevBest) this.engine.player.completedLevels[levelKey] = state.score;

            this.engine.save(); this.engine.updateHUD();

            const isFirstClear = prevBest === 0 && state.score >= 3;
            const isNewBest = state.score > prevBest && prevBest > 0;

            // Story reflection based on score (from Archon Meritus)
            const reflection = typeof MENTOR !== 'undefined' ? MENTOR.getAfterMessage(state.score, state.questions.length) : 
                (perfect ? 'Perfect mastery.' : state.score >= 3 ? 'Strong work.' : 'Keep studying.');

            container.innerHTML = `
                <div class="results-box">
                    <h3>${perfect ? '⭐ Perfect! ⭐' : state.score >= 3 ? '🎉 Well Done!' : '📖 Keep Studying!'}</h3>
                    ${isFirstClear ? '<p style="color:var(--accent-green);font-size:0.8rem;margin-bottom:0.5rem;">🏆 Level Complete! You can replay anytime for practice.</p>' : ''}
                    ${isNewBest ? '<p style="color:var(--gold);font-size:0.8rem;margin-bottom:0.5rem;">⭐ New personal best!</p>' : ''}
                    <div class="results-stats">
                        <div class="r-stat"><div class="r-val">${state.score}/${state.questions.length}</div><div class="r-label">Correct</div></div>
                        <div class="r-stat"><div class="r-val">${totalXP}</div><div class="r-label">XP</div></div>
                        <div class="r-stat"><div class="r-val">${gold}</div><div class="r-label">Gold</div></div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);font-style:italic;line-height:1.5;max-width:400px;margin:0.8rem auto;padding:0.8rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:3px solid var(--gold-dark);">
                        <span style="font-size:1rem;">${typeof MENTOR !== 'undefined' ? MENTOR.icon : '🧙'}</span> "${reflection}"
                        <span style="display:block;font-size:0.65rem;color:var(--gold-dark);margin-top:0.3rem;">— ${typeof MENTOR !== 'undefined' ? MENTOR.name : 'Guild Mentor'}</span>
                    </p>
                    <p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:1rem;">Best score: ${Math.max(state.score, prevBest)}/${state.questions.length} · Completed: ${this.engine.player.triviaCompleted} times</p>
                    <button class="btn-guild" id="btn-again">Play Again</button>
                    <button class="btn-guild btn-guild-alt" id="btn-done">Done</button>
                </div>`;
            document.getElementById('btn-again').addEventListener('click', () => this.startTrivia(container, state.difficulty, onComplete));
            document.getElementById('btn-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            const ru = this.engine.checkRankUp(); if (ru) setTimeout(() => this.engine.showRankUp(ru), 500);
        };
        render();
    }

    // ===== WORD SCRAMBLE =====
    startWordScramble(container, onComplete) {
        const words = this.shuffle([...GAME_DATA.wordScramble]).slice(0, 5);
        let state = { words, current: 0, score: 0, totalXP: 0 };

        const render = () => {
            if (state.current >= state.words.length) { end(); return; }
            const w = state.words[state.current];
            container.innerHTML = `
                <div style="text-align:center">
                    <p style="color:var(--text-muted);margin-bottom:0.5rem">Word ${state.current + 1}/${state.words.length}</p>
                    <div class="scramble-display"><div class="scramble-letters">${this.scrambleWord(w.word)}</div><div class="scramble-hint">Hint: ${w.hint}</div></div>
                    <input type="text" class="scramble-input" id="s-in" placeholder="Your answer..." autocomplete="off">
                    <div><button class="btn-guild" id="btn-sub">Submit</button> <button class="btn-guild btn-guild-alt" id="btn-skip">Skip</button></div>
                    <div class="trivia-feedback" id="s-fb"></div>
                </div>`;
            const inp = document.getElementById('s-in'); inp.focus();
            inp.addEventListener('keypress', e => { if (e.key === 'Enter') check(); });
            document.getElementById('btn-sub').addEventListener('click', check);
            document.getElementById('btn-skip').addEventListener('click', skip);
        };

        const check = () => {
            const ans = document.getElementById('s-in').value.trim().toUpperCase();
            const correct = state.words[state.current].word;
            const fb = document.getElementById('s-fb');
            if (ans === correct) { state.score++; state.totalXP += 15; this.engine.player.wordsUnscrambled++; fb.innerHTML = `<span style="color:var(--accent-green)">✓ Correct! +15 XP</span>`; }
            else { fb.innerHTML = `<span style="color:var(--accent-red)">✗ It was ${correct}</span>`; }
            setTimeout(() => { state.current++; render(); }, 1200);
        };

        const skip = () => {
            document.getElementById('s-fb').innerHTML = `<span style="color:var(--text-muted)">→ ${state.words[state.current].word}</span>`;
            setTimeout(() => { state.current++; render(); }, 900);
        };

        const end = () => {
            if (state.totalXP > 0) this.engine.addXP(state.totalXP, 'word-scramble');
            this.engine.addGold(state.score * 5);
            this.engine.player.minigamesCompleted++; this.engine.save(); this.engine.updateHUD();
            container.innerHTML = `
                <div class="results-box"><h3>Word Scramble Complete!</h3>
                <div class="results-stats"><div class="r-stat"><div class="r-val">${state.score}/${state.words.length}</div><div class="r-label">Solved</div></div><div class="r-stat"><div class="r-val">${state.totalXP}</div><div class="r-label">XP</div></div></div>
                <button class="btn-guild" id="btn-again">Again</button> <button class="btn-guild btn-guild-alt" id="btn-done">Done</button></div>`;
            document.getElementById('btn-again').addEventListener('click', () => this.startWordScramble(container, onComplete));
            document.getElementById('btn-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            const ru = this.engine.checkRankUp(); if (ru) setTimeout(() => this.engine.showRankUp(ru), 500);
        };
        render();
    }

    // ===== RAPID FIRE =====
    startRapidFire(container, onComplete) {
        const qs = this.shuffle([...GAME_DATA.rapidFire]).slice(0, 10);
        let state = { qs, current: 0, correct: 0, totalXP: 0, timeLeft: 60, timer: null };
        state.timer = setInterval(() => { state.timeLeft--; const el = document.getElementById('rf-t'); if (el) el.textContent = `⏱️ ${state.timeLeft}s`; if (state.timeLeft <= 0) end(); }, 1000);

        const render = () => {
            if (state.current >= state.qs.length) { end(); return; }
            const q = state.qs[state.current];
            container.innerHTML = `
                <div style="text-align:center">
                    <div class="trivia-hud"><span>Q${state.current + 1}/${state.qs.length}</span><span class="timer" id="rf-t">⏱️ ${state.timeLeft}s</span><span class="score">✓ ${state.correct}</span></div>
                    <div class="rapid-statement">${q.statement}</div>
                    <div class="rapid-btns"><button class="rapid-btn true-btn" id="btn-t">TRUE</button><button class="rapid-btn false-btn" id="btn-f">FALSE</button></div>
                    <div class="trivia-feedback" id="rf-fb"></div>
                </div>`;
            document.getElementById('btn-t').addEventListener('click', () => ans(true));
            document.getElementById('btn-f').addEventListener('click', () => ans(false));
        };

        const ans = (a) => {
            const q = state.qs[state.current]; const fb = document.getElementById('rf-fb');
            document.getElementById('btn-t').disabled = true; document.getElementById('btn-f').disabled = true;
            if (a === q.answer) { state.correct++; state.totalXP += 5; this.engine.player.rapidFireCorrect++; fb.innerHTML = `<span style="color:var(--accent-green)">✓ ${q.explanation}</span>`; }
            else { fb.innerHTML = `<span style="color:var(--accent-red)">✗ ${q.explanation}</span>`; }
            setTimeout(() => { state.current++; render(); }, 1000);
        };

        const end = () => {
            if (state.timer) clearInterval(state.timer);
            if (state.totalXP > 0) this.engine.addXP(state.totalXP, 'rapid-fire');
            this.engine.addGold(state.correct * 3);
            this.engine.player.minigamesCompleted++; this.engine.save(); this.engine.updateHUD();
            container.innerHTML = `
                <div class="results-box"><h3>Rapid Fire Complete!</h3>
                <div class="results-stats"><div class="r-stat"><div class="r-val">${state.correct}/${state.qs.length}</div><div class="r-label">Correct</div></div><div class="r-stat"><div class="r-val">${state.totalXP}</div><div class="r-label">XP</div></div></div>
                <button class="btn-guild" id="btn-again">Again</button> <button class="btn-guild btn-guild-alt" id="btn-done">Done</button></div>`;
            document.getElementById('btn-again').addEventListener('click', () => this.startRapidFire(container, onComplete));
            document.getElementById('btn-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            const ru = this.engine.checkRankUp(); if (ru) setTimeout(() => this.engine.showRankUp(ru), 500);
        };
        render();
    }

    // ===== MATCH PAIRS =====
    startMatchPairs(container, onComplete) {
        const pairs = this.shuffle([...GAME_DATA.matchPairs]).slice(0, 5);
        let state = { pairs, selTerm: null, selDef: null, matched: 0, total: pairs.length, totalXP: 0 };

        const render = () => {
            const terms = this.shuffle(pairs.map((p, i) => ({ t: p.term, i })));
            const defs = this.shuffle(pairs.map((p, i) => ({ t: p.definition, i })));
            container.innerHTML = `
                <p style="text-align:center;color:var(--text-muted);margin-bottom:1rem">Matched: ${state.matched}/${state.total}</p>
                <div class="match-columns">
                    <div><div class="match-col-title">Terms</div>${terms.map(t => `<div class="match-item ${pairs[t.i]._m ? 'matched' : ''}" data-type="term" data-i="${t.i}">${t.t}</div>`).join('')}</div>
                    <div><div class="match-col-title">Definitions</div>${defs.map(d => `<div class="match-item ${pairs[d.i]._m ? 'matched' : ''}" data-type="def" data-i="${d.i}">${d.t}</div>`).join('')}</div>
                </div>`;
            container.querySelectorAll('.match-item:not(.matched)').forEach(el => el.addEventListener('click', () => click(el)));
        };

        const click = (el) => {
            const type = el.dataset.type, idx = parseInt(el.dataset.i);
            if (type === 'term') { container.querySelectorAll('[data-type="term"]').forEach(e => e.classList.remove('selected')); el.classList.add('selected'); state.selTerm = idx; }
            else { container.querySelectorAll('[data-type="def"]').forEach(e => e.classList.remove('selected')); el.classList.add('selected'); state.selDef = idx; }
            if (state.selTerm !== null && state.selDef !== null) {
                if (state.selTerm === state.selDef) { pairs[state.selTerm]._m = true; state.matched++; state.totalXP += 20; this.engine.showToast('+20 XP'); if (state.matched >= state.total) setTimeout(end, 400); else setTimeout(render, 300); }
                else { container.querySelectorAll('.match-item.selected').forEach(e => { e.classList.add('wrong'); e.classList.remove('selected'); }); setTimeout(() => container.querySelectorAll('.wrong').forEach(e => e.classList.remove('wrong')), 500); }
                state.selTerm = null; state.selDef = null;
            }
        };

        const end = () => {
            if (state.totalXP > 0) this.engine.addXP(state.totalXP, 'match-pairs');
            this.engine.addGold(state.matched * 5); this.engine.player.minigamesCompleted++; this.engine.save(); this.engine.updateHUD();
            container.innerHTML = `
                <div class="results-box"><h3>All Matched! 🎉</h3>
                <div class="results-stats"><div class="r-stat"><div class="r-val">${state.matched}</div><div class="r-label">Pairs</div></div><div class="r-stat"><div class="r-val">${state.totalXP}</div><div class="r-label">XP</div></div></div>
                <button class="btn-guild" id="btn-again">Again</button> <button class="btn-guild btn-guild-alt" id="btn-done">Done</button></div>`;
            document.getElementById('btn-again').addEventListener('click', () => this.startMatchPairs(container, onComplete));
            document.getElementById('btn-done').addEventListener('click', () => { if (onComplete) onComplete(); });
        };
        render();
    }

    // ===== BOSS RAID =====
    startBossRaid(container, onComplete) {
        const qs = this.shuffle([...GAME_DATA.triviaQuestions.journeyman, ...GAME_DATA.triviaQuestions.master]).slice(0, 5);
        let state = { qs, current: 0, damage: 0 };

        const render = () => {
            if (state.current >= state.qs.length) { end(); return; }
            const q = state.qs[state.current];
            container.innerHTML = `
                <div class="trivia-hud"><span>Attack ${state.current + 1}/${state.qs.length}</span><span class="score">Damage: ${state.damage}</span></div>
                <div class="trivia-q">${q.question}</div>
                <div class="trivia-options">${q.answers.map((a, i) => `<button class="trivia-opt" data-i="${i}">${a}</button>`).join('')}</div>
                <div class="trivia-feedback" id="r-fb"></div>`;
            container.querySelectorAll('.trivia-opt').forEach(btn => btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.i);
                container.querySelectorAll('.trivia-opt').forEach(b => { b.classList.add('disabled'); if (parseInt(b.dataset.i) === q.correct) b.classList.add('correct'); });
                if (idx !== q.correct) btn.classList.add('incorrect');
                if (idx === q.correct) { state.damage += 5; document.getElementById('r-fb').innerHTML = `<span style="color:var(--accent-green)">💥 -5 HP!</span>`; }
                else { document.getElementById('r-fb').innerHTML = `<span style="color:var(--accent-red)">Miss!</span>`; }
                setTimeout(() => { state.current++; render(); }, 1200);
            }));
        };

        const end = () => {
            this.engine.damageBoss(state.damage);
            if (state.damage > 0) this.engine.addXP(state.damage * 5, 'raid');
            this.engine.addGold(state.damage * 2); this.engine.save(); this.engine.updateHUD();
            container.innerHTML = `
                <div class="results-box"><h3>Raid Complete!</h3>
                <div class="results-stats"><div class="r-stat"><div class="r-val">${state.damage}</div><div class="r-label">Damage</div></div><div class="r-stat"><div class="r-val">${state.damage * 5}</div><div class="r-label">XP</div></div></div>
                <p style="color:var(--text-muted);margin:0.5rem 0">Boss HP: ${this.engine.player.bossHP}%</p>
                <button class="btn-guild btn-guild-alt" id="btn-close">Return</button></div>`;
            document.getElementById('btn-close').addEventListener('click', () => { if (onComplete) onComplete(); });
        };
        render();
    }

    // Utilities
    shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
    scrambleWord(w) { let a = w.split(''); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } if (a.join('') === w) [a[0], a[a.length-1]] = [a[a.length-1], a[0]]; return a.join(''); }


    // ===== CASE STUDY (Multi-step linked scenarios) =====
    startCaseStudy(container, onComplete) {
        const cases = typeof CASE_STUDIES !== 'undefined' ? CASE_STUDIES : [];
        if (cases.length === 0) { if (onComplete) onComplete(); return; }

        const study = cases[Math.floor(Math.random() * cases.length)];
        let state = { study, currentStep: 0, score: 0, totalSteps: study.steps.length };

        // Intro screen
        container.innerHTML = `
            <div style="text-align:center;padding:1.5rem;">
                <div style="font-size:3rem;margin-bottom:0.5rem;">${study.icon}</div>
                <h3 style="font-family:'Cinzel',serif;color:var(--gold);font-size:1.2rem;margin-bottom:0.5rem;">Case Study: ${study.title}</h3>
                <p style="color:var(--text-light);font-size:0.9rem;line-height:1.7;max-width:500px;margin:0 auto 1.5rem;padding:1rem;background:rgba(0,0,0,0.2);border-radius:10px;border-left:3px solid var(--gold-dark);">${study.intro}</p>
                <p style="color:var(--text-muted);font-size:0.75rem;margin-bottom:1rem;">${state.totalSteps} linked decisions · +${study.xpTotal} XP possible</p>
                <button class="btn-guild" id="btn-start-case">Begin Case</button>
            </div>
        `;

        document.getElementById('btn-start-case').addEventListener('click', () => renderStep());

        const renderStep = () => {
            if (state.currentStep >= state.totalSteps) { endCase(); return; }
            const step = study.steps[state.currentStep];

            container.innerHTML = `
                <div style="padding:0.5rem;">
                    <div class="trivia-hud">
                        <span>Step ${state.currentStep + 1}/${state.totalSteps}</span>
                        <span style="color:var(--gold-dark);">${study.title}</span>
                        <span class="score">Score: ${state.score}/${state.currentStep}</span>
                    </div>
                    <div class="trivia-q" style="font-size:0.95rem;">${step.question}</div>
                    <div class="trivia-options">
                        ${step.answers.map((a, i) => `<button class="trivia-opt" data-i="${i}">${a}</button>`).join('')}
                    </div>
                    <div class="trivia-feedback" id="case-fb"></div>
                </div>
            `;

            container.querySelectorAll('.trivia-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.i);
                    container.querySelectorAll('.trivia-opt').forEach(b => {
                        b.classList.add('disabled');
                        if (parseInt(b.dataset.i) === step.correct) b.classList.add('correct');
                        if (parseInt(b.dataset.i) === idx && idx !== step.correct) b.classList.add('incorrect');
                    });

                    const fb = document.getElementById('case-fb');
                    if (idx === step.correct) {
                        state.score++;
                        fb.innerHTML = `<span style="color:var(--accent-green)">✓ Correct!</span><br><span style="font-size:0.8rem;color:var(--text-muted);font-style:italic;">${step.explanation}</span>`;
                    } else {
                        fb.innerHTML = `<span style="color:var(--accent-red)">✗ Not the best approach.</span><br><span style="font-size:0.8rem;color:var(--text-muted);font-style:italic;">${step.explanation}</span>`;
                    }

                    setTimeout(() => { state.currentStep++; renderStep(); }, 3500);
                });
            });
        };

        const endCase = () => {
            const xpEarned = Math.round(study.xpTotal * (state.score / state.totalSteps));
            const goldEarned = Math.round(xpEarned / 3);
            if (xpEarned > 0) this.engine.addXP(xpEarned, 'study');
            if (goldEarned > 0) this.engine.addGold(goldEarned);
            this.engine.player.minigamesCompleted++;
            this.engine.save();
            this.engine.updateHUD();

            const perfect = state.score === state.totalSteps;
            container.innerHTML = `
                <div class="results-box">
                    <h3>${perfect ? '⭐ Perfect Case Resolution!' : state.score >= 2 ? '🎉 Case Closed!' : '📖 Review the reasoning.'}</h3>
                    <p style="color:var(--text-muted);font-size:0.8rem;margin-bottom:1rem;">${study.title}</p>
                    <div class="results-stats">
                        <div class="r-stat"><div class="r-val">${state.score}/${state.totalSteps}</div><div class="r-label">Steps Correct</div></div>
                        <div class="r-stat"><div class="r-val">${xpEarned}</div><div class="r-label">XP</div></div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);font-style:italic;margin:1rem auto;max-width:400px;padding:0.6rem;background:rgba(0,0,0,0.2);border-radius:6px;">
                        "${perfect ? 'You resolved every step with the right approach. This is how real analysts think through complex problems — step by step, evidence first.' : 'Each case builds on the last decision. Review the explanations to understand the chain of reasoning. Try again to see a different case.'}"
                    </p>
                    <button class="btn-guild" id="btn-case-again">New Case</button>
                    <button class="btn-guild btn-guild-alt" id="btn-case-done">Done</button>
                </div>
            `;
            document.getElementById('btn-case-again').addEventListener('click', () => this.startCaseStudy(container, onComplete));
            document.getElementById('btn-case-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            const ru = this.engine.checkRankUp(); if (ru) setTimeout(() => this.engine.showRankUp(ru), 500);
        };
    }

    // ===== WHAT WOULD YOU DO? (Best/Worst ranking) =====
    startWWYD(container, onComplete) {
        const scenarios = typeof WWYD_SCENARIOS !== 'undefined' ? WWYD_SCENARIOS : [];
        if (scenarios.length === 0) { if (onComplete) onComplete(); return; }

        const picked = this.shuffle([...scenarios]).slice(0, 3);
        let state = { scenarios: picked, current: 0, totalXP: 0 };

        const renderScenario = () => {
            if (state.current >= state.scenarios.length) { endWWYD(); return; }
            const s = state.scenarios[state.current];

            container.innerHTML = `
                <div style="padding:0.5rem;">
                    <div class="trivia-hud">
                        <span>Scenario ${state.current + 1}/${state.scenarios.length}</span>
                        <span class="score" style="color:var(--gold);">What Would You Do?</span>
                    </div>
                    <div class="trivia-q" style="font-size:0.9rem;min-height:90px;">${s.scenario}</div>
                    <p style="text-align:center;color:var(--gold-dark);font-size:0.8rem;font-weight:700;margin-bottom:0.5rem;">Pick the BEST response:</p>
                    <div class="trivia-options" id="wwyd-best">
                        ${s.options.map((o, i) => `<button class="trivia-opt" data-i="${i}" data-val="${o.value}">${o.label}</button>`).join('')}
                    </div>
                    <div class="trivia-feedback" id="wwyd-fb"></div>
                </div>
            `;

            let bestPicked = false;

            container.querySelectorAll('#wwyd-best .trivia-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (bestPicked) return;
                    bestPicked = true;
                    const val = btn.dataset.val;
                    const idx = parseInt(btn.dataset.i);
                    const option = s.options[idx];

                    container.querySelectorAll('#wwyd-best .trivia-opt').forEach(b => {
                        b.classList.add('disabled');
                        if (b.dataset.val === 'best') b.classList.add('correct');
                        if (b.dataset.val === 'worst') b.style.borderColor = 'var(--accent-red)';
                    });
                    if (val !== 'best') btn.classList.add('incorrect');

                    const fb = document.getElementById('wwyd-fb');
                    const bestOption = s.options.find(o => o.value === 'best');
                    const worstOption = s.options.find(o => o.value === 'worst');

                    if (val === 'best') {
                        state.totalXP += s.xp;
                        fb.innerHTML = `<span style="color:var(--accent-green)">✓ Correct! Best choice.</span><br><span style="font-size:0.75rem;color:var(--text-muted);">${bestOption.explanation}</span><br><br><span style="font-size:0.7rem;color:var(--accent-red);">Worst would be:</span> <span style="font-size:0.7rem;color:var(--text-muted);">${worstOption.explanation}</span>`;
                    } else if (val === 'worst') {
                        fb.innerHTML = `<span style="color:var(--accent-red)">✗ That's actually the WORST option.</span><br><span style="font-size:0.75rem;color:var(--text-muted);">${option.explanation}</span><br><br><span style="font-size:0.7rem;color:var(--accent-green);">Best would be:</span> <span style="font-size:0.7rem;color:var(--text-muted);">${bestOption.explanation}</span>`;
                    } else {
                        state.totalXP += Math.round(s.xp * 0.5);
                        fb.innerHTML = `<span style="color:var(--accent-orange)">~ Okay, but not the best.</span><br><span style="font-size:0.75rem;color:var(--text-muted);">${option.explanation}</span><br><br><span style="font-size:0.7rem;color:var(--accent-green);">Best:</span> <span style="font-size:0.7rem;color:var(--text-muted);">${bestOption.explanation}</span>`;
                    }

                    setTimeout(() => { state.current++; renderScenario(); }, 4000);
                });
            });
        };

        const endWWYD = () => {
            if (state.totalXP > 0) this.engine.addXP(state.totalXP, 'study');
            this.engine.addGold(Math.round(state.totalXP / 4));
            this.engine.player.minigamesCompleted++;
            this.engine.save();
            this.engine.updateHUD();

            container.innerHTML = `
                <div class="results-box">
                    <h3>Judgment Assessment Complete</h3>
                    <div class="results-stats">
                        <div class="r-stat"><div class="r-val">${state.totalXP}</div><div class="r-label">XP Earned</div></div>
                        <div class="r-stat"><div class="r-val">${state.scenarios.length}</div><div class="r-label">Scenarios</div></div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-muted);font-style:italic;margin:1rem auto;max-width:400px;padding:0.6rem;background:rgba(0,0,0,0.2);border-radius:6px;">
                        "Leadership isn't about having the right answer every time. It's about having the judgment to weigh tradeoffs and act decisively with imperfect information."
                    </p>
                    <button class="btn-guild" id="btn-wwyd-again">More Scenarios</button>
                    <button class="btn-guild btn-guild-alt" id="btn-wwyd-done">Done</button>
                </div>
            `;
            document.getElementById('btn-wwyd-again').addEventListener('click', () => this.startWWYD(container, onComplete));
            document.getElementById('btn-wwyd-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            const ru = this.engine.checkRankUp(); if (ru) setTimeout(() => this.engine.showRankUp(ru), 500);
        };

        renderScenario();
    }


    // ===== CRCR EXAM MODE =====
    // Simulates the real HFMA CRCR exam: 75 questions, 90 minutes, 70% to pass
    startExamMode(container, onComplete) {
        const allQs = typeof CRCR_EXAM_QUESTIONS !== 'undefined' ? [...CRCR_EXAM_QUESTIONS] : [];
        // Also pull from expanded and scenario pools for more questions
        const extraQs = [];
        if (typeof EXPANDED_TRIVIA !== 'undefined') {
            Object.values(EXPANDED_TRIVIA).forEach(arr => arr.forEach(q => {
                if (!q.domain) q.domain = 'revenue-cycle';
                extraQs.push(q);
            }));
        }
        if (typeof SCENARIO_TRIVIA !== 'undefined') {
            Object.values(SCENARIO_TRIVIA).forEach(arr => arr.forEach(q => {
                if (!q.domain) q.domain = 'post-service';
                extraQs.push(q);
            }));
        }

        const combined = [...allQs, ...extraQs];
        if (combined.length === 0) { if (onComplete) onComplete(); return; }

        const questions = this.shuffle(combined).slice(0, 75);
        const totalTime = 90 * 60; // 90 minutes in seconds
        let state = {
            questions,
            current: 0,
            score: 0,
            domainScores: {},
            domainTotals: {},
            timeLeft: totalTime,
            timer: null,
            answers: []
        };

        // Initialize domain tracking
        Object.keys(CRCR_DOMAINS).forEach(d => { state.domainScores[d] = 0; state.domainTotals[d] = 0; });
        questions.forEach(q => { state.domainTotals[q.domain || 'revenue-cycle'] = (state.domainTotals[q.domain || 'revenue-cycle'] || 0) + 1; });

        // Start timer
        state.timer = setInterval(() => {
            state.timeLeft--;
            const el = document.getElementById('exam-timer');
            if (el) {
                const min = Math.floor(state.timeLeft / 60);
                const sec = state.timeLeft % 60;
                el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
                if (state.timeLeft <= 300) el.style.color = 'var(--accent-red)'; // Last 5 min = red
            }
            if (state.timeLeft <= 0) { clearInterval(state.timer); endExam(); }
        }, 1000);

        // Intro
        container.innerHTML = `
            <div style="text-align:center;padding:1.5rem;">
                <div style="font-size:3rem;margin-bottom:0.5rem;">📝</div>
                <h3 style="font-family:'Cinzel',serif;color:var(--gold);font-size:1.3rem;">CRCR Practice Exam</h3>
                <p style="color:var(--text-muted);font-size:0.85rem;line-height:1.6;max-width:450px;margin:0.5rem auto 1rem;">
                    75 multiple-choice questions · 90 minutes · One sitting<br>
                    Passing score: 70% (53/75)<br>
                    All 6 CRCR domains · Results show strengths and weaknesses
                </p>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.8rem;text-align:left;max-width:400px;margin-left:auto;margin-right:auto;line-height:1.6;">
                    <strong style="color:var(--text-light);">Content covers:</strong><br>
                    • Patient Access (scheduling, verification, co-pays)<br>
                    • Billing & Claims (codes, submissions, appeals)<br>
                    • Compliance (HIPAA, EMTALA, privacy)<br>
                    • Financial Policies (charity care, self-pay, payments)<br>
                    • Denial Management & Resolution<br>
                    • KPIs & Revenue Integrity
                </div>
                <p style="color:var(--accent-orange);font-size:0.7rem;margin-bottom:1.5rem;">This is a practice simulation based on HFMA CRCR exam format. It does not replace official HFMA study materials or the CRCR Concept Guide.</p>
                <button class="btn-guild" id="btn-start-exam">Start Exam</button>
            </div>
        `;

        document.getElementById('btn-start-exam').addEventListener('click', () => renderQuestion());

        const renderQuestion = () => {
            if (state.current >= state.questions.length) { endExam(); return; }
            const q = state.questions[state.current];
            const min = Math.floor(state.timeLeft / 60);
            const sec = state.timeLeft % 60;

            container.innerHTML = `
                <div style="padding:0.5rem;">
                    <div class="trivia-hud">
                        <span>Q${state.current + 1}/${state.questions.length}</span>
                        <span id="exam-timer" style="color:var(--gold);">${min}:${sec.toString().padStart(2, '0')}</span>
                        <span class="score">${state.score}/${state.current} correct</span>
                    </div>
                    <div style="font-size:0.6rem;color:var(--text-muted);text-align:center;margin-bottom:0.5rem;">${CRCR_DOMAINS[q.domain].icon} ${CRCR_DOMAINS[q.domain].name}</div>
                    <div class="trivia-q" style="font-size:0.9rem;">${q.question}</div>
                    <div class="trivia-options">
                        ${q.answers.map((a, i) => `<button class="trivia-opt" data-i="${i}">${a}</button>`).join('')}
                    </div>
                </div>
            `;

            container.querySelectorAll('.trivia-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.i);
                    container.querySelectorAll('.trivia-opt').forEach(b => {
                        b.classList.add('disabled');
                        if (parseInt(b.dataset.i) === q.correct) b.classList.add('correct');
                        if (parseInt(b.dataset.i) === idx && idx !== q.correct) b.classList.add('incorrect');
                    });

                    if (idx === q.correct) {
                        state.score++;
                        state.domainScores[q.domain || 'revenue-cycle']++;
                    } else {
                        // Track wrong answers for Error Review
                        this.engine.trackWrongAnswer(q.question, q.answers[q.correct], q.explanation || '', q.domain || 'revenue-cycle');
                    }
                    state.answers.push({ question: q.question, domain: q.domain || 'revenue-cycle', correct: idx === q.correct, explanation: q.explanation, correctAnswer: q.answers[q.correct] });

                    // No explanation during exam (like real test) — just move on
                    setTimeout(() => { state.current++; renderQuestion(); }, 800);
                });
            });
        };

        const endExam = () => {
            if (state.timer) clearInterval(state.timer);
            const pct = Math.round((state.score / state.questions.length) * 100);
            const passed = pct >= 70;
            const xpEarned = passed ? 150 : Math.round(pct * 0.8);
            const wrongCount = state.questions.length - state.score;

            if (xpEarned > 0) this.engine.addXP(xpEarned, 'study');
            this.engine.player.minigamesCompleted++;

            // Save exam history
            if (!this.engine.player.examHistory) this.engine.player.examHistory = [];
            this.engine.player.examHistory.push({
                date: new Date().toISOString(),
                score: state.score,
                total: state.questions.length,
                pct,
                passed,
                domainScores: { ...state.domainScores },
                domainTotals: { ...state.domainTotals }
            });
            this.engine.save();
            this.engine.updateHUD();

            // Domain breakdown
            const domainRows = Object.entries(CRCR_DOMAINS).map(([key, domain]) => {
                const got = state.domainScores[key] || 0;
                const total = state.domainTotals[key] || 0;
                if (total === 0) return '';
                const domPct = Math.round((got / total) * 100);
                const color = domPct >= 80 ? 'var(--accent-green)' : domPct >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)';
                const bar = `<div style="height:6px;background:rgba(0,0,0,0.3);border-radius:3px;overflow:hidden;margin-top:2px;"><div style="height:100%;width:${domPct}%;background:${color};border-radius:3px;"></div></div>`;
                return `<div style="margin-bottom:0.6rem;">
                    <div style="display:flex;justify-content:space-between;font-size:0.75rem;">
                        <span style="color:var(--text-light);">${domain.icon} ${domain.name}</span>
                        <span style="color:${color};font-weight:700;">${got}/${total} (${domPct}%)</span>
                    </div>
                    ${bar}
                </div>`;
            }).join('');

            // Weak domains
            const weakDomains = Object.entries(state.domainScores)
                .filter(([key]) => state.domainTotals[key] > 0)
                .map(([key, score]) => ({ key, pct: Math.round((score / state.domainTotals[key]) * 100) }))
                .filter(d => d.pct < 70)
                .sort((a, b) => a.pct - b.pct);

            const weakSection = weakDomains.length > 0 ?
                `<div style="margin-top:1rem;padding:0.8rem;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);border-radius:8px;">
                    <p style="font-size:0.75rem;color:var(--accent-red);font-weight:700;margin-bottom:0.3rem;">⚠️ Focus Areas (Below 70%):</p>
                    ${weakDomains.map(d => `<p style="font-size:0.7rem;color:var(--text-muted);">• ${CRCR_DOMAINS[d.key].icon} ${CRCR_DOMAINS[d.key].name} (${d.pct}%)</p>`).join('')}
                </div>` : '';

            container.innerHTML = `
                <div style="max-width:450px;margin:0 auto;padding:1rem;">
                    <div style="text-align:center;margin-bottom:1.5rem;">
                        <div style="font-size:3rem;">${passed ? '🎉' : '📖'}</div>
                        <h3 style="font-family:'Cinzel',serif;color:${passed ? 'var(--accent-green)' : 'var(--accent-red)'};font-size:1.4rem;">${passed ? 'PASSED' : 'NOT YET'}</h3>
                        <div style="font-family:'Cinzel',serif;font-size:2.5rem;color:var(--gold);margin:0.3rem 0;">${pct}%</div>
                        <p style="color:var(--text-muted);font-size:0.8rem;">${state.score}/${state.questions.length} correct · Passing: 70% (${Math.ceil(state.questions.length * 0.7)}/${state.questions.length})</p>
                        <p style="color:var(--gold-dark);font-size:0.75rem;margin-top:0.3rem;">+${xpEarned} XP earned</p>
                    </div>

                    <h4 style="font-family:'Cinzel',serif;color:var(--gold);font-size:0.9rem;margin-bottom:0.5rem;">Domain Breakdown:</h4>
                    ${domainRows}
                    ${weakSection}

                    ${this.engine.player.examHistory.length > 1 ? `
                        <div style="margin-top:1rem;padding:0.6rem;background:rgba(0,0,0,0.2);border-radius:6px;">
                            <p style="font-size:0.7rem;color:var(--text-muted);">📊 Exam History: ${this.engine.player.examHistory.length} attempts · Best: ${Math.max(...this.engine.player.examHistory.map(e => e.pct))}% · Trend: ${this.engine.player.examHistory.slice(-3).map(e => e.pct + '%').join(' → ')}</p>
                        </div>
                    ` : ''}

                    ${wrongCount > 0 ? `
                        <div style="margin-top:1rem;padding:0.8rem;background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.3);border-radius:8px;">
                            <p style="font-size:0.75rem;color:var(--accent-red);font-weight:700;margin-bottom:0.3rem;">🔄 ${wrongCount} questions added to your Error Review queue</p>
                            <p style="font-size:0.7rem;color:var(--text-muted);">Go to Train → Error Review to study these items with Archon Meritus. Get each right twice to master it and remove it from your queue.</p>
                        </div>
                    ` : ''}

                    <div style="text-align:center;margin-top:1.5rem;">
                        <button class="btn-guild" id="btn-exam-review">Review Answers</button>
                        ${wrongCount > 0 ? '<button class="btn-guild" id="btn-exam-errors" style="background:linear-gradient(180deg, var(--accent-orange) 0%, #e65100 100%);border-color:#bf360c;color:white;">Start Error Review</button>' : ''}
                        <button class="btn-guild btn-guild-alt" id="btn-exam-done">Done</button>
                    </div>
                </div>
            `;

            document.getElementById('btn-exam-review').addEventListener('click', () => showReview());
            if (wrongCount > 0) {
                document.getElementById('btn-exam-errors').addEventListener('click', () => {
                    this.startErrorReview(container, onComplete);
                });
            }
            document.getElementById('btn-exam-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            const ru = this.engine.checkRankUp(); if (ru) setTimeout(() => this.engine.showRankUp(ru), 500);
        };

        const showReview = () => {
            container.innerHTML = `
                <div style="padding:0.5rem;">
                    <button class="btn-back" id="btn-back-review" style="margin-bottom:1rem;">← Back to Results</button>
                    <h4 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:1rem;">Answer Review</h4>
                    ${state.answers.map((a, i) => `
                        <div style="margin-bottom:0.8rem;padding:0.6rem;background:var(--bg-dark);border-radius:8px;border-left:3px solid ${a.correct ? 'var(--accent-green)' : 'var(--accent-red)'};">
                            <div style="font-size:0.75rem;color:var(--text-light);margin-bottom:0.3rem;">${a.correct ? '✓' : '✗'} Q${i + 1}: ${a.question.substring(0, 80)}...</div>
                            <div style="font-size:0.7rem;color:var(--text-muted);font-style:italic;">${a.explanation}</div>
                            <div style="font-size:0.6rem;color:var(--gold-dark);margin-top:0.2rem;">${CRCR_DOMAINS[a.domain].icon} ${CRCR_DOMAINS[a.domain].name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            document.getElementById('btn-back-review').addEventListener('click', () => endExam());
        };
    }


    // ===== ERROR REVIEW MODE (Spaced Repetition with Storytelling) =====
    // Framed as a mentor guiding you through your knowledge gaps.
    startErrorReview(container, onComplete) {
        const errors = this.engine.getErrorsForReview();
        if (errors.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:2rem;">
                    <div style="font-size:3rem;margin-bottom:1rem;">✅</div>
                    <h3 style="font-family:'Cinzel',serif;color:var(--accent-green);font-size:1.2rem;">No Errors to Review!</h3>
                    <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem;font-style:italic;">"A clear mind is a prepared mind. Your error bank is empty — every past mistake has become a lesson mastered."</p>
                    <button class="btn-guild btn-guild-alt" id="btn-er-done" style="margin-top:1.5rem;">Back</button>
                </div>
            `;
            document.getElementById('btn-er-done').addEventListener('click', () => { if (onComplete) onComplete(); });
            return;
        }

        const stats = this.engine.getErrorStats();
        const reviewSet = errors.slice(0, 10);
        let state = { items: reviewSet, current: 0, corrected: 0 };

        // Mentor intro stories based on error count
        const mentorIntros = [
            "The Guild Elder approaches you by the fire. 'I've been watching your battles,' they say, pulling a worn scroll from their robes. 'These are the moments where your blade faltered. Let us turn each stumble into strength.'",
            "In the quiet of the Library, your mentor lays out parchments marked with red ink. 'These are not failures,' they say gently. 'They are signposts showing exactly where your next breakthrough lies.'",
            "The training dummy in the courtyard bears the marks of your practice. Your mentor taps a wooden board on the wall — each line a question that once defeated you. 'Today, we defeat them back.'"
        ];

        const mentorIntro = mentorIntros[Math.floor(Math.random() * mentorIntros.length)];

        container.innerHTML = `
            <div style="text-align:center;padding:1.5rem;">
                <div style="font-size:2.5rem;margin-bottom:0.5rem;">🧙</div>
                <h3 style="font-family:'Cinzel',serif;color:var(--gold);font-size:1.2rem;">The Mentor's Review</h3>
                <p style="color:var(--text-light);font-size:0.85rem;font-style:italic;line-height:1.7;max-width:450px;margin:0.8rem auto 1.2rem;padding:1rem;background:rgba(0,0,0,0.2);border-radius:10px;border-left:3px solid var(--gold-dark);">"${mentorIntro}"</p>
                <div style="display:flex;justify-content:center;gap:1.5rem;margin-bottom:1.5rem;">
                    <div style="text-align:center;"><div style="font-family:'Cinzel',serif;font-size:1.5rem;color:var(--accent-red);">${stats.active}</div><div style="font-size:0.65rem;color:var(--text-muted);">To Review</div></div>
                    <div style="text-align:center;"><div style="font-family:'Cinzel',serif;font-size:1.5rem;color:var(--accent-green);">${stats.mastered}</div><div style="font-size:0.65rem;color:var(--text-muted);">Mastered</div></div>
                    <div style="text-align:center;"><div style="font-family:'Cinzel',serif;font-size:1.5rem;color:var(--gold);">${stats.total}</div><div style="font-size:0.65rem;color:var(--text-muted);">Total Tracked</div></div>
                </div>
                <button class="btn-guild" id="btn-start-review">Begin Review (${Math.min(10, errors.length)} items)</button>
            </div>
        `;

        document.getElementById('btn-start-review').addEventListener('click', () => renderReviewItem());

        // Mentor encouragement + study technique tips shown between items
        const studyTechniques = [
            { technique: 'Active Recall', tip: "Don't just re-read the answer. Close your eyes and try to recall it from memory BEFORE looking. The struggle to remember is what builds the neural pathway." },
            { technique: 'The Feynman Method', tip: "Try explaining this concept out loud as if teaching a brand new hire. If you stumble or use jargon they wouldn't understand, you haven't truly mastered it yet." },
            { technique: 'Spaced Repetition', tip: "You're seeing this again because your brain needs repeated exposure over time to move knowledge from short-term to long-term memory. Each review strengthens the connection." },
            { technique: 'Memory Anchoring', tip: "Link this fact to something you already know. Create a mental image, a story, or connect it to a real claim you've worked on. Isolated facts fade — connected ones stick." },
            { technique: 'Chunking', tip: "Don't try to memorize the whole concept. Break it into 2-3 small pieces. Master one piece at a time. Your brain processes chunks more easily than walls of information." },
            { technique: 'Elaborative Interrogation', tip: "Ask yourself: WHY is this the correct answer? Understanding the reasoning behind a fact makes it 10x more memorable than memorizing the fact alone." },
            { technique: 'Contextual Learning', tip: "Think of a real scenario at work where this knowledge would apply. When you connect learning to a real situation you've faced, it becomes unforgettable." },
            { technique: 'Teach to Learn', tip: "The moment you can teach this to someone else without notes, you own it. If you can't explain it simply, you don't understand it deeply enough yet." },
            { technique: 'Error Analysis', tip: "Don't just learn the right answer — understand WHY you chose the wrong one. What tripped you up? A misread word? A similar-sounding term? Fix the specific confusion." },
            { technique: 'Interleaving', tip: "Mixing different types of questions (not just studying one topic at a time) forces your brain to discriminate between concepts. This builds stronger, more flexible knowledge." }
        ];

        const renderReviewItem = () => {
            if (state.current >= state.items.length) { endReview(); return; }
            const item = state.items[state.current];
            const technique = studyTechniques[state.current % studyTechniques.length];

            container.innerHTML = `
                <div style="padding:0.5rem;">
                    <div class="trivia-hud">
                        <span>Review ${state.current + 1}/${state.items.length}</span>
                        <span style="color:var(--accent-red);font-size:0.7rem;">Missed ${item.timesWrong}x</span>
                        <span class="score">Understood: ${state.corrected}</span>
                    </div>
                    ${state.current > 0 ? `
                        <div style="margin-bottom:0.8rem;padding:0.6rem;background:rgba(201,168,76,0.08);border-radius:8px;border:1px solid rgba(201,168,76,0.2);">
                            <p style="font-size:0.65rem;color:var(--gold);font-weight:700;margin-bottom:0.2rem;">💡 Study Technique: ${technique.technique}</p>
                            <p style="font-size:0.7rem;color:var(--text-muted);line-height:1.5;">${technique.tip}</p>
                        </div>
                    ` : ''}
                    <div class="trivia-q" style="font-size:0.9rem;">${item.question}</div>
                    <div style="padding:0.8rem;background:rgba(0,0,0,0.2);border-radius:8px;margin-bottom:1rem;border-left:3px solid var(--gold-dark);">
                        <p style="font-size:0.75rem;color:var(--gold-dark);font-weight:700;margin-bottom:0.3rem;">✓ The correct answer:</p>
                        <p style="font-size:0.9rem;color:var(--text-light);font-weight:600;">${item.correctAnswer}</p>
                        ${item.explanation ? `<p style="font-size:0.8rem;color:var(--text-muted);font-style:italic;margin-top:0.5rem;line-height:1.5;">${item.explanation}</p>` : ''}
                    </div>
                    <div style="text-align:center;margin-bottom:1rem;">
                        <p style="color:var(--text-light);font-size:0.8rem;margin-bottom:0.3rem;">🧙‍♂️ Archon Meritus asks:</p>
                        <p style="color:var(--gold-dark);font-size:0.85rem;font-style:italic;">"Can you explain WHY this is correct — not just WHAT the answer is?"</p>
                    </div>
                    <div style="display:flex;gap:1rem;justify-content:center;">
                        <button class="btn-guild" id="btn-got-it" style="background:linear-gradient(180deg, var(--accent-green) 0%, #388e3c 100%);border-color:#2e7d32;color:white;">✓ I can explain it</button>
                        <button class="btn-guild btn-guild-alt" id="btn-still-unsure">✗ Not yet</button>
                    </div>
                </div>
            `;

            document.getElementById('btn-got-it').addEventListener('click', () => {
                this.engine.trackCorrectReview(item.question);
                state.corrected++;
                state.current++;
                renderReviewItem();
            });

            document.getElementById('btn-still-unsure').addEventListener('click', () => {
                state.current++;
                renderReviewItem();
            });
        };

        // Mentor outro stories based on performance
        const endReview = () => {
            const xpEarned = state.corrected * 5;
            if (xpEarned > 0) this.engine.addXP(xpEarned, 'study');
            this.engine.save();
            this.engine.updateHUD();

            const remaining = this.engine.getErrorsForReview().length;
            const pct = Math.round((state.corrected / state.items.length) * 100);

            const outros = {
                perfect: "Your mentor smiles broadly. 'Every item understood. Every gap addressed. You came here with uncertainty and leave with clarity. That is the way of the guild.'",
                good: "The elder rolls up the scroll. 'Most of these have found their place in your memory now. The few that remain — we will revisit. Patience is a teacher too.'",
                needsWork: "'Do not be discouraged,' your mentor says, placing a hand on your shoulder. 'The willingness to return and face what challenges you — that alone sets you apart from those who never try.'"
            };

            const outro = pct === 100 ? outros.perfect : pct >= 60 ? outros.good : outros.needsWork;

            container.innerHTML = `
                <div class="results-box" style="max-width:450px;">
                    <h3>Review Complete</h3>
                    <div class="results-stats">
                        <div class="r-stat"><div class="r-val">${state.corrected}</div><div class="r-label">Understood</div></div>
                        <div class="r-stat"><div class="r-val">${state.items.length - state.corrected}</div><div class="r-label">Need More</div></div>
                        <div class="r-stat"><div class="r-val">${remaining}</div><div class="r-label">In Queue</div></div>
                    </div>
                    <p style="font-size:0.8rem;color:var(--text-light);font-style:italic;line-height:1.6;margin:1rem auto;max-width:400px;padding:0.8rem;background:rgba(0,0,0,0.2);border-radius:8px;border-left:3px solid var(--gold-dark);">"${outro}"</p>
                    ${remaining === 0 ? '<p style="font-size:0.75rem;color:var(--accent-green);margin-bottom:0.5rem;">🎉 Error queue clear! All past mistakes mastered.</p>' : `<p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.5rem;">${remaining} items remain. Return when ready.</p>`}
                    <p style="font-size:0.7rem;color:var(--gold-dark);">+${xpEarned} XP</p>
                    <button class="btn-guild" id="btn-er-again" ${remaining === 0 ? 'disabled' : ''}>Review More</button>
                    <button class="btn-guild btn-guild-alt" id="btn-er-done">Done</button>
                </div>
            `;
            document.getElementById('btn-er-again').addEventListener('click', () => this.startErrorReview(container, onComplete));
            document.getElementById('btn-er-done').addEventListener('click', () => { if (onComplete) onComplete(); });
        };
    }
    // ===== GUILD QUIZ (AOM Guild of SMEs - separate from RCM trivia) =====
    startGuildQuiz(container, onComplete) {
        const allQs = GAME_DATA.guildTrivia || [];
        if (allQs.length === 0) { if (onComplete) onComplete(); return; }

        const questions = this.shuffle([...allQs]).slice(0, 8);
        let state = { questions, current: 0, score: 0 };

        // Mentor intro
        container.innerHTML = `
            <div style="text-align:center;padding:1.5rem;">
                <div style="font-size:3rem;margin-bottom:0.5rem;">⚜️</div>
                <h3 style="font-family:'Cinzel',serif;color:var(--gold);font-size:1.2rem;">Guild of SMEs Knowledge Check</h3>
                <p style="color:var(--text-muted);font-size:0.85rem;margin:0.5rem auto 1.5rem;max-width:400px;">Test your knowledge of the Guild framework, processes, values, and protocols. These questions are specific to how we operate as a guild.</p>
                <button class="btn-guild" id="btn-start-guild">Begin</button>
            </div>
        `;

        document.getElementById('btn-start-guild').addEventListener('click', () => render());

        const render = () => {
            if (state.current >= state.questions.length) { end(); return; }
            const q = state.questions[state.current];

            container.innerHTML = `
                <div class="trivia-hud">
                    <span>Q${state.current + 1}/${state.questions.length}</span>
                    <span style="color:var(--gold);">⚜️ Guild Quiz</span>
                    <span class="score">Score: ${state.score}</span>
                </div>
                <div class="trivia-q">${q.question}</div>
                <div class="trivia-options">${q.answers.map((a, i) => `<button class="trivia-opt" data-i="${i}">${a}</button>`).join('')}</div>
                <div class="trivia-feedback" id="gq-fb"></div>`;

            container.querySelectorAll('.trivia-opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.i);
                    container.querySelectorAll('.trivia-opt').forEach(b => {
                        b.classList.add('disabled');
                        if (parseInt(b.dataset.i) === q.correct) b.classList.add('correct');
                        if (parseInt(b.dataset.i) === idx && idx !== q.correct) b.classList.add('incorrect');
                    });
                    const fb = document.getElementById('gq-fb');
                    const explanation = q.explanation ? '<br><span style="font-size:0.75rem;color:var(--text-muted);font-style:italic;">' + q.explanation + '</span>' : '';
                    if (idx === q.correct) { state.score++; fb.innerHTML = '<span style="color:var(--accent-green)">✓ Correct! +15 XP</span>' + explanation; }
                    else { fb.innerHTML = '<span style="color:var(--accent-red)">✗ Incorrect</span>' + explanation; }
                    setTimeout(() => { state.current++; render(); }, 2500);
                });
            });
        };

        const end = () => {
            const totalXP = state.score * 15;
            const gold = state.score * 5;
            if (totalXP > 0) this.engine.addXP(totalXP, 'study');
            if (gold > 0) this.engine.addGold(gold);
            this.engine.player.minigamesCompleted++;
            this.engine.save();
            this.engine.updateHUD();

            const perfect = state.score === state.questions.length;
            container.innerHTML = `
                <div class="results-box">
                    <h3>${perfect ? '⚜️ Guild Master!' : state.score >= 5 ? '🎉 Well Done!' : '📖 Review the Guild SOP'}</h3>
                    <div class="results-stats">
                        <div class="r-stat"><div class="r-val">${state.score}/${state.questions.length}</div><div class="r-label">Correct</div></div>
                        <div class="r-stat"><div class="r-val">${totalXP}</div><div class="r-label">XP</div></div>
                    </div>
                    <button class="btn-guild" id="btn-gq-again">Play Again</button>
                    <button class="btn-guild btn-guild-alt" id="btn-gq-done">Done</button>
                </div>`;
            document.getElementById('btn-gq-again').addEventListener('click', () => this.startGuildQuiz(container, onComplete));
            document.getElementById('btn-gq-done').addEventListener('click', () => { if (onComplete) onComplete(); });
        };
    }

}
