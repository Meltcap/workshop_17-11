// ScoreStorage class - LocalStorage wrapper for score persistence

export class ScoreStorage {
    constructor(storageKey = 'snakeGameScores') {
        this.storageKey = storageKey;
    }
    
    // Load all rounds from storage
    async loadRounds() {
        try {
            const data = localStorage.getItem(this.storageKey);
            
            if (!data) {
                return [];
            }
            
            const rounds = JSON.parse(data);
            
            if (!Array.isArray(rounds)) {
                console.error('Corrupted data in localStorage: not an array');
                return [];
            }
            
            return rounds;
        } catch (error) {
            console.error('Error loading rounds from localStorage:', error);
            return [];
        }
    }
    
    // Save a round to storage
    async saveRound(round) {
        try {
            // Validate round data
            if (!round.playerName || round.playerName.trim().length === 0) {
                throw new Error('Player name is required');
            }
            
            if (typeof round.score !== 'number' || round.score < 0) {
                throw new Error('Invalid score value');
            }
            
            if (typeof round.timestamp !== 'number' || round.timestamp > Date.now()) {
                throw new Error('Invalid timestamp');
            }
            
            // Load existing rounds
            const rounds = await this.loadRounds();
            
            // Add new round
            rounds.push({
                playerName: round.playerName,
                score: round.score,
                timestamp: round.timestamp
            });
            
            // Save to localStorage
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(rounds));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    throw new Error('QUOTA_EXCEEDED: Storage quota exceeded');
                }
                throw e;
            }
        } catch (error) {
            if (error.message.startsWith('QUOTA_EXCEEDED')) {
                console.error('Storage quota exceeded');
            }
            throw error;
        }
    }
    
    // Get rounds sorted by score (descending)
    async getSortedRounds(limit) {
        const rounds = await this.loadRounds();
        
        // Sort by score (descending), then by timestamp (descending) for tie-breaking
        rounds.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.timestamp - a.timestamp;
        });
        
        if (limit && limit > 0) {
            return rounds.slice(0, limit);
        }
        
        return rounds;
    }
    
    // Get top 3 rounds
    async getTop3Rounds() {
        return await this.getSortedRounds(3);
    }
    
    // Get rounds for a specific player
    async getPlayerRounds(playerName) {
        const rounds = await this.loadRounds();
        return rounds.filter(round => round.playerName === playerName);
    }
    
    // Clear all saved rounds
    async clearAll() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
    
    // Get approximate storage size
    getStorageSize() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return 0;
            return new Blob([data]).size;
        } catch (error) {
            return 0;
        }
    }
}
