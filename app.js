// Realm of Excellence - Main Application
const engine = new GameEngine();
const games = new MiniGames(engine);

// === ICON HELPER (Bear with heart for PFS) ===
function getHouseIcon(houseId) {
    const house = GAME_DATA.houses[houseId];
    if (house.iconHtml) {
        return house.iconHtml;
    }
    return house.icon;
}

// === SCREEN MANAGEMENT ===
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showSubScreen(title, renderFn) {
    showScreen('sub-screen');
    document.getElementById('sub-screen-title').textContent = title;
    const body = document.getElementById('sub-screen-body');
    body.innerHTML = '';
    renderFn(body);
}

// === TITLE SCREEN ===
document.getElementById('btn-new-game').addEventListener('click', () => showScreen('character-screen'));
document.getElementById('btn-how-to-play').addEventListener('click', () => showScreen('tutorial-screen'));

// Tutorial screen buttons
document.getElementById('btn-back-tutorial').addEventListener('click', () => showScreen('title-screen'));
document.getElementById('btn-tutorial-start').addEventListener('click', () => {
    if (engine.hasSave()) {
        engine.load();
        engine.updateStreak();
        enterGame();
    } else {
        showScreen('character-screen');
    }
});

if (engine.hasSave()) {
    document.getElementById('btn-continue').style.display = 'inline-block';
    document.getElementById('btn-continue').addEventListener('click', () => {
        engine.load();
        engine.updateStreak();
        enterGame();
    });
}

// === CHARACTER CREATION ===
let selectedHouse = null;

document.querySelectorAll('.faction-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.faction-card').forEach(c => {
            c.classList.remove('selected');
            c.style.backgroundImage = '';
        });
        card.classList.add('selected');
        // Set the banner image as background when selected
        const img = card.dataset.img;
        if (img) {
            card.style.backgroundImage = 'url(' + img + ')';
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
        }
        selectedHouse = card.dataset.house;
        document.getElementById('name-section').style.display = 'block';
        document.getElementById('player-name').focus();
    });
});

document.getElementById('btn-create').addEventListener('click', () => {
    const name = document.getElementById('player-name').value.trim();
    if (!name || !selectedHouse) return;
    engine.createCharacter(name, selectedHouse);
    enterGame();
});

document.getElementById('player-name').addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('btn-create').click();
});

// === ENTER GAME ===
function enterGame() {
    showScreen('game-screen');
    engine.updateHUD();
    renderWorldMap();
    renderActiveQuests();
    updateBossHP();
    renderLeaderboardShortcut();
    setTimeout(spawnMapCharacters, 300);
}

// === LEADERBOARD SHORTCUT ===
function renderLeaderboardShortcut() {
    const container = document.getElementById('lb-shortcut-list');
    
    // Build sorted list with player included
    const entries = [...GAME_DATA.leaderboard];
    entries.push({
        name: engine.player.name,
        house: engine.player.house,
        xp: engine.player.totalXP,
        isPlayer: true
    });
    entries.sort((a, b) => b.xp - a.xp);

    // Show top 5 + player if not in top 5
    let display = entries.slice(0, 5);
    const playerInTop5 = display.some(e => e.isPlayer);
    if (!playerInTop5) {
        const playerEntry = entries.find(e => e.isPlayer);
        display.push(playerEntry);
    }

    container.innerHTML = display.map((entry, i) => {
        const actualRank = entries.indexOf(entry);
        const medal = actualRank === 0 ? '🥇' : actualRank === 1 ? '🥈' : actualRank === 2 ? '🥉' : `#${actualRank + 1}`;
        const house = GAME_DATA.houses[entry.house];
        return `
            <div class="lb-mini-card ${entry.isPlayer ? 'is-you' : ''}">
                <div class="lb-mini-medal">${medal}</div>
                <div class="lb-mini-avatar" style="background:linear-gradient(135deg, ${house.color}, ${house.color}88);">${house.icon}</div>
                <div class="lb-mini-info">
                    <div class="lb-mini-name">${entry.name}${entry.isPlayer ? ' (You)' : ''}</div>
                    <div class="lb-mini-xp">${entry.xp.toLocaleString()} XP</div>
                </div>
            </div>
        `;
    }).join('');
}

document.getElementById('btn-lb-expand').addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    showSubScreen('Guild Leaderboard', renderLeaderboard);
});

// Leaderboard collapse/expand toggle
document.getElementById('btn-lb-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    const shortcut = document.getElementById('lb-shortcut');
    const btn = document.getElementById('btn-lb-toggle');
    shortcut.classList.toggle('collapsed');
    btn.textContent = shortcut.classList.contains('collapsed') ? '▲ Show' : '▼ Hide';
});

document.getElementById('lb-shortcut-header').addEventListener('click', () => {
    const shortcut = document.getElementById('lb-shortcut');
    const btn = document.getElementById('btn-lb-toggle');
    if (shortcut.classList.contains('collapsed')) {
        shortcut.classList.remove('collapsed');
        btn.textContent = '▼ Hide';
    }
});

// === WORLD MAP ===
function renderWorldMap() {
    const map = document.getElementById('world-map');
    
    // Landscape decorations (trees, rocks — spread across tall scrollable map)
    const decorations = [
        // Trees scattered
        { emoji: '🌲', x: 2, y: 5, size: 2.0, cls: 'tree' },
        { emoji: '🌲', x: 6, y: 15, size: 1.7, cls: 'tree' },
        { emoji: '🌳', x: 92, y: 8, size: 1.8, cls: 'tree' },
        { emoji: '🌴', x: 88, y: 90, size: 1.6, cls: 'tree' },
        { emoji: '🌲', x: 3, y: 92, size: 1.8, cls: 'tree' },
        { emoji: '🌳', x: 95, y: 45, size: 1.5, cls: 'tree' },
        { emoji: '🌲', x: 60, y: 92, size: 1.5, cls: 'tree' },
        { emoji: '🌴', x: 35, y: 5, size: 1.5, cls: 'tree' },
        { emoji: '🌲', x: 75, y: 88, size: 1.4, cls: 'tree' },
        { emoji: '🌳', x: 15, y: 35, size: 1.3, cls: 'tree' },
        { emoji: '🌲', x: 90, y: 60, size: 1.4, cls: 'tree' },
        // Rocks & crystals
        { emoji: '🪨', x: 1, y: 40, size: 1.4, cls: '' },
        { emoji: '💎', x: 94, y: 60, size: 1.0, cls: '' },
        { emoji: '🪨', x: 55, y: 92, size: 1.3, cls: '' },
        { emoji: '🪨', x: 90, y: 35, size: 1.2, cls: '' },
        { emoji: '💎', x: 15, y: 15, size: 0.9, cls: '' },
        { emoji: '🪨', x: 42, y: 5, size: 1.1, cls: '' },
        // Ground details
        { emoji: '🍄', x: 38, y: 90, size: 1.0, cls: '' },
        { emoji: '🌿', x: 10, y: 95, size: 1.1, cls: '' },
        { emoji: '🌾', x: 72, y: 95, size: 1.0, cls: '' },
        { emoji: '🌺', x: 55, y: 10, size: 1.0, cls: '' },
        { emoji: '🍄', x: 85, y: 70, size: 1.0, cls: '' },
        { emoji: '🌿', x: 5, y: 60, size: 1.0, cls: '' },
        { emoji: '🌺', x: 30, y: 92, size: 0.9, cls: '' },
        { emoji: '🌾', x: 48, y: 95, size: 0.9, cls: '' },
        // Mountains
        { emoji: '⛰️', x: 0, y: 2, size: 2.5, cls: '' },
        { emoji: '⛰️', x: 92, y: 80, size: 2.0, cls: '' },
        { emoji: '⛰️', x: 50, y: 0, size: 1.8, cls: '' },
    ];

    // Monsters — each has a unique level from 1 to 7
    const monsters = [
        { id: 'mon-slime', emoji: '👾', name: 'Error Slime', level: 1, x: 18, y: 75, game: 'trivia', difficulty: 'apprentice' },
        { id: 'mon-spider', emoji: '🕷️', name: 'Audit Crawler', level: 2, x: 35, y: 82, game: 'rapid-fire', difficulty: null },
        { id: 'mon-bat', emoji: '🦇', name: 'Denial Bat', level: 3, x: 35, y: 55, game: 'rapid-fire', difficulty: null },
        { id: 'mon-ghost', emoji: '👻', name: 'Phantom Gap', level: 4, x: 58, y: 40, game: 'word-scramble', difficulty: null },
        { id: 'mon-dragon', emoji: '🐲', name: 'Variance Drake', level: 5, x: 65, y: 68, game: 'match-pairs', difficulty: null },
        { id: 'mon-eye', emoji: '👁️', name: 'Oversight Eye', level: 6, x: 75, y: 38, game: 'trivia', difficulty: 'journeyman' },
        { id: 'mon-skull', emoji: '💀', name: 'Defect Lord', level: 7, x: 85, y: 15, game: 'trivia', difficulty: 'master', aggressive: true },
    ];

    // SVG path — winding road connecting nodes through the tall map
    const pathSVG = `
        <svg class="map-trail" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;">
            <!-- Main road path -->
            <path d="M 14 84 C 18 82 24 78 30 74 
                     C 36 70 28 60 24 52 
                     C 20 44 30 42 38 40 
                     C 44 38 48 50 50 62 
                     C 52 68 56 58 60 50 
                     C 64 42 50 35 48 32 
                     C 46 28 55 25 62 22 
                     C 68 19 72 22 75 25 
                     C 78 28 80 40 82 52" 
                  stroke="#4a2a10" stroke-width="1.4" fill="none" 
                  stroke-dasharray="3.5,2" opacity="0.6"/>
            <!-- Branch paths -->
            <path d="M 30 74 C 34 78 36 82 38 84" 
                  stroke="#4a2a10" stroke-width="0.9" fill="none" 
                  stroke-dasharray="2.5,2" opacity="0.4"/>
            <path d="M 72 22 C 78 18 82 16 86 17" 
                  stroke="#4a2a10" stroke-width="0.9" fill="none" 
                  stroke-dasharray="2.5,2" opacity="0.4"/>
        </svg>
    `;

    // Build HTML
    let html = pathSVG;

    // Decorations
    html += decorations.map(d => 
        `<div class="map-deco ${d.cls}" style="left:${d.x}%;top:${d.y}%;font-size:${d.size}rem;">${d.emoji}</div>`
    ).join('');

    // Monsters
    html += monsters.map(m => `
        <div class="map-monster" data-monster="${m.id}" data-game="${m.game}" data-diff="${m.difficulty || ''}" data-level="${m.level}" style="left:${m.x}%;top:${m.y}%;">
            <div class="monster-aura"></div>
            <div class="monster-sprite ${m.aggressive ? 'aggressive' : ''}">${m.emoji}</div>
            <div class="monster-label">${m.name} <span class="monster-level">Lv.${m.level}</span></div>
        </div>
    `).join('');

    // Map nodes
    html += GAME_DATA.mapNodes.map(node => `
        <div class="map-node" data-loc="${node.id}" style="left:${node.x}%; top:${node.y}%;">
            <div class="map-node-icon">
                ${node.icon}
                ${node.completed ? '<div class="map-node-check">✓</div>' : ''}
            </div>
            <div class="map-node-label">${node.name}</div>
        </div>
    `).join('');

    map.innerHTML = html;

    // Node click handlers
    map.querySelectorAll('.map-node').forEach(el => {
        el.addEventListener('click', () => openLocation(el.dataset.loc));
    });

    // Monster click handlers → launch mini-games
    map.querySelectorAll('.map-monster').forEach(el => {
        el.addEventListener('click', () => {
            const game = el.dataset.game;
            const diff = el.dataset.diff;
            const monsterName = el.querySelector('.monster-label').textContent;
            startMonsterBattle(game, diff, monsterName);
        });
    });
}

