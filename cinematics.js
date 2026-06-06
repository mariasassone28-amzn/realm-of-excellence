// Realm of Excellence - Mini-Movie Cinematics System
// Each faction has a multi-scene cinematic that plays when a chapter is unlocked

const CINEMATICS = {
    'medical-coding': {
        scenes: [
            {
                art: '🦉',
                artClass: 'purple-scene',
                title: 'Medical Coding',
                subtitle: 'THE HOUSE OF WISDOM',
                text: 'In the ancient towers of the Guild, the Owls of Medical Coding keep watch over the sacred texts. Every diagnosis, every procedure — translated into the language of healing.',
                motto: '"We translate care into clarity. We code the story of healing."'
            },
            {
                art: '📜',
                artClass: 'purple-scene',
                title: 'The Codex Awakens',
                subtitle: 'CHAPTER UNLOCKED',
                text: 'With quill in hand and wisdom in heart, the Coding scholars decipher the stories hidden within patient encounters. Each code tells a tale of care delivered.',
                motto: 'Accuracy is not just a metric — it is a promise to every patient.'
            },
            {
                art: '✨',
                artClass: 'purple-scene',
                title: 'Knowledge Gained',
                subtitle: 'YOUR JOURNEY CONTINUES',
                text: 'The owl watches over you as new knowledge settles into your mind. The Guild grows stronger with every story properly told.',
                motto: 'One code at a time, we honor the healers.'
            }
        ]
    },
    'charge-capture': {
        scenes: [
            {
                art: '🦅',
                artClass: 'blue-scene',
                title: 'Charge Capture',
                subtitle: 'THE HOUSE OF VIGILANCE',
                text: 'High above the realm, the Griffins of Charge Capture soar with keen eyes. Nothing escapes their gaze — every service rendered is captured, every charge secured.',
                motto: '"We capture today so care can continue."'
            },
            {
                art: '⚡',
                artClass: 'blue-scene',
                title: 'Swift & Certain',
                subtitle: 'CHAPTER UNLOCKED',
                text: 'Speed and precision define the Griffin\'s flight. In the space between service and submission, they ensure no charge is lost to the winds of time.',
                motto: 'What we capture today funds the care of tomorrow.'
            },
            {
                art: '🌟',
                artClass: 'blue-scene',
                title: 'Mission Secured',
                subtitle: 'YOUR JOURNEY CONTINUES',
                text: 'The Griffin\'s wings carry you higher. With each charge captured, the foundation of care grows stronger beneath you.',
                motto: 'Vigilance is our gift to the mission.'
            }
        ]
    },
    'collections': {
        scenes: [
            {
                art: '🦁',
                artClass: 'gold-scene',
                title: 'Collections',
                subtitle: 'THE HOUSE OF RESOLVE',
                text: 'With lantern held high, the Lions of Collections walk the path of persistence. Through patience and purpose, they recover what is owed — protecting tomorrow\'s care.',
                motto: '"We follow through with purpose. We recover today to protect tomorrow."'
            },
            {
                art: '🔥',
                artClass: 'gold-scene',
                title: 'The Lantern Burns Bright',
                subtitle: 'CHAPTER UNLOCKED',
                text: 'Every recovered dollar is a promise kept. The Lions do not falter — they pursue with compassion, negotiate with wisdom, and resolve with honor.',
                motto: 'Persistence with purpose. Recovery with respect.'
            },
            {
                art: '🏆',
                artClass: 'gold-scene',
                title: 'Resolve Strengthened',
                subtitle: 'YOUR JOURNEY CONTINUES',
                text: 'The Lion\'s roar echoes through the halls. Your tenacity has earned the Guild\'s respect — and the patients\' future is more secure.',
                motto: 'We protect tomorrow, one recovery at a time.'
            }
        ]
    },
    'cash-application': {
        scenes: [
            {
                art: '🐉',
                artClass: 'green-scene',
                title: 'Cash Application',
                subtitle: 'THE HOUSE OF PRECISION',
                text: 'In the emerald vaults, the Dragons of Cash Application guard every coin with meticulous care. Each payment posted with exactness — powering the mission forward.',
                motto: '"We post with precision. We power the mission."'
            },
            {
                art: '💎',
                artClass: 'green-scene',
                title: 'The Ledger Speaks',
                subtitle: 'CHAPTER UNLOCKED',
                text: 'Numbers do not lie when the Dragon watches. ERA reconciled, payments matched, denials decoded — the financial heartbeat of the realm pulses steady and true.',
                motto: 'Precision is not perfection — it is dedication made visible.'
            },
            {
                art: '⚜️',
                artClass: 'green-scene',
                title: 'Precision Mastered',
                subtitle: 'YOUR JOURNEY CONTINUES',
                text: 'The Dragon nods in approval. Your ledgers are balanced, your postings exact. The mission is powered by your steady hand.',
                motto: 'Every cent in its place. Every mission empowered.'
            }
        ]
    },
    'patient-financial': {
        scenes: [
            {
                art: '🧸',
                artClass: 'red-scene',
                title: 'Patient Financial Services',
                subtitle: 'THE HOUSE OF COMPASSION',
                text: 'With open arms and gentle hearts, the Bears of Patient Financial Services walk beside every patient. Clarity, care, and compassion guide their every word.',
                motto: '"We support every patient journey with care, clarity, and compassion."'
            },
            {
                art: '❤️',
                artClass: 'red-scene',
                title: 'The Heart of Service',
                subtitle: 'CHAPTER UNLOCKED',
                text: 'Behind every bill is a person. Behind every question is a worry. The Bears listen, explain, and comfort — transforming confusion into understanding.',
                motto: 'Empathy is our strongest tool. Compassion is our legacy.'
            },
            {
                art: '🌈',
                artClass: 'red-scene',
                title: 'Compassion Deepened',
                subtitle: 'YOUR JOURNEY CONTINUES',
                text: 'The Bear embraces you warmly. Your kindness has touched lives beyond measure. In the Guild, compassion is the greatest strength of all.',
                motto: 'Every patient journey, honored with heart.'
            }
        ]
    }
};

