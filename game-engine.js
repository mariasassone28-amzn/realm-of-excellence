// Realm of Excellence - Game Engine
class GameEngine {
    constructor() {
        this.player = null;
        this.saveKey = 'sme-guild-realm-v2';
    }

    save() { localStorage.setItem(this.saveKey, JSON.stringify(this.player)); }

    load() {
        const data = localStorage.getItem(this.saveKey);
        if (data) {
            this.player = JSON.parse(data);
            // Backward compat: ensure defeatedMonsters exists
            if (!this.player.defeatedMonsters) this.player.defeatedMonsters = [];
            return true;
        }
        return false;
    }

    hasSave() { return localStorage.getItem(this.saveKey) !== null; }

    createCharacter(name, house) {
        const houseData = GAME_DATA.houses[house];
        this.player = {
            name: name,
            house: house,
            houseName: houseData.name,
            houseIcon: houseData.icon,
            level: 1,
            xp: 0,
            totalXP: 0,
            gold: 0,
            stats: { ...houseData.stats },
            streak: 0,
            maxStreak: 0,
            lastLogin: new Date().toDateString(),
            completedQuests: [],
            completedTasks: [],
            questsCompleted: 0,
            tasksCompleted: 0,
            triviaCompleted: 0,
            perfectScores: 0,
            minigamesCompleted: 0,
            wordsUnscrambled: 0,
            rapidFireCorrect: 0,
            deepDivesCompleted: 0,
            bossHP: GAME_DATA.bossRaid.currentHP,
            purchasedItems: [],
            locationsVisited: [],
            unlockedAchievements: [],
            defeatedMonsters: [],
            createdAt: new Date().toISOString()
        };
        this.save();
    }

    // XP system with stat bonuses
    // Wisdom = +bonus XP from library/study
    // Precision = +bonus XP from match pairs and audits
    // Speed = +bonus time on trivia (handled in mini-games) + bonus XP from rapid fire
    // Tenacity = +bonus streak multiplier
    // Empathy = +bonus XP from coaching/collaboration
    // Charisma = +bonus gold from all activities
    addXP(amount, source) {
        let bonus = 0;
        const stats = this.player.stats;

        if (source === 'library' || source === 'study') {
            bonus = Math.floor(amount * (stats.wisdom * 0.05)); // +5% per wisdom point
        } else if (source === 'match-pairs' || source === 'audit') {
            bonus = Math.floor(amount * (stats.precision * 0.05));
        } else if (source === 'rapid-fire') {
            bonus = Math.floor(amount * (stats.speed * 0.05));
        } else if (source === 'coaching' || source === 'collaboration') {
            bonus = Math.floor(amount * (stats.empathy * 0.05));
        } else if (source === 'streak') {
            bonus = Math.floor(amount * (stats.tenacity * 0.08)); // +8% per tenacity
        }

        const total = amount + bonus;
        this.player.xp += total;
        this.player.totalXP += total;
        this.save();

        if (bonus > 0) {
            this.showToast(`+${amount} XP (+${bonus} stat bonus)`);
        } else {
            this.showToast(`+${amount} XP`);
        }
        return this.checkRankUp();
    }

    addGold(amount) {
        // Charisma gives bonus gold (+5% per charisma point)
        const charismaBonus = Math.floor(amount * (this.player.stats.charisma * 0.05));
        const total = amount + charismaBonus;
        this.player.gold += total;
        this.save();
    }

    // Get bonus timer seconds for trivia (Speed stat)
    getTriviaTimeBonus() {
        return this.player.stats.speed * 2; // +2 seconds per speed point
    }

    // Get streak multiplier (Tenacity stat)
    getStreakBonus() {
        return 1 + (this.player.stats.tenacity * 0.1); // +10% per tenacity point
    }

    spendGold(amount) {
        if (this.player.gold >= amount) {
            this.player.gold -= amount;
            this.save();
            return true;
        }
        return false;
    }

    // Rank calculation (from calculate_rank in CustomTkinter)
    getRankInfo() {
        let currentRank = GAME_DATA.ranks[0];
        let nextRank = GAME_DATA.ranks[1];

        for (let i = GAME_DATA.ranks.length - 1; i >= 0; i--) {
            if (this.player.totalXP >= GAME_DATA.ranks[i].xpRequired) {
                currentRank = GAME_DATA.ranks[i];
                nextRank = GAME_DATA.ranks[i + 1] || null;
                break;
            }
        }

        let progress = 100;
        if (nextRank) {
            const xpInto = this.player.totalXP - currentRank.xpRequired;
            const xpNeeded = nextRank.xpRequired - currentRank.xpRequired;
            progress = Math.min((xpInto / xpNeeded) * 100, 100);
        }

        return { currentRank, nextRank, progress };
    }