// Monster battle → opens mini-game directly
function startMonsterBattle(gameType, difficulty, monsterName) {
    showSubScreen(`⚔️ ${monsterName}`, (body) => {
        body.innerHTML = `
            <div style="text-align:center;margin-bottom:1rem;">
                <p style="color:var(--accent-red);font-family:'Cinzel',serif;font-weight:700;font-size:1rem;">Monster Encounter!</p>
                <p style="color:var(--text-muted);font-size:0.9rem;">Defeat the monster by answering correctly!</p>
            </div>
            <div id="monster-game-area"></div>
        `;
        const area = document.getElementById('monster-game-area');
        const onDone = () => enterGame();

        switch (gameType) {
            case 'trivia':
                if (difficulty) {
                    games.startTrivia(area, difficulty, onDone);
                } else {
                    showDifficultyPicker(area);
                }
                break;
            case 'word-scramble':
                games.startWordScramble(area, onDone);
                break;
            case 'rapid-fire':
                games.startRapidFire(area, onDone);
                break;
            case 'match-pairs':
                games.startMatchPairs(area, onDone);
                break;
            default:
                games.startTrivia(area, 'apprentice', onDone);
        }
    });
}

function openLocation(locId) {
    const node = GAME_DATA.mapNodes.find(n => n.id === locId);
    if (!node) return;

    showSubScreen(node.name, (body) => {
        const activityCards = {
            'trivia': { icon: '⚔️', name: 'Trivia Battle', desc: 'Test your knowledge', reward: '+10-50 XP' },
            'trivia-master': { icon: '🔥', name: 'Master Trivia', desc: 'Expert questions only', reward: '+50 XP each' },
            'word-scramble': { icon: '🔤', name: 'Word Scramble', desc: 'Unscramble RCM terms', reward: '+15 XP/word' },
            'rapid-fire': { icon: '⚡', name: 'Rapid Fire', desc: 'True/False speed round', reward: '+5 XP each' },
            'match-pairs': { icon: '🃏', name: 'Match Pairs', desc: 'Terms ↔ Definitions', reward: '+20 XP/match' },
            'library': { icon: '📚', name: 'Study Hall', desc: 'Read SOP materials', reward: '+10 XP/chapter' },
            'case-study': { icon: '📋', name: 'Case Study', desc: 'Multi-step real scenarios', reward: '+60-75 XP' },
            'wwyd': { icon: '🤔', name: 'What Would You Do?', desc: 'Judgment & Leadership Principles', reward: '+30 XP each' },
            'exam-mode': { icon: '📝', name: 'CRCR Practice Exam', desc: '25 questions, timed, all domains', reward: '+150 XP if pass' },
            'guild-quiz': { icon: '⚜️', name: 'Guild Knowledge', desc: 'AOM Guild of SMEs quiz', reward: '+15 XP each' }
        };

        body.innerHTML = `
            <div style="text-align:center;margin-bottom:1.5rem;">
                <div style="font-size:3rem;margin-bottom:0.5rem;">${node.icon}</div>
                <p style="color:var(--text-muted);font-size:1rem;">${node.desc}</p>
            </div>
            <div class="activity-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;">
                ${node.activities.map(act => {
                    const a = activityCards[act] || { icon: '❓', name: act, desc: '', reward: '' };
                    return `<div class="activity-card" data-act="${act}">
                        <div style="font-size:2rem;margin-bottom:0.4rem;">${a.icon}</div>
                        <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);margin-bottom:0.2rem;">${a.name}</h3>
                        <p style="font-size:0.75rem;color:var(--text-muted);">${a.desc}</p>
                        <div style="font-size:0.7rem;color:var(--gold-dark);font-weight:700;margin-top:0.3rem;">${a.reward}</div>
                    </div>`;
                }).join('')}
            </div>
        `;

        // Style activity cards
        body.querySelectorAll('.activity-card').forEach(card => {
            card.style.cssText = 'background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;transition:all 0.2s;';
            card.addEventListener('mouseenter', () => { card.style.borderColor = 'var(--gold-dark)'; card.style.transform = 'translateY(-2px)'; });
            card.addEventListener('mouseleave', () => { card.style.borderColor = 'rgba(201,168,76,0.2)'; card.style.transform = 'none'; });
            card.addEventListener('click', () => {
                const act = card.dataset.act;
                if (act === 'trivia') showDifficultyPicker(body);
                else if (act === 'trivia-master') games.startTrivia(body, 'master', () => openLocation(locId));
                else if (act === 'word-scramble') games.startWordScramble(body, () => openLocation(locId));
                else if (act === 'rapid-fire') games.startRapidFire(body, () => openLocation(locId));
                else if (act === 'match-pairs') games.startMatchPairs(body, () => openLocation(locId));
                else if (act === 'library') showLibrary(body, () => openLocation(locId));
                else if (act === 'case-study') games.startCaseStudy(body, () => openLocation(locId));
                else if (act === 'wwyd') games.startWWYD(body, () => openLocation(locId));
                else if (act === 'exam-mode') games.startExamMode(body, () => openLocation(locId));
                else if (act === 'guild-quiz') games.startGuildQuiz(body, () => openLocation(locId));
            });
        });
    });
}

