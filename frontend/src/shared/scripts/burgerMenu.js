export function initializeBurgerMenu() {
  const topNav = document.getElementById('top-nav-bar');
  const navDiv = topNav.querySelector('div');

  // Create burger menu button
  const burger = document.createElement('button');
  burger.className = 'burger-menu';
  burger.innerHTML = `
    <span class="line-1"></span>
    <span class="line-2"></span>
    <span class="line-3"></span>
  `;

  topNav.insertBefore(burger, navDiv);

  // Hide nav div initially on mobile
  const isMobile = () => window.innerWidth <= 768;
  if (isMobile()) {
    navDiv.style.display = 'none';
  }

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navDiv.style.display = navDiv.style.display === 'none' ? 'flex' : 'none';
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      navDiv.style.display = 'flex';
      burger.classList.remove('active');
    } else if (!burger.classList.contains('active')) {
      navDiv.style.display = 'none';
    }
  });

  document.addEventListener('click', e => {
    if (isMobile() && !burger.contains(e.target) && !navDiv.contains(e.target)) {
      burger.classList.remove('active');
      navDiv.style.display = 'none';
    }
  });
}
