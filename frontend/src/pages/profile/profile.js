import '../../shared/styles/shared.css';
import './profile.css';
import { getAuthToken } from '../../shared/scripts/auth';
import getUserInfo from '../../utils/userInfo';

import { initializeNavAuth } from '../../shared/scripts/pageLoad.js';
import { initializeBurgerMenu } from '../../shared/scripts/burgerMenu.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeNavAuth();
  initializeBurgerMenu();
});

const token = getAuthToken();
if (!token) {
  window.location.href = '/signin';
}
function insertProfile(name, trashObject) {
  document.getElementById('name').textContent = name;

  const statsContainer = document.getElementById('statistics');
  // Clear previous content
  statsContainer.textContent = '';

  // Create and append stats for each category
  Object.entries(trashObject).forEach(([category, count]) => {
    const statDiv = document.createElement('div');
    statDiv.className = 'stat-item';

    const categorySpan = document.createElement('span');
    categorySpan.className = 'category';
    categorySpan.textContent = `${category}: `;

    const countSpan = document.createElement('span');
    countSpan.className = 'count';
    countSpan.textContent = count;

    statDiv.appendChild(categorySpan);
    statDiv.appendChild(countSpan);
    statsContainer.appendChild(statDiv);
  });
}
async function loadProfile() {
  try {
    const res = await getUserInfo(token);

    if (!res.ok) {
      window.location.href = '/signin';
    }
    const profileData = await res.json();
    insertProfile(profileData.name, profileData.sortedTrash);
    console.log(profileData);
  } catch (error) {
    console.log(error);
  }
}
await loadProfile();