function showDifficultyPicker(container) {
    container.innerHTML = `
        <div style="text-align:center;padding:1rem;">
            <h3 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:1.5rem;">Choose Difficulty</h3>
            <div style="display:flex;flex-direction:column;gap:0.8rem;max-width:300px;margin:0 auto;">
                <button class="btn-guild" data-d="apprentice" style="width:100%">🟢 Apprentice (+10 XP)</button>
                <button class="btn-guild" data-d="journeyman" style="width:100%">🟡 Journeyman (+25 XP)</button>
                <button class="btn-guild" data-d="master" style="width:100%">🔴 Master (+50 XP)</button>
            </div>
        </div>`;
    container.querySelectorAll('[data-d]').forEach(btn => {
        btn.addEventListener('click', () => games.startTrivia(container, btn.dataset.d, () => enterGame()));
    });
}

function showLibrary(container, onBack) {
    const chapters = [
        { title: 'Guild Purpose & Mission', content: 'Formalizes deep process knowledge to drive improvements in training, quality, and documentation.', xp: 10, faction: null },
        { title: 'Medical Coding: The Owl\'s Wisdom', content: 'Translating care into clarity through precise code assignment and documentation review.', xp: 15, faction: 'medical-coding' },
        { title: 'Charge Capture: The Griffin\'s Vigilance', content: 'Capturing every service rendered with speed and accuracy to sustain the mission.', xp: 15, faction: 'charge-capture' },
        { title: 'Collections: The Lion\'s Resolve', content: 'Following through with purpose to recover revenue and protect tomorrow\'s care.', xp: 15, faction: 'collections' },
        { title: 'Cash Application: The Dragon\'s Precision', content: 'Posting payments with exactness, reconciling ERAs, and powering the financial mission.', xp: 15, faction: 'cash-application' },
        { title: 'Patient Financial: The Bear\'s Compassion', content: 'Supporting every patient journey with care, clarity, and empathy at every touchpoint.', xp: 15, faction: 'patient-financial' },
        { title: 'The Guild Process', content: 'Initiation → Scoping → Drafting → Approvals → Documentation → Publication → Monitoring', xp: 15, faction: null },
        { title: 'FTRA Protocol (CHB-TQ-SOP-2026-003.V1)', content: 'Focus Targeted Remediation Audit: 30-min assessment. Rating: ✓ Current, ⚠ Needs Refresh, ✗ Gap. Target: 90%+', xp: 20, faction: null }
    ];

    container.innerHTML = `
        <h3 style="font-family:'Cinzel',serif;color:var(--gold);text-align:center;margin-bottom:1rem;">📚 Study Hall</h3>
        <p style="text-align:center;color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">Unlock faction chapters to watch their mini-movie! 🎬</p>
        ${chapters.map((ch, i) => `
            <div class="task-card" data-ch="${i}" style="cursor:pointer;">
                <div class="task-chibi">${ch.faction ? GAME_DATA.houses[ch.faction]?.icon || '📄' : '📄'}</div>
                <div class="task-info">
                    <div class="task-name">${ch.title}</div>
                    <div class="task-desc">${ch.content}</div>
                    ${ch.faction ? '<div style="font-size:0.65rem;color:var(--accent-blue);margin-top:0.2rem;">🎬 Unlocks mini-movie</div>' : ''}
                </div>
                <div class="task-xp" style="font-family:'Cinzel',serif;color:var(--gold-dark);">+${ch.xp} XP</div>
            </div>
        `).join('')}
        <div style="text-align:center;margin-top:1rem;"><button class="btn-guild btn-guild-alt" id="btn-lib-back">Back</button></div>`;

    container.querySelectorAll('.task-card[data-ch]').forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.ch);
            const ch = chapters[idx];
            engine.addXP(ch.xp, 'library'); engine.addGold(3); engine.updateHUD();
            card.style.opacity = '0.4'; card.style.pointerEvents = 'none';

            // If this chapter has a faction, play the mini-movie!
            if (ch.faction) {
                cinematicPlayer.play(ch.faction, () => {
                    // After cinematic ends, bonus XP
                    engine.addXP(10, 'library');
                    engine.showToast('🎬 +10 XP Cinematic Bonus!');
                    engine.updateHUD();
                });
            }
        });
    });
    document.getElementById('btn-lib-back').addEventListener('click', onBack);
}

// === ACTIVE QUESTS STRIP ===
function renderActiveQuests() {
    const container = document.getElementById('active-quests');
    
    // Build dynamic list based on what hasn't been done today
    const activeList = [];

    // Check daily quests
    const dailyQuests = GAME_DATA.quests.filter(q => q.type === 'daily');
    dailyQuests.forEach(q => {
        if (!engine.isQuestCompleted(q.id)) {
            activeList.push({ name: q.name, desc: q.description, xp: q.xp, status: 'Ready', chibi: q.icon });
        }
    });

    // Check weekly quests not done
    const weeklyQuests = GAME_DATA.quests.filter(q => q.type === 'weekly');
    weeklyQuests.forEach(q => {
        if (!engine.isQuestCompleted(q.id)) {
            const pending = engine.player.pendingTasks && engine.player.pendingTasks.some(t => t.taskId === q.id && t.status === 'pending');
            activeList.push({ name: q.name, desc: q.description, xp: q.xp, status: pending ? '⏳ Pending' : 'Available', chibi: q.icon });
        }
    });

    // Check legendary/epic quests not done
    const epicQuests = GAME_DATA.quests.filter(q => q.type === 'epic' || q.type === 'legendary');
    epicQuests.forEach(q => {
        if (!engine.isQuestCompleted(q.id)) {
            activeList.push({ name: q.name, desc: q.description, xp: q.xp, status: q.type === 'legendary' ? '⭐ LEGENDARY' : 'EPIC', chibi: q.icon });
        }
    });

    // Show top 5 most relevant
    const display = activeList.slice(0, 5);

    if (display.length === 0) {
        container.innerHTML = '<div class="quest-mini-card"><div class="qm-name" style="text-align:center;color:var(--text-muted);">All quests complete! 🎉</div></div>';
        return;
    }

    container.innerHTML = display.map((q, i) => `
        <div class="quest-mini-card" onclick="document.querySelectorAll('.nav-btn')[1].click();">
            <div class="qm-chibi">${q.chibi}</div>
            <div class="qm-header">
                <span class="qm-name">${q.name}</span>
                <span class="qm-xp">[+${q.xp} XP]</span>
            </div>
            <div class="qm-desc">${q.desc}</div>
            <div class="qm-status">${q.status}</div>
        </div>
    `).join('');
}

// === BOSS ===
function updateBossHP() {
    const hp = engine.player ? engine.player.bossHP : 75;
    document.getElementById('boss-hp-bar').style.width = `${hp}%`;
    document.getElementById('boss-hp-label').textContent = `${hp}% HP`;
}

document.getElementById('btn-raid').addEventListener('click', () => {
    document.getElementById('raid-modal').style.display = 'flex';
    document.getElementById('btn-close-raid').style.display = 'none';
    games.startBossRaid(document.getElementById('raid-game-area'), () => {
        document.getElementById('raid-modal').style.display = 'none';
        updateBossHP();
        engine.updateHUD();
    });
});

// === BOTTOM NAV ===
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const nav = btn.dataset.nav;
        switch (nav) {
            case 'map': enterGame(); break;
            case 'quests': showSubScreen('Quest Board', renderQuestBoard); break;
            case 'train': showSubScreen('Training Hub', renderTrainingHub); break;
            case 'guild': showSubScreen('Guild Hall', renderGuildHub); break;
            case 'profile': showSubScreen('Guild Profile', renderProfile); break;
        }
    });
});

