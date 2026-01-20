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

        // Mock getting candidate name by ID for display
        const getCandidateName = (id) => {
            const c = mockApi.candidates.find(x => x.id === id);
            return c ? c.name : 'Unknown';
        };

        tbody.innerHTML = voters.map(v => `
            <tr>
                <td class="p-4 font-medium text-gray-900">${v.userName}</td>
                <td class="p-4 text-primary font-medium">${getCandidateName(v.candidateId)}</td>
                <td class="p-4">
                    <a href="${v.linkedinProfile}" target="_blank" class="text-sm text-blue-600 hover:underline">LinkedIn</a>
                </td>
                <td class="p-4 text-right text-xs text-secondary">
                    ${new Date(v.timestamp).toLocaleString()}
                </td>
            </tr>
        `).join('');
    }
});
