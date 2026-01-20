/**
 * Logic for voters.html (Thank You page)
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Auth Check
    const user = await mockApi.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    const candidateSpan = document.getElementById('voted-candidate');

    if (user.has_voted) {
        // We stored the voted_candidate_id in the user object in backend
        try {
            const candidates = await mockApi.getCandidates();
            // Mongo uses _id, but our model returns id alias or _id. API returns list of dicts.
            // Let's check both just in case
            const candidate = candidates.find(c => c._id === user.voted_candidate_id || c.id === user.voted_candidate_id);

            if (candidate) {
                candidateSpan.textContent = candidate.name;
            } else {
                candidateSpan.textContent = "Your selected candidate";
            }
        } catch (error) {
            console.error("Error fetching candidates", error);
            candidateSpan.textContent = "Error loading details";
        }
    } else {
        candidateSpan.innerHTML = 'No vote found. <a href="candidates.html" class="underline">Vote now</a>.';
    }
});