    checkRankUp() {
        const rankInfo = this.getRankInfo();
        if (rankInfo.currentRank.level > this.player.level) {
            this.player.level = rankInfo.currentRank.level;
            this.player.gold += 25;
            this.save();
            return rankInfo.currentRank;
        }
        return null;
    }

    // Streak (daily login)
    updateStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (this.player.lastLogin === today) return;
        if (this.player.lastLogin === yesterday) { this.player.streak++; }
        else { this.player.streak = 1; }
        if (this.player.streak > this.player.maxStreak) this.player.maxStreak = this.player.streak;
        this.player.lastLogin = today;

        // Reset daily quests each new day
        const dailyQuestIds = ['q-trivia-daily', 'q-scramble', 'q-rapid'];
        if (this.player.completedQuests) {
            this.player.completedQuests = this.player.completedQuests.filter(id => !dailyQuestIds.includes(id));
        }
        if (this.player.questCooldowns) {
            dailyQuestIds.forEach(id => delete this.player.questCooldowns[id]);
        }

        this.save();
    }

    // Quests
    completeQuest(questId) {
        if (this.player.completedQuests.includes(questId)) return false;
        this.player.completedQuests.push(questId);
        this.player.questsCompleted++;
        this.save();
        return true;
    }

    isQuestCompleted(questId) { return this.player.completedQuests.includes(questId); }

    // Tasks
    completeTask(taskId) {
        if (this.player.completedTasks.includes(taskId)) return false;
        this.player.completedTasks.push(taskId);
        this.player.tasksCompleted++;
        this.save();
        return true;
    }

    isTaskCompleted(taskId) { return this.player.completedTasks.includes(taskId); }

    // Monster Progression
    defeatMonster(monsterId) {
        if (!this.player.defeatedMonsters) this.player.defeatedMonsters = [];
        if (this.player.defeatedMonsters.includes(monsterId)) return false;
        this.player.defeatedMonsters.push(monsterId);
        this.save();
        return true;
    }

    isMonsterDefeated(monsterId) {
        if (!this.player.defeatedMonsters) return false;
        return this.player.defeatedMonsters.includes(monsterId);
    }

    getHighestDefeatedLevel() {
        if (!this.player.defeatedMonsters || this.player.defeatedMonsters.length === 0) return 0;
        // Extract level numbers from monster IDs (format: mon-X where level is stored separately)
        // We'll use a lookup approach
        const monsterLevels = {
            'mon-slime': 1, 'mon-spider': 2, 'mon-bat': 3,
            'mon-ghost': 4, 'mon-dragon': 5, 'mon-eye': 6, 'mon-skull': 7
        };
        let highest = 0;
        this.player.defeatedMonsters.forEach(id => {
            if (monsterLevels[id] && monsterLevels[id] > highest) highest = monsterLevels[id];
        });
        return highest;
    }

    canFightMonster(monsterLevel) {
        // Can fight level 1 always, otherwise must have defeated previous level
        if (monsterLevel <= 1) return true;
        return this.getHighestDefeatedLevel() >= monsterLevel - 1;
    }

    canAccessBoss() {
        // Must defeat all 7 monsters to access the boss
        return this.getHighestDefeatedLevel() >= 7;
    }

    // Boss
    damageBoss(amount) {
        this.player.bossHP = Math.max(0, this.player.bossHP - amount);
        this.save();
    }

    // ═══ TASK AUDIT/REVIEW SYSTEM ═══
    // Tasks go to PENDING state. Guild Founder reviews and approves/rejects.
    // Points are only awarded after approval.

    submitTaskForReview(taskId, proof, xp, gold, category) {
        if (!this.player.pendingTasks) this.player.pendingTasks = [];
        // Don't allow duplicate submissions
        if (this.player.pendingTasks.find(t => t.taskId === taskId)) return;
        if (this.player.completedTasks && this.player.completedTasks.includes(taskId)) return;

        this.player.pendingTasks.push({
            taskId,
            proof,
            xp,
            gold,
            category: category || 'task',
            submittedAt: new Date().toISOString(),
            status: 'pending' // pending | approved | rejected
        });
        this.save();
    }

    isTaskPending(taskId) {
        if (!this.player.pendingTasks) return false;
        return this.player.pendingTasks.some(t => t.taskId === taskId && t.status === 'pending');
    }

    getTaskStatus(taskId) {
        if (this.player.completedTasks && this.player.completedTasks.includes(taskId)) return 'approved';
        if (!this.player.pendingTasks) return 'none';
        const pending = this.player.pendingTasks.find(t => t.taskId === taskId);
        if (pending) return pending.status;
        return 'none';
    }

    // Guild Founder calls this to approve a pending task
    approveTask(taskId) {
        if (!this.player.pendingTasks) return false;
        const task = this.player.pendingTasks.find(t => t.taskId === taskId && t.status === 'pending');
        if (!task) return false;

        task.status = 'approved';
        task.approvedAt = new Date().toISOString();

        // Now award the points
        this.completeTask(taskId);
        this.addXP(task.xp, task.category === 'audit' ? 'audit' : task.category === 'mentorship' ? 'coaching' : 'task');
        this.addGold(task.gold);
        this.checkAchievements();
        this.save();
        return true;
    }

    // Guild Founder calls this to reject a pending task
    rejectTask(taskId, reason) {
        if (!this.player.pendingTasks) return false;
        const task = this.player.pendingTasks.find(t => t.taskId === taskId && t.status === 'pending');
        if (!task) return false;

        task.status = 'rejected';
        task.rejectedAt = new Date().toISOString();
        task.rejectReason = reason || 'Proof insufficient. Please resubmit.';
        this.save();
        return true;
    }

    // Get all pending tasks for review (Guild Founder view)
    getPendingTasks() {
        if (!this.player.pendingTasks) return [];
        return this.player.pendingTasks.filter(t => t.status === 'pending');
    }

    // ═══ ERROR REVIEW / SPACED REPETITION ═══
    // Tracks questions answered incorrectly. Serves them back until mastered.

    trackWrongAnswer(question, correctAnswer, explanation, domain) {
        if (!this.player.errorBank) this.player.errorBank = [];
        // Don't duplicate
        const exists = this.player.errorBank.find(e => e.question === question);
        if (exists) {
            exists.timesWrong++;
            exists.lastWrong = new Date().toISOString();
            exists.mastered = false;
        } else {
            this.player.errorBank.push({
                question,
                correctAnswer,
                explanation,
                domain: domain || 'general',
                timesWrong: 1,
                timesCorrect: 0,
                lastWrong: new Date().toISOString(),
                mastered: false
            });
        }
        this.save();
    }

    trackCorrectReview(question) {
        if (!this.player.errorBank) return;
        const item = this.player.errorBank.find(e => e.question === question);
        if (item) {
            item.timesCorrect++;
            // Mastered after getting it right 2 times in review mode
            if (item.timesCorrect >= 2) {
                item.mastered = true;
            }
            this.save();
        }
    }

    getErrorsForReview() {
        if (!this.player.errorBank) return [];
        return this.player.errorBank.filter(e => !e.mastered).sort((a, b) => b.timesWrong - a.timesWrong);
    }

    getErrorStats() {
        if (!this.player.errorBank) return { total: 0, active: 0, mastered: 0 };
        const total = this.player.errorBank.length;
        const mastered = this.player.errorBank.filter(e => e.mastered).length;
        return { total, active: total - mastered, mastered };
    }

    // Achievement check (from check_deep_dive_achievement_conditions)
    checkAchievements() {
        // Deep Dive Mentor achievement
        if (this.player.deepDivesCompleted >= 5 && !this.player.unlockedAchievements.includes('deep-dive-mentor')) {
            this.player.unlockedAchievements.push('deep-dive-mentor');
            this.addXP(250);
            this.showToast('🏆 Achievement: Deep Dive Mentor!');
        }
    }

    // HUD update
    updateHUD() {
        if (!this.player) return;
        const house = GAME_DATA.houses[this.player.house];
        const avatarEl = document.getElementById('hud-avatar');
        if (house.iconHtml) {
            avatarEl.innerHTML = house.iconHtml;
        } else {
            avatarEl.textContent = house.icon;
        }
        document.getElementById('hud-name').textContent = this.player.name;
        const rankInfo = this.getRankInfo();
        document.getElementById('hud-rank').textContent = `Rank: ${rankInfo.currentRank.title}`;
        document.getElementById('hud-xp').textContent = this.player.totalXP.toLocaleString();
        document.getElementById('hud-gold').textContent = this.player.gold;
    }

    // Toast notification
    showToast(text) {
        const toast = document.getElementById('xp-toast');
        document.getElementById('xp-toast-text').textContent = text;
        toast.classList.add('show');
        toast.style.display = 'block';
        setTimeout(() => { toast.classList.remove('show'); toast.style.display = 'none'; }, 2500);
    }

    showRankUp(rankData) {
        document.getElementById('levelup-rank-text').textContent = rankData.title;
        document.getElementById('levelup-bonus-text').textContent = '+25 Gold Bonus!';
        document.getElementById('levelup-modal').style.display = 'flex';
    }
}
