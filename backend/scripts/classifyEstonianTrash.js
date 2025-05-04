import estonianWasteTypes from './estonian-wastes.js';

function classifyEstonianTrash(trash) {
  const key = trash.split(',')[0].trim().toLowerCase();
  return estonianWasteTypes[key] || estonianWasteTypes['default'];
}

export default classifyEstonianTrash;