// === SKILL TRAINING (Function-specific tracks from SME Development Program 2.0) ===
function renderSkillTraining(body) {
    const playerHouse = engine.player.house;
    const house = GAME_DATA.houses[playerHouse];
    const sharedTrack = GAME_DATA.skillTraining.shared;
    const functionTrack = GAME_DATA.skillTraining[playerHouse];

    if (!engine.player.completedSkills) engine.player.completedSkills = [];

    const completedCount = engine.player.completedSkills.length;
    const totalModules = sharedTrack.modules.length + (functionTrack ? functionTrack.modules.length : 0);
    const progressPct = Math.round((completedCount / totalModules) * 100);

    body.innerHTML = `
        <div style="text-align:center;margin-bottom:1.5rem;">
            <h3 style="font-family:'Cinzel',serif;color:var(--gold);font-size:1.3rem;">📖 SME Development Program 2.0</h3>
            <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.3rem;">Skill Training for <strong style="color:var(--text-light);">${house.name}</strong></p>
            <div style="margin-top:0.8rem;background:rgba(0,0,0,0.3);border-radius:10px;height:20px;position:relative;overflow:hidden;max-width:400px;margin-left:auto;margin-right:auto;">
                <div style="height:100%;width:${progressPct}%;background:linear-gradient(90deg, #c9a84c, #ffd700);border-radius:10px;transition:width 0.5s;"></div>
                <span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:0.65rem;font-weight:700;color:white;text-shadow:0 1px 2px rgba(0,0,0,0.8);">${completedCount}/${totalModules} Complete (${progressPct}%)</span>
            </div>
        </div>

        <!-- Function-Specific Track -->
        <div style="margin-bottom:1.5rem;">
            <h4 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:0.3rem;font-size:1rem;">${functionTrack.title}</h4>
            <p style="color:var(--text-muted);font-size:0.75rem;margin-bottom:0.8rem;">${functionTrack.description}</p>
            <div id="function-skills"></div>
        </div>

        <!-- Core Skills Track -->
        <div>
            <h4 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:0.3rem;font-size:1rem;">🛡️ ${sharedTrack.title}</h4>
            <p style="color:var(--text-muted);font-size:0.75rem;margin-bottom:0.8rem;">${sharedTrack.description}</p>
            <div id="shared-skills"></div>
        </div>
    `;

    // Render function-specific modules
    renderSkillModules(document.getElementById('function-skills'), functionTrack.modules);
    // Render shared modules
    renderSkillModules(document.getElementById('shared-skills'), sharedTrack.modules);
}

function renderSkillModules(container, modules) {
    container.innerHTML = modules.map(mod => {
        const done = engine.player.completedSkills && engine.player.completedSkills.includes(mod.id);
        const typeLabel = mod.type === 'e-learning' ? '📺 E-Learning' :
                          mod.type === 'ilt' ? '👥 Instructor-Led' :
                          mod.type === 'sop-study' ? '📄 SOP Study' :
                          mod.type === 'assignment' ? '✍️ Assignment' : '📖 Module';
        const typeColor = mod.type === 'e-learning' ? 'var(--accent-blue)' :
                          mod.type === 'ilt' ? 'var(--accent-orange)' :
                          mod.type === 'sop-study' ? 'var(--gold-dark)' :
                          mod.type === 'assignment' ? 'var(--accent-green)' : 'var(--text-muted)';

        return `
            <div class="task-card ${done ? 'completed' : ''}" data-skill="${mod.id}" style="cursor:pointer;">
                <div style="min-width:40px;text-align:center;">
                    ${done ? '<span style="font-size:1.5rem;">✅</span>' : '<span style="font-size:1.5rem;opacity:0.4;">⬜</span>'}
                </div>
                <div class="task-info">
                    <div class="task-name">${mod.name}</div>
                    <div class="task-desc">${mod.description}</div>
                    <div class="task-meta" style="margin-top:0.3rem;">
                        <span style="font-size:0.65rem;color:${typeColor};font-weight:700;">${typeLabel}</span>
                        <span style="font-size:0.6rem;color:var(--text-muted);">⏱️ ${mod.duration}</span>
                        <span class="task-xp">+${mod.xp} XP</span>
                    </div>
                </div>
                ${!done ? `<button class="task-action" data-skill-id="${mod.id}" data-xp="${mod.xp}" data-verify="${mod.verification || ''}" data-verify-label="${mod.verifyLabel || ''}">Complete</button>` : ''}
            </div>
        `;
    }).join('');

    // Click handlers
    container.querySelectorAll('.task-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const skillId = btn.dataset.skillId;
            const xp = parseInt(btn.dataset.xp);
            const needsVerify = btn.dataset.verify === 'email';
            const verifyLabel = btn.dataset.verifyLabel;

            if (needsVerify) {
                // Show verification input inline
                const card = btn.closest('.task-card');
                const existing = card.querySelector('.skill-verify-inline');
                if (existing) return; // Already showing

                const verifyDiv = document.createElement('div');
                verifyDiv.className = 'skill-verify-inline';
                verifyDiv.style.cssText = 'margin-top:0.6rem;padding:0.6rem;background:rgba(0,0,0,0.2);border-radius:6px;';
                verifyDiv.innerHTML = `
                    <div style="font-size:0.7rem;color:var(--gold-dark);font-weight:700;margin-bottom:0.3rem;">📧 ${verifyLabel}</div>
                    <input type="text" class="task-verify-input" placeholder="Paste proof here..." style="margin-bottom:0.4rem;">
                    <button class="task-submit-btn">Submit</button>
                `;
                card.querySelector('.task-info').appendChild(verifyDiv);

                verifyDiv.querySelector('.task-submit-btn').addEventListener('click', () => {
                    const input = verifyDiv.querySelector('.task-verify-input');
                    if (input.value.trim().length < 5) {
                        input.classList.add('error');
                        setTimeout(() => input.classList.remove('error'), 600);
                        return;
                    }
                    completeSkill(skillId, xp, input.value.trim());
                });

                verifyDiv.querySelector('.task-verify-input').addEventListener('keypress', (ev) => {
                    if (ev.key === 'Enter') verifyDiv.querySelector('.task-submit-btn').click();
                });
            } else {
                completeSkill(skillId, xp, null);
            }
        });
    });
}

function completeSkill(skillId, xp, proof) {
    if (!engine.player.completedSkills) engine.player.completedSkills = [];
    if (engine.player.completedSkills.includes(skillId)) return;

    engine.player.completedSkills.push(skillId);
    if (proof) {
        if (!engine.player.skillProofs) engine.player.skillProofs = {};
        engine.player.skillProofs[skillId] = { proof, date: new Date().toISOString() };
    }

    engine.addXP(xp, 'study');
    engine.addGold(Math.floor(xp / 3));
    engine.save();
    engine.updateHUD();

    // Re-render
    showSubScreen('Skill Training', renderSkillTraining);
}

// === TRAINING HUB (Skills + Tasks + Exam Mode + Error Review) ===
function renderTrainingHub(body) {
    const errorStats = engine.getErrorStats();
    body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-bottom:1rem;">
            <div class="activity-card" data-hub="skills" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">📖</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Skill Training</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">SME Development modules</p>
            </div>
            <div class="activity-card" data-hub="tasks" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">📋</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Tasks</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">Real work with proof</p>
            </div>
            <div class="activity-card" data-hub="errors" style="background:var(--bg-panel);border:2px solid ${errorStats.active > 0 ? 'rgba(231,76,60,0.4)' : 'rgba(201,168,76,0.2)'};border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">🔄</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Error Review</h3>
                <p style="font-size:0.7rem;color:${errorStats.active > 0 ? 'var(--accent-red)' : 'var(--text-muted)'};">${errorStats.active > 0 ? errorStats.active + ' items to review' : 'No errors yet'}</p>
            </div>
            <div class="activity-card" data-hub="exam" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">📝</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">CRCR Practice Exam</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">75 Qs · 90 min · Pass/Fail</p>
            </div>
        </div>
    `;
    body.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', () => {
            const hub = card.dataset.hub;
            if (hub === 'skills') showSubScreen('Skill Training', renderSkillTraining);
            else if (hub === 'tasks') showSubScreen('Tasks', renderTasks);
            else if (hub === 'errors') games.startErrorReview(body, () => renderTrainingHub(body));
            else if (hub === 'exam') games.startExamMode(body, () => renderTrainingHub(body));
        });
    });
}

// === GUILD HUB (Factions + Teams + Leaderboard + Shop) ===
function renderGuildHub(body) {
    body.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;">
            <div class="activity-card" data-hub="factions" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">⚔️</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Factions</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">Collaboration log</p>
            </div>
            <div class="activity-card" data-hub="teams" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">🏴</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Team Banners</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">Faction points race</p>
            </div>
            <div class="activity-card" data-hub="leaderboard" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">🏆</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Leaderboard</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">Guild rankings</p>
            </div>
            <div class="activity-card" data-hub="shop" style="background:var(--bg-panel);border:2px solid rgba(201,168,76,0.2);border-radius:12px;padding:1.2rem;text-align:center;cursor:pointer;">
                <div style="font-size:2rem;margin-bottom:0.4rem;">🛒</div>
                <h3 style="font-family:'Cinzel',serif;font-size:0.9rem;color:var(--text-light);">Shop</h3>
                <p style="font-size:0.7rem;color:var(--text-muted);">Badges & titles</p>
            </div>
        </div>
    `;
    body.querySelectorAll('.activity-card').forEach(card => {
        card.addEventListener('click', () => {
            const hub = card.dataset.hub;
            if (hub === 'factions') showSubScreen('Factions', renderFactions);
            else if (hub === 'teams') showSubScreen('Team Banners', renderTeams);
            else if (hub === 'leaderboard') showSubScreen('Guild Leaderboard', renderLeaderboard);
            else if (hub === 'shop') showSubScreen('Shop / Entitlements', renderShop);
        });
    });
}

