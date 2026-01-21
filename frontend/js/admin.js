/**
 * Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    const overlay = document.getElementById('login-overlay');
    const content = document.getElementById('admin-content');
    const btnLogin = document.getElementById('btn-admin-login');
    const passInput = document.getElementById('admin-pass');
    const errorMsg = document.getElementById('login-error');
    const tbody = document.getElementById('admin-voters-list');

    // Check session
    if (localStorage.getItem('admin_session') === 'true') {
        showContent();
    }

    btnLogin.addEventListener('click', () => {
        const pass = passInput.value;
        if (pass === 'admin123') { // Simple hardcoded password
            localStorage.setItem('admin_session', 'true');
            window.location.href = 'results.html';
        } else {
            errorMsg.classList.remove('hidden');
        }
    });

    async function showContent() {
        overlay.classList.add('hidden'); // Hide login
        content.style.display = 'block'; // Show content

        try {
            const voters = await mockApi.getVoters();
            renderVoters(voters);
        } catch (error) {
            console.error(error);
        }
    }

    function renderVoters(voters) {
        if (!voters || voters.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center p-4">No votes yet.</td></tr>';
            return;
        }

        // Mock getting candidate name by ID for display (This is tricky since backend sends candidate_id/name inside 'voters' if joined, or we need to fetch candidates)
        // Wait, the backend /voters returns User objects? let's check.
        // If backend returns VoterInfo list: { name, linkedin_profile_url, voted_candidate_id, timestamp? }

        tbody.innerHTML = voters.map(v => `
            <tr>
                <td class="p-4 font-medium text-gray-900">${v.name}</td>
                <td class="p-4 text-primary font-medium">${v.voted_candidate_id || 'Unknown'}</td> <!-- Ideally need candidate NAME here, but backend sends ID -->
                <td class="p-4">
                    ${v.linkedin_profile_url ? `<a href="${v.linkedin_profile_url}" target="_blank" class="text-sm text-blue-600 hover:underline">LinkedIn</a>` : '<span class="text-gray-400">N/A</span>'}
                </td>
                <td class="p-4 text-right text-xs text-secondary">
                    ${v.timestamp ? new Date(v.timestamp).toLocaleString() : 'Recent'}
                </td>
            </tr>
        `).join('');
    }
});