// Cinematic Player Class
class CinematicPlayer {
    constructor() {
        this.currentScenes = null;
        this.currentScene = 0;
        this.onComplete = null;
    }

    play(factionId, onComplete) {
        const cinematic = CINEMATICS[factionId];
        if (!cinematic) { if (onComplete) onComplete(); return; }

        this.currentScenes = cinematic.scenes;
        this.currentScene = 0;
        this.onComplete = onComplete;
        this.renderScene();
    }

    renderScene() {
        const scene = this.currentScenes[this.currentScene];
        const isLast = this.currentScene >= this.currentScenes.length - 1;

        // Remove existing overlay if any
        const existing = document.querySelector('.cinematic-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'cinematic-overlay';
        overlay.innerHTML = `
            <div class="letterbox-top"></div>
            <div class="cinematic-scene">
                <div class="cinematic-art ${scene.artClass}">
                    ${scene.art}
                </div>
                <div class="cinematic-banner">
                    <div class="cinematic-title">${scene.title}</div>
                    <div class="cinematic-subtitle">${scene.subtitle}</div>
                </div>
                <div class="cinematic-text">${scene.text}</div>
                <div class="cinematic-motto">${scene.motto}</div>
                <div class="cinematic-progress">
                    ${this.currentScenes.map((_, i) => `<div class="cinematic-dot ${i <= this.currentScene ? 'active' : ''}"></div>`).join('')}
                </div>
                <div class="cinematic-controls">
                    <button class="cinematic-btn skip-btn" id="cin-skip">Skip</button>
                    <button class="cinematic-btn" id="cin-next">${isLast ? 'Continue' : 'Next →'}</button>
                </div>
            </div>
            <div class="letterbox-bottom"></div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('cin-skip').addEventListener('click', () => this.close());
        document.getElementById('cin-next').addEventListener('click', () => {
            if (isLast) {
                this.close();
            } else {
                this.currentScene++;
                // Fade transition
                overlay.style.animation = 'none';
                overlay.offsetHeight; // trigger reflow
                overlay.style.animation = 'fadeIn 0.5s ease';
                this.renderScene();
            }
        });

        // Keyboard support
        const keyHandler = (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                document.removeEventListener('keydown', keyHandler);
                if (isLast) this.close();
                else { this.currentScene++; this.renderScene(); }
            }
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', keyHandler);
                this.close();
            }
        };
        document.addEventListener('keydown', keyHandler);
    }

    close() {
        const overlay = document.querySelector('.cinematic-overlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                if (this.onComplete) this.onComplete();
            }, 500);
        }
    }
}

// Global instance
const cinematicPlayer = new CinematicPlayer();