// === QUEST BOARD ===
function renderQuestBoard(body) {
    body.innerHTML = `
        <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;text-align:center;">Tap a quest to see instructions. Game quests auto-complete. Work quests require proof.</p>
        <div id="quest-list-area"></div>
    `;

    const listArea = document.getElementById('quest-list-area');

    GAME_DATA.quests.forEach(q => {
        const done = engine.isQuestCompleted(q.id);
        const isGameQuest = ['q-trivia-daily', 'q-scramble', 'q-rapid', 'q-certification', 'q-streak-3'].includes(q.id);
        const pending = !isGameQuest && engine.player.pendingTasks && engine.player.pendingTasks.some(t => t.taskId === q.id && t.status === 'pending');

        // Check cooldown for game quests (1 hour)
        let onCooldown = false;
        let cooldownRemaining = '';
        if (isGameQuest && !done) {
            const lastPlay = engine.player.questCooldowns && engine.player.questCooldowns[q.id];
            if (lastPlay) {
                const elapsed = Date.now() - lastPlay;
                const cooldownMs = 60 * 60 * 1000; // 1 hour
                if (elapsed < cooldownMs) {
                    onCooldown = true;
                    const minsLeft = Math.ceil((cooldownMs - elapsed) / 60000);
                    cooldownRemaining = minsLeft >= 60 ? '1hr' : minsLeft + 'min';
                }
            }
        }

        let statusText = q.type.toUpperCase();
        let statusClass = q.type;
        if (done) { statusText = '✓ COMPLETED'; statusClass = 'done'; }
        else if (pending) { statusText = '⏳ PENDING REVIEW'; statusClass = 'pending'; }
        else if (onCooldown) { statusText = '⏱️ ' + cooldownRemaining; statusClass = 'cooldown'; }

        const card = document.createElement('div');
        card.className = `quest-card ${done ? 'completed' : ''} ${pending ? 'pending' : ''}`;
        card.innerHTML = `
            <div class="q-icon">${q.icon}</div>
            <div class="q-info">
                <div class="q-name">${q.name}</div>
                <div class="q-desc">${q.description}</div>
                <div class="q-type ${statusClass}">${statusText}</div>
                <div class="q-instructions" style="display:none;margin-top:0.5rem;padding:0.5rem;background:rgba(0,0,0,0.2);border-radius:6px;border-left:2px solid var(--gold-dark);">
                    <div style="font-size:0.65rem;color:var(--gold-dark);font-weight:700;margin-bottom:0.2rem;">How to Complete:</div>
                    <div style="font-size:0.7rem;color:var(--text-muted);line-height:1.5;">${q.instructions}</div>
                </div>
            </div>
            <div class="q-xp">+${q.xp} XP</div>
            ${!done && !pending && !onCooldown ? `<button class="quest-go-btn" data-qid="${q.id}" data-xp="${q.xp}" data-game="${isGameQuest}">${isGameQuest ? 'GO' : '📧'}</button>` : ''}
        `;

        // Tap to show/hide instructions
        card.addEventListener('click', (e) => {
            if (e.target.closest('.quest-go-btn') || e.target.closest('.quest-proof-section')) return;
            const instructions = card.querySelector('.q-instructions');
            const isShowing = instructions.style.display === 'block';
            // Hide all others
            listArea.querySelectorAll('.q-instructions').forEach(el => el.style.display = 'none');
            instructions.style.display = isShowing ? 'none' : 'block';
        });

        listArea.appendChild(card);
    });

    // Quest action handlers
    listArea.querySelectorAll('.quest-go-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const qid = btn.dataset.qid;
            const xp = parseInt(btn.dataset.xp);
            const isGame = btn.dataset.game === 'true';

            if (isGame) {
                // Game quests: launch the actual mini-game, auto-complete on success
                if (!engine.player.questCooldowns) engine.player.questCooldowns = {};

                const onQuestGameComplete = (score, threshold) => {
                    if (score >= threshold) {
                        engine.completeQuest(qid);
                        engine.player.questCooldowns[qid] = Date.now();
                        engine.addXP(xp, 'quest');
                        engine.addGold(Math.floor(xp / 3));
                        engine.save();
                        engine.updateHUD();
                        engine.showToast('✓ Quest Complete! +' + xp + ' XP');
                    } else {
                        engine.player.questCooldowns[qid] = Date.now();
                        engine.save();
                        engine.showToast('Quest not met. Try again in 1 hour.');
                    }
                    showSubScreen('Quest Board', renderQuestBoard);
                };

                // Launch the appropriate mini-game based on quest
                switch (qid) {
                    case 'q-trivia-daily':
                        showSubScreen('Daily Knowledge Check', (gameBody) => {
                            const origComplete = engine.player.triviaCompleted;
                            games.startTrivia(gameBody, 'apprentice', () => {
                                const played = engine.player.triviaCompleted > origComplete;
                                onQuestGameComplete(played ? 1 : 0, 1);
                            });
                        });
                        break;
                    case 'q-scramble':
                        showSubScreen('Word Smith Challenge', (gameBody) => {
                            const origWords = engine.player.wordsUnscrambled || 0;
                            games.startWordScramble(gameBody, () => {
                                const solved = (engine.player.wordsUnscrambled || 0) - origWords;
                                onQuestGameComplete(solved, 3);
                            });
                        });
                        break;
                    case 'q-rapid':
                        showSubScreen('Lightning Round', (gameBody) => {
                            const origRapid = engine.player.rapidFireCorrect || 0;
                            games.startRapidFire(gameBody, () => {
                                const scored = (engine.player.rapidFireCorrect || 0) - origRapid;
                                onQuestGameComplete(scored, 7);
                            });
                        });
                        break;
                    case 'q-certification':
                        showSubScreen('Certification Climb', (gameBody) => {
                            const origPerfects = engine.player.perfectScores || 0;
                            games.startTrivia(gameBody, 'master', () => {
                                const gotPerfect = (engine.player.perfectScores || 0) > origPerfects;
                                onQuestGameComplete(gotPerfect ? 1 : 0, 1);
                            });
                        });
                        break;
                    case 'q-streak-3':
                        // Auto-check: already validated by streak count
                        if (engine.player.streak >= 3) {
                            onQuestGameComplete(3, 3);
                        } else {
                            engine.showToast('Keep logging in! Streak: ' + engine.player.streak + '/3');
                        }
                        break;
                    default:
                        // Fallback: launch trivia
                        showSubScreen('Challenge', (gameBody) => {
                            games.startTrivia(gameBody, 'apprentice', () => {
                                onQuestGameComplete(1, 1);
                            });
                        });
                }
            } else {
                // Work quests need proof
                const card = btn.closest('.quest-card');
                if (card.querySelector('.quest-proof-section')) return;

                const proofDiv = document.createElement('div');
                proofDiv.className = 'quest-proof-section';
                proofDiv.style.cssText = 'width:100%;margin-top:0.6rem;padding:0.6rem;background:rgba(0,0,0,0.2);border-radius:6px;';
                proofDiv.innerHTML = `
                    <div style="font-size:0.7rem;color:var(--gold-dark);font-weight:700;margin-bottom:0.3rem;">Submit proof (email subject, link, or confirmation):</div>
                    <input type="text" class="task-verify-input" placeholder="Paste proof here..." style="margin-bottom:0.4rem;">
                    <button class="task-submit-btn">Submit for Review</button>
                `;
                card.querySelector('.q-info').appendChild(proofDiv);

                proofDiv.querySelector('.task-submit-btn').addEventListener('click', () => {
                    const input = proofDiv.querySelector('.task-verify-input');
                    const val = input.value.trim();
                    if (val.length < 5) { input.classList.add('error'); setTimeout(() => input.classList.remove('error'), 600); return; }

                    engine.submitTaskForReview(qid, val, xp, Math.floor(xp / 3), 'quest');
                    engine.save();
                    renderQuestBoard(body);
                });
            }
        });
    });
}

