import '../../shared/styles/shared.css';
import './main.css';
import { initializeNavAuth } from '../../shared/scripts/pageLoad.js';
import { initializeBurgerMenu } from '../../shared/scripts/burgerMenu.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeNavAuth();
  initializeBurgerMenu();
});
