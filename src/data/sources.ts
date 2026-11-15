// Everything in the app links back to one of these pages.
export const SOURCES = {
  hazards: {
    label: 'NASA HRP · 5 Hazards of Human Spaceflight',
    url: 'https://www.nasa.gov/hrp/hazards/',
  },
  risks: {
    label: 'NASA HRP · Risks of Human Spaceflight',
    url: 'https://www.nasa.gov/hrp/risks/',
  },
  research: {
    label: 'NASA HRP · Ongoing HRP Research in Space',
    url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
  },
  csaRadiation: {
    label: 'CSA · Monitoring radiation for astronaut health',
    url: 'https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp',
  },
  csaScience: {
    label: 'CSA · Why do we conduct science experiments in space?',
    url: 'https://www.asc-csa.gc.ca/eng/iss/science/why-do-we-conduct-science-experiments-in-space.asp',
  },
} as const;

export type SourceKey = keyof typeof SOURCES;
