import estonianWasteTypes from "./estonian-wastes.js";

function classifyEstonianTrash(labels) {
  // Collect all possible matches with a score
  const matches = [];

  for (const label of labels) {
    if (label.Confidence < 70) continue;

    // Direct name match (highest score)
    if (estonianWasteTypes[label.Name]) {
      matches.push({
        type: estonianWasteTypes[label.Name],
        confidence: label.Confidence,
        matchType: 'direct'
      });
    }

    // Alias matches (slightly lower score)
    if (label.Aliases) {
      for (const alias of label.Aliases) {
        if (estonianWasteTypes[alias.Name]) {
          matches.push({
            type: estonianWasteTypes[alias.Name],
            confidence: label.Confidence * 0.95,
            matchType: 'alias'
          });
        }
      }
    }

    // Parent matches (lower score)
    if (label.Parents) {
      for (const parent of label.Parents) {
        if (estonianWasteTypes[parent.Name]) {
          matches.push({
            type: estonianWasteTypes[parent.Name],
            confidence: label.Confidence * 0.9,
            matchType: 'parent'
          });
        }
      }
    }

    // Category matches (lowest score)
    if (label.Categories) {
      for (const category of label.Categories) {
        if (estonianWasteTypes[category.Name]) {
          matches.push({
            type: estonianWasteTypes[category.Name],
            confidence: label.Confidence * 0.85,
            matchType: 'category'
          });
        }
      }
    }
  }

  // Pick the best match by highest confidence
  if (matches.length > 0) {
    matches.sort((a, b) => b.confidence - a.confidence);
    return matches[0].type;
  }

  return "Segajäätmed";
}

export default classifyEstonianTrash