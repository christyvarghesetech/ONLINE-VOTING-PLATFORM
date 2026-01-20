/**
 * Real API Service connecting to FastAPI Backend
 */

const API_BASE_URL = "http://localhost:8000";

const api = {

    /**
     * Get Auth Token from LocalStorage
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Get User Info
     * (Fetches from /me endpoint)
     */
    async getUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) this.logout();
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching user", error);
            return null;
        }
    },

    /**
     * Update User Profile
     */
    async updateUser(data) {
        const token = this.getToken();
        if (!token) throw new Error("Unauthorized");

        const response = await fetch(`${API_BASE_URL}/me`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Failed to update profile");
        return await response.json();
    },

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    },

    /**
     * Get Candidates
     */
    async getCandidates() {
        const token = this.getToken(); // Public endpoint but we might want data
        const response = await fetch(`${API_BASE_URL}/candidates`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (!response.ok) throw new Error("Failed to fetch candidates");
        return await response.json();
    },

    /**
     * Cast Vote
     */
    async vote(candidateId) {
        const token = this.getToken();
        if (!token) throw new Error("Unauthorized");

        const response = await fetch(`${API_BASE_URL}/vote`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ candidate_id: candidateId })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Voting failed");
        }
        return await response.json();
    },

    /**
     * Get Voters List
     */
    async getVoters() {
        const response = await fetch(`${API_BASE_URL}/voters`);
        if (!response.ok) throw new Error("Failed to fetch voters");
        return await response.json();
    },

    /**
     * Check if user has voted (Client side check based on user object)
     */
    async hasVoted() {
        const user = await this.getUser();
        return user ? user.has_voted : false;
    },

    /**
     * Reset Election
     */
    async resetElection() {
        const response = await fetch(`${API_BASE_URL}/reset`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error("Failed to reset election");
        return await response.json();
    }


};

// Export for global usage (matching previous mockApi pattern)
window.mockApi = api; // Keeping name mockApi to avoid breaking other files, but it's real now.
