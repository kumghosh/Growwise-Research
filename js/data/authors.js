/**
 * Growwise Research - Official Verified Research Authors Directory
 * Only these 6 verified profiles are used across all research briefs.
 */

window.GROWWISE_AUTHORS = [
  {
    id: "briony-claire",
    name: "Briony Claire",
    role: "Market Intelligence Analyst",
    initials: "BC"
  },
  {
    id: "arjun-mehra",
    name: "Arjun Mehra",
    role: "Senior Industry Researcher",
    initials: "AM"
  },
  {
    id: "daniel-whitmore",
    name: "Daniel Whitmore",
    role: "Senior Research Analyst",
    initials: "DW"
  },
  {
    id: "sayan-roy",
    name: "Sayan Roy",
    role: "Economic & Market Research Analyst",
    initials: "SR"
  },
  {
    id: "kumarjit-ghosh",
    name: "Kumarjit Ghosh",
    role: "Founder & CTO",
    initials: "KG"
  },
  {
    id: "moly-b",
    name: "Moly B.",
    role: "Senior Data Researcher",
    initials: "MB"
  }
];

/**
 * Assigns a fixed, constant pair of authors to a report based on its research ID.
 * The assignment is deterministic (pseudo-randomized per research ID), so each report
 * has its own unique, fixed author pair that NEVER changes on refresh!
 */
window.getAssignedAuthorsForResearch = function(researchId, count = 2) {
  if (!researchId) return [window.GROWWISE_AUTHORS[0], window.GROWWISE_AUTHORS[1]];
  
  let hash = 0;
  for (let i = 0; i < researchId.length; i++) {
    hash = ((hash << 5) - hash) + researchId.charCodeAt(i);
    hash |= 0;
  }
  const pool = [...window.GROWWISE_AUTHORS];
  const idx1 = Math.abs(hash) % pool.length;
  const idx2 = (idx1 + 1 + (Math.abs(hash >> 2) % (pool.length - 1))) % pool.length;
  
  return [pool[idx1], pool[idx2]];
};