// === TASKS (with chibi images, instructions, and email verification) ===
function renderTasks(body) {
    body.innerHTML = `
        <div style="margin-bottom:1rem;padding:0.8rem;background:var(--bg-dark);border:1px solid var(--gold-dark);border-radius:10px;">
            <h4 style="font-size:0.8rem;color:var(--gold);margin-bottom:0.3rem;">📋 Focus Targeted Remediation Audit Protocol</h4>
            <p style="font-size:0.7rem;color:var(--text-muted);">SOP: CHB-TQ-SOP-2026-003.V1 | Path: TQ_Internal_SOPs</p>
        </div>
        <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:1rem;text-align:center;">💡 Click a task to expand instructions. Submit proof to earn XP.</p>
        <div id="tasks-list"></div>
    `;

    const list = document.getElementById('tasks-list');
    GAME_DATA.tasks.forEach(task => {
        const done = engine.isTaskCompleted(task.id);
        const pending = engine.isTaskPending(task.id);
        const taskStatus = engine.getTaskStatus(task.id);
        const rejected = taskStatus === 'rejected';

        const card = document.createElement('div');
        card.className = `task-card has-tooltip ${done ? 'completed' : ''} ${pending ? 'pending' : ''} ${rejected ? 'rejected' : ''}`;
        card.style.cursor = 'pointer';

        let statusBadge = '';
        let statusClass = 'new';
        let statusText = 'New';
        if (done) { statusClass = 'done'; statusText = '✓ Approved'; }
        else if (pending) { statusClass = 'pending'; statusText = '⏳ Pending Review'; }
        else if (rejected) { statusClass = 'rejected'; statusText = '✗ Resubmit Required'; }
        else if (task.status === 'progress') { statusClass = 'progress'; statusText = 'In Progress'; }

        card.innerHTML = `
            <div class="task-chibi">${task.chibi}</div>
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-desc">${task.description}</div>
                ${task.sop ? `<div style="font-size:0.65rem;color:var(--accent-blue);margin-top:0.2rem;">📎 ${task.sop}</div>` : ''}
                <div class="task-meta">
                    <span class="task-xp">+${task.xp} XP · +${task.gold} ⚜️</span>
                    <span class="task-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            ${done ? '<span style="font-size:1.5rem;">✅</span>' : pending ? '<span style="font-size:1.5rem;">⏳</span>' : ''}
            <div class="tooltip">
                <div class="tooltip-title">📖 Instructions</div>
                <div class="tooltip-text">${task.instructions}</div>
            </div>
        `;

        if (!done && !pending) {
            card.addEventListener('click', () => expandTask(task, body));
        }

        list.appendChild(card);
    });
}

function expandTask(task, body) {
    const done = engine.isTaskCompleted(task.id);
    if (done) return;

    body.innerHTML = `
        <button class="btn-back" id="btn-back-tasks" style="margin-bottom:1rem;">← Back to Tasks</button>
        <div class="task-expanded">
            <div style="display:flex;align-items:center;gap:1rem;margin-bottom:0.8rem;">
                <div style="font-size:3rem;">${task.chibi}</div>
                <div>
                    <div class="task-name" style="font-size:1.1rem;">${task.name}</div>
                    <div class="task-desc">${task.description}</div>
                    ${task.sop ? `<div style="font-size:0.7rem;color:var(--accent-blue);margin-top:0.2rem;">📎 ${task.sop}</div>` : ''}
                    <div class="task-meta" style="margin-top:0.3rem;">
                        <span class="task-xp">+${task.xp} XP · +${task.gold} ⚜️</span>
                    </div>
                </div>
            </div>
            <div class="task-instructions">${task.instructions}</div>
            <div class="task-verify-section">
                <div class="task-verify-label">
                    <span class="verify-icon">📧</span>
                    ${task.verifyLabel}
                </div>
                <input type="text" class="task-verify-input" id="task-proof-input" 
                    placeholder="e.g. FTRA Complete - John Smith - 05/12/2026" autocomplete="off">
                <div style="display:flex;align-items:center;gap:0.8rem;">
                    <button class="task-submit-btn" id="btn-submit-task">Submit & Complete</button>
                    <span class="verify-hint">Paste your email subject, link, or confirmation ID</span>
                </div>
                <div id="task-verify-feedback" style="margin-top:0.5rem;font-size:0.75rem;min-height:20px;"></div>
            </div>
        </div>
    `;

    document.getElementById('btn-back-tasks').addEventListener('click', () => renderTasks(body));

    document.getElementById('btn-submit-task').addEventListener('click', () => {
        const input = document.getElementById('task-proof-input');
        const feedback = document.getElementById('task-verify-feedback');
        const value = input.value.trim();

        if (!value || value.length < 5) {
            input.classList.add('error');
            input.classList.remove('success');
            feedback.innerHTML = '<span style="color:var(--accent-red);">⚠️ Please provide valid proof (email subject, link, or confirmation).</span>';
            setTimeout(() => input.classList.remove('error'), 600);
            return;
        }

        // Submit for review (PENDING state — points NOT awarded yet)
        input.classList.remove('error');
        input.classList.add('success');
        
        engine.submitTaskForReview(task.id, value, task.xp, task.gold, task.category);
        engine.save();

        // Disable input
        input.disabled = true;
        document.getElementById('btn-submit-task').disabled = true;

        feedback.innerHTML = '<span style="color:var(--accent-blue);">📋 Submitted for review. XP will be awarded after Guild Founder approval.</span>';

        // Return to tasks after delay
        setTimeout(() => renderTasks(body), 2500);
    });

    // Enter key support
    document.getElementById('task-proof-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') document.getElementById('btn-submit-task').click();
    });
}

