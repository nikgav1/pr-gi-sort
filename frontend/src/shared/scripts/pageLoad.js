import getUserInfo from '../../utils/userInfo';
import { getAuthToken } from './auth';

export async function initializeNavAuth() {
  try {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    const response = await getUserInfo(token);
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await response.json();

    // Handle navigation links
    const navDiv = document.querySelector('#top-nav-bar div');
    if (navDiv) {
      // Clear existing auth links
      const signinLink = document.getElementById('signin');
      const signupLink = document.getElementById('signup');
      const existingProfileLink = document.getElementById('profile-link');

      if (signinLink) navDiv.removeChild(signinLink);
      if (signupLink) navDiv.removeChild(signupLink);
      if (existingProfileLink) navDiv.removeChild(existingProfileLink);

      // Add profile link
      const profileLink = document.createElement('a');
      profileLink.href = '/profile.html';
      profileLink.id = 'profile-link';
      profileLink.textContent = userData.name;
      navDiv.appendChild(profileLink);
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
    if (error.message.includes('401')) {
      localStorage.removeItem('token');
    }
  }
}