// === FACTIONS (with collaboration tracking) ===
function renderFactions(body) {
    const p = engine.player;
    if (!p.collaborations) p.collaborations = [];

    body.innerHTML = `
        <h3 style="font-family:'Cinzel',serif;color:var(--gold);text-align:center;margin-bottom:0.3rem;">⚔️ Guild Factions</h3>
        <p style="text-align:center;color:var(--text-muted);font-size:0.75rem;margin-bottom:1.2rem;">Track cross-team collaboration and faction synergy</p>
        
        ${Object.entries(GAME_DATA.houses).map(([id, h]) => {
            const isPlayer = p.house === id;
            const collabCount = p.collaborations.filter(c => c.faction === id).length;
            return `
                <div class="quest-card" style="${isPlayer ? 'border-color:var(--gold);background:rgba(255,215,0,0.03);' : ''}">
                    <div class="q-icon" style="font-size:2rem;">${h.icon}</div>
                    <div class="q-info">
                        <div class="q-name">${h.name} ${isPlayer ? '(Your Faction)' : ''}</div>
                        <div class="q-desc">${Object.entries(h.stats).filter(([,v]) => v > 0).map(([k,v]) => `+${v} ${k}`).join(' · ')}</div>
                        <div style="font-size:0.65rem;color:var(--accent-blue);margin-top:0.2rem;">
                            🤝 Collaborations logged: <strong>${collabCount}</strong>
                        </div>
                    </div>
                </div>`;
        }).join('')}

        <!-- Collaboration Log Section -->
        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,0.2);">
            <h4 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:0.8rem;">🤝 Log a Collaboration</h4>
            <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.8rem;">Record when you work with another faction on a shared initiative, cross-team audit, or joint training session.</p>
            
            <div class="task-verify-section">
                <div style="margin-bottom:0.6rem;">
                    <label style="font-size:0.7rem;font-weight:700;color:var(--gold-dark);display:block;margin-bottom:0.3rem;">Which faction did you collaborate with?</label>
                    <select id="collab-faction" style="font-family:'Open Sans',Verdana,Arial,sans-serif;font-size:0.8rem;width:100%;padding:0.5rem;background:var(--bg-dark);border:2px solid rgba(201,168,76,0.3);border-radius:6px;color:var(--text-light);">
                        <option value="">-- Select Faction --</option>
                        ${Object.entries(GAME_DATA.houses).filter(([id]) => id !== p.house).map(([id, h]) => 
                            `<option value="${id}">${h.icon} ${h.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="margin-bottom:0.6rem;">
                    <label style="font-size:0.7rem;font-weight:700;color:var(--gold-dark);display:block;margin-bottom:0.3rem;">What did you collaborate on?</label>
                    <select id="collab-type" style="font-family:'Open Sans',Verdana,Arial,sans-serif;font-size:0.8rem;width:100%;padding:0.5rem;background:var(--bg-dark);border:2px solid rgba(201,168,76,0.3);border-radius:6px;color:var(--text-light);">
                        <option value="">-- Select Type --</option>
                        <option value="cross-audit">Cross-Team Audit</option>
                        <option value="joint-training">Joint Training Session</option>
                        <option value="sop-review">SOP Peer Review</option>
                        <option value="deep-dive">Shared Deep Dive</option>
                        <option value="mentorship">Cross-Faction Mentorship</option>
                        <option value="calibration">Calibration Session</option>
                        <option value="close-loop">Close-the-Loop Review</option>
                        <option value="other">Other Collaboration</option>
                    </select>
                </div>
                <div style="margin-bottom:0.6rem;">
                    <label style="font-size:0.7rem;font-weight:700;color:var(--gold-dark);display:block;margin-bottom:0.3rem;">Brief description or proof (email/link):</label>
                    <input type="text" id="collab-proof" class="task-verify-input" placeholder="e.g. Joint PFS-Collections audit on 05/12..." style="margin-bottom:0;">
                </div>
                <button class="task-submit-btn" id="btn-log-collab">Log Collaboration (+30 XP)</button>
                <div id="collab-feedback" style="margin-top:0.4rem;font-size:0.75rem;min-height:18px;"></div>
            </div>
        </div>

        <!-- Collaboration History -->
        ${p.collaborations.length > 0 ? `
            <div style="margin-top:1.2rem;">
                <h4 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:0.6rem;">📜 Collaboration History</h4>
                ${p.collaborations.slice(-5).reverse().map(c => {
                    const faction = GAME_DATA.houses[c.faction];
                    return `
                        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                            <span style="font-size:1.2rem;">${faction.icon}</span>
                            <div style="flex:1;">
                                <div style="font-size:0.75rem;color:var(--text-light);font-weight:600;">${c.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                <div style="font-size:0.6rem;color:var(--text-muted);">${c.proof} · ${new Date(c.date).toLocaleDateString()}</div>
                            </div>
                            <span style="font-size:0.6rem;color:var(--gold-dark);">+30 XP</span>
                        </div>`;
                }).join('')}
            </div>
        ` : ''}
    `;

    // Log collaboration handler
    document.getElementById('btn-log-collab').addEventListener('click', () => {
        const faction = document.getElementById('collab-faction').value;
        const type = document.getElementById('collab-type').value;
        const proof = document.getElementById('collab-proof').value.trim();
        const feedback = document.getElementById('collab-feedback');

        if (!faction || !type || proof.length < 3) {
            feedback.innerHTML = '<span style="color:var(--accent-red);">⚠️ Please fill in all fields.</span>';
            return;
        }

        // Save collaboration
        if (!engine.player.collaborations) engine.player.collaborations = [];
        engine.player.collaborations.push({
            faction,
            type,
            proof,
            date: new Date().toISOString()
        });

        engine.addXP(30, 'collaboration');
        engine.addGold(15);
        engine.save();
        engine.updateHUD();

        feedback.innerHTML = '<span style="color:var(--accent-green);">✓ Collaboration logged! +30 XP, +15 Gold</span>';

        // Re-render after short delay
        setTimeout(() => renderFactions(body), 1500);
    });
}

// === PROFILE ===
function renderProfile(body) {
    const p = engine.player;
    const rank = engine.getRankInfo();
    const pendingTasks = engine.getPendingTasks();

    body.innerHTML = `
        <div class="profile-hero">
            <div class="ph-avatar">${GAME_DATA.houses[p.house].iconHtml || GAME_DATA.houses[p.house].icon}</div>
            <div class="ph-name">${p.name}</div>
            <div class="ph-rank">${rank.currentRank.title}</div>
            <div class="ph-house">${GAME_DATA.houses[p.house].name}</div>
            <div class="stat-grid">
                <div class="stat-cell"><div class="sv">${p.totalXP}</div><div class="sl">Total XP</div></div>
                <div class="stat-cell"><div class="sv">${p.gold}</div><div class="sl">Gold</div></div>
                <div class="stat-cell"><div class="sv">${p.level}</div><div class="sl">Level</div></div>
                <div class="stat-cell"><div class="sv">${p.streak}🔥</div><div class="sl">Streak</div></div>
                <div class="stat-cell"><div class="sv">${p.triviaCompleted}</div><div class="sl">Trivia</div></div>
                <div class="stat-cell"><div class="sv">${p.tasksCompleted}</div><div class="sl">Tasks</div></div>
                <div class="stat-cell"><div class="sv">${p.minigamesCompleted}</div><div class="sl">Games</div></div>
                <div class="stat-cell"><div class="sv">${p.perfectScores}</div><div class="sl">Perfects</div></div>
                <div class="stat-cell"><div class="sv">${p.questsCompleted}</div><div class="sl">Quests</div></div>
            </div>
        </div>

        <!-- Admin: Task Review Panel (Guild Founder) -->
        <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(201,168,76,0.2);">
            <h4 style="font-family:'Cinzel',serif;color:var(--gold);margin-bottom:0.5rem;">🛡️ Task Review (Guild Founder)</h4>
            <p style="font-size:0.7rem;color:var(--text-muted);margin-bottom:0.8rem;">Review submitted tasks. Approve to award XP or reject to request resubmission.</p>
            ${pendingTasks.length === 0 ? 
                '<p style="font-size:0.8rem;color:var(--text-muted);text-align:center;padding:1rem;">No pending submissions.</p>' :
                '<div id="admin-review-list"></div>'
            }
        </div>

        <!-- Submission History -->
        ${p.pendingTasks && p.pendingTasks.length > 0 ? `
            <div style="margin-top:1.2rem;">
                <h4 style="font-family:'Cinzel',serif;color:var(--gold);font-size:0.85rem;margin-bottom:0.5rem;">📜 Submission History</h4>
                ${p.pendingTasks.slice(-5).reverse().map(t => {
                    const taskData = GAME_DATA.tasks.find(td => td.id === t.taskId);
                    const statusIcon = t.status === 'approved' ? '✅' : t.status === 'rejected' ? '❌' : '⏳';
                    const statusColor = t.status === 'approved' ? 'var(--accent-green)' : t.status === 'rejected' ? 'var(--accent-red)' : 'var(--accent-blue)';
                    return `
                        <div style="display:flex;align-items:center;gap:0.6rem;padding:0.4rem 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                            <span style="font-size:1.2rem;">${statusIcon}</span>
                            <div style="flex:1;">
                                <div style="font-size:0.75rem;color:var(--text-light);font-weight:600;">${taskData ? taskData.name : t.taskId}</div>
                                <div style="font-size:0.6rem;color:var(--text-muted);">${new Date(t.submittedAt).toLocaleDateString()} · <span style="color:${statusColor}">${t.status.toUpperCase()}</span></div>
                            </div>
                            <span style="font-size:0.65rem;color:var(--gold-dark);">+${t.xp} XP</span>
                        </div>`;
                }).join('')}
            </div>
        ` : ''}

        <div style="text-align:center;margin-top:1.5rem;">
            <button class="btn-guild btn-guild-alt" id="btn-reset" style="font-size:0.8rem;">Reset Game</button>
        </div>`;

    // Render admin review cards
    if (pendingTasks.length > 0) {
        const reviewList = document.getElementById('admin-review-list');
        reviewList.innerHTML = pendingTasks.map(t => {
            const taskData = GAME_DATA.tasks.find(td => td.id === t.taskId);
            return `
                <div class="admin-review-card">
                    <div class="review-header">
                        <span style="font-size:1.5rem;">${taskData ? taskData.chibi : '📋'}</span>
                        <div>
                            <div style="font-family:'Cinzel',serif;font-size:0.85rem;color:var(--text-light);font-weight:700;">${taskData ? taskData.name : t.taskId}</div>
                            <div style="font-size:0.65rem;color:var(--gold-dark);">+${t.xp} XP · +${t.gold} Gold</div>
                        </div>
                    </div>
                    <div class="review-proof">📧 "${t.proof}"</div>
                    <div class="review-meta">Submitted: ${new Date(t.submittedAt).toLocaleString()}</div>
                    <div class="review-actions">
                        <button class="review-approve-btn" data-task-id="${t.taskId}">✓ Approve</button>
                        <button class="review-reject-btn" data-task-id="${t.taskId}">✗ Reject</button>
                    </div>
                </div>`;
        }).join('');

        // Approve handlers
        reviewList.querySelectorAll('.review-approve-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                engine.approveTask(btn.dataset.taskId);
                engine.updateHUD();
                engine.showToast('✅ Task approved! XP awarded.');
                renderProfile(body);
            });
        });

        // Reject handlers
        reviewList.querySelectorAll('.review-reject-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reason = prompt('Rejection reason (optional):') || 'Proof insufficient. Please resubmit.';
                engine.rejectTask(btn.dataset.taskId, reason);
                engine.showToast('Task returned for resubmission.');
                renderProfile(body);
            });
        });
    }

    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm('Erase all progress?')) { localStorage.removeItem(engine.saveKey); location.reload(); }
    });
}

// === SHOP ===
function renderShop(body) {
    body.innerHTML = `
        <p style="text-align:center;color:var(--text-muted);margin-bottom:1rem;">Your Gold: <strong style="color:var(--gold);">${engine.player.gold} ⚜️</strong></p>
        ${GAME_DATA.shopItems.map(item => {
            const owned = engine.player.purchasedItems.includes(item.id);
            return `
                <div class="shop-card">
                    <div class="shop-icon">${item.icon}</div>
                    <div class="shop-info"><div class="shop-name">${item.name}</div><div class="shop-desc">${item.description}</div></div>
                    ${owned ? '<button class="shop-buy owned">Owned</button>' : `<button class="shop-buy" data-id="${item.id}" data-cost="${item.cost}">${item.cost} ⚜️</button>`}
                </div>`;
        }).join('')}`;

    body.querySelectorAll('.shop-buy:not(.owned)').forEach(btn => {
        btn.addEventListener('click', () => {
            if (engine.spendGold(parseInt(btn.dataset.cost))) {
                engine.player.purchasedItems.push(btn.dataset.id);
                engine.save(); engine.updateHUD();
                engine.showToast('Purchased!');
                renderShop(body);
            } else { engine.showToast('Not enough gold!'); }
        });
    });
}

// === TEAMS (Banner-style team points display) ===
function renderTeams(body) {
    const teams = GAME_DATA.teamPoints;
    // Sort by points descending
    const sorted = Object.entries(teams).sort((a, b) => b[1].points - a[1].points);
    const playerTeam = engine.player.house;

    // Add player's XP contribution to their team
    const playerContribution = engine.player.totalXP;

    body.innerHTML = `
        <div class="teams-header">
            <h3 style="font-family:'Cinzel Decorative',cursive;color:var(--gold);text-align:center;font-size:1.4rem;margin-bottom:0.2rem;">Realm of Excellence</h3>
            <p style="text-align:center;color:var(--text-muted);font-size:0.8rem;margin-bottom:0.3rem;">Guild of SMEs · One Purpose. Patients First.</p>
            <p style="text-align:center;color:var(--gold-dark);font-size:0.7rem;font-family:'Cinzel',serif;letter-spacing:1px;margin-bottom:1.5rem;">Integrity · Ownership · Excellence · Empathy · Together</p>
        </div>
        <div class="team-banners">
            ${sorted.map(([id, team], rank) => {
                const house = GAME_DATA.houses[id];
                const isPlayerTeam = id === playerTeam;
                const totalPoints = isPlayerTeam ? team.points + playerContribution : team.points;
                return `
                    <div class="team-banner-card ${team.bannerColor} ${isPlayerTeam ? 'your-team' : ''}">
                        <div class="banner-rank">${rank === 0 ? '👑' : '#' + (rank + 1)}</div>
                        <div class="banner-flag">
                            <div class="banner-flag-top"></div>
                            <div class="banner-crest">${house.icon}</div>
                            <div class="banner-flag-bottom"></div>
                        </div>
                        <div class="banner-info">
                            <div class="banner-team-name">${house.name}</div>
                            <div class="banner-motto">${team.motto}</div>
                            <div class="banner-stats-row">
                                <span class="banner-points">⭐ ${totalPoints.toLocaleString()} pts</span>
                                <span class="banner-members">👥 ${team.members} members</span>
                            </div>
                            ${isPlayerTeam ? '<div class="banner-you-badge">⚜️ Your Team</div>' : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="margin-top:1.5rem;padding:1rem;background:var(--bg-dark);border:1px solid rgba(201,168,76,0.2);border-radius:10px;">
            <h4 style="font-family:'Cinzel',serif;color:var(--gold);font-size:0.85rem;margin-bottom:0.5rem;">📊 How Team Points Work</h4>
            <ul style="font-size:0.75rem;color:var(--text-muted);list-style:none;line-height:1.8;">
                <li>• Every XP you earn adds to your team's total</li>
                <li>• Completing tasks, quests, and raids all contribute</li>
                <li>• Cross-team collaborations give bonus points to both teams</li>
                <li>• Top team each quarter earns the <strong style="color:var(--gold);">Guild Champion Banner</strong></li>
            </ul>
        </div>
    `;
}

// === LEADERBOARD ===
function renderLeaderboard(body) {
    // Combine NPC leaderboard with player
    const entries = [...GAME_DATA.leaderboard];
    entries.push({
        name: engine.player.name,
        house: engine.player.house,
        xp: engine.player.totalXP,
        rank: engine.getRankInfo().currentRank.title,
        title: 'Guild Adventurer',
        isPlayer: true
    });
    entries.sort((a, b) => b.xp - a.xp);

    body.innerHTML = `
        <div class="leaderboard-header">
            <h3 style="font-family:'Cinzel',serif;color:var(--gold);text-align:center;margin-bottom:0.3rem;">🏆 Guild Rankings</h3>
            <p style="text-align:center;color:var(--text-muted);font-size:0.75rem;margin-bottom:1.2rem;">Top performers across all factions</p>
        </div>
        <div class="leaderboard-list">
            ${entries.map((entry, i) => {
                const house = GAME_DATA.houses[entry.house];
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
                const isPlayer = entry.isPlayer;
                return `
                    <div class="lb-row ${isPlayer ? 'lb-player' : ''}" ${isPlayer ? 'style="border-color:var(--gold);background:rgba(255,215,0,0.05);"' : ''}>
                        <div class="lb-rank">${medal}</div>
                        <div class="lb-avatar-wrap">
                            <div class="lb-avatar" style="background:linear-gradient(135deg, ${house.color}, ${house.color}88);">${house.icon}</div>
                            <div class="lb-walking-char" data-house="${entry.house}"></div>
                        </div>
                        <div class="lb-info">
                            <div class="lb-name">${entry.name} ${isPlayer ? '(You)' : ''}</div>
                            <div class="lb-title">${entry.title}</div>
                            <div class="lb-rank-text">${entry.rank} · ${house.name}</div>
                        </div>
                        <div class="lb-xp">${entry.xp.toLocaleString()} ⭐</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Animate walking characters
    animateLeaderboardChars();
}

function animateLeaderboardChars() {
    document.querySelectorAll('.lb-walking-char').forEach(el => {
        const house = el.dataset.house;
        const houseData = GAME_DATA.houses[house];
        el.textContent = houseData.icon;
        // Random walk offset
        const delay = Math.random() * 2;
        el.style.animationDelay = `${delay}s`;
    });
}

// === MOVING CHARACTERS ON MAP ===
function spawnMapCharacters() {
    const map = document.getElementById('world-map');
    if (!map) return;

    // Remove existing wanderers
    map.querySelectorAll('.map-wanderer').forEach(el => el.remove());

    // Spawn only 2 NPC wanderers to keep it clean
    const wanderers = GAME_DATA.leaderboard.slice(0, 2);
    const safeSpots = [
        { x: 40, y: 20 },
        { x: 60, y: 75 },
    ];
    wanderers.forEach((npc, i) => {
        const house = GAME_DATA.houses[npc.house];
        const spot = safeSpots[i];

        const el = document.createElement('div');
        el.className = 'map-wanderer';
        el.style.left = `${spot.x}%`;
        el.style.top = `${spot.y}%`;
        el.style.animationDelay = `${i * 2}s`;
        el.style.animationDuration = `${10 + i * 3}s`;
        el.innerHTML = `<span class="wanderer-sprite">${house.icon}</span><span class="wanderer-name">${npc.name.split(' ')[0]}</span>`;
        map.appendChild(el);
    });

    // Player character near Training Mesa
    const playerHouse = GAME_DATA.houses[engine.player.house];
    const playerEl = document.createElement('div');
    playerEl.className = 'map-wanderer player-wanderer';
    playerEl.style.left = '10%';
    playerEl.style.top = '88%';
    playerEl.innerHTML = `<span class="wanderer-sprite">${playerHouse.icon}</span><span class="wanderer-name" style="color:var(--gold);">${engine.player.name}</span>`;
    map.appendChild(playerEl);
}

// === BACK BUTTON ===
document.getElementById('btn-back-sub').addEventListener('click', () => enterGame());

// === LEVEL UP MODAL ===
document.getElementById('btn-close-levelup').addEventListener('click', () => {
    document.getElementById('levelup-modal').style.display = 'none';
    engine.updateHUD();
});
