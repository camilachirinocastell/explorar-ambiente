// frontend/src/constants/inquiry-options.ts
// Allowed values of the contact form and the admin panel, and the texts shown for each
// one. The values must match backend/src/types/domain.types.ts: the monorepo does not
// share code between layers yet, so a change there needs the same change here.

export const CLIENT_TYPES = ['individual_producer', 'company', 'municipality'] as const;
export type ClientType = (typeof CLIENT_TYPES)[number];

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  individual_producer: 'Productor/a rural',
  company: 'Empresa',
  municipality: 'Municipio',
};

export const SERVICE_TYPES = [
  'native_forest_plan',
  'firebreak_plan',
  'prescribed_burn_plan',
  'fauna_monitoring',
  'eia',
  'gis_mapping',
  'environmental_education',
  'urban_forestry',
  'other',
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number];

// Service names are the exact texts the client asked for
export const SERVICE_LABELS: Record<ServiceType, string> = {
  native_forest_plan: 'Plan de manejo de bosque nativo',
  firebreak_plan: 'Plan de picada cortafuego',
  prescribed_burn_plan: 'Plan de quema prescripta',
  fauna_monitoring: 'Monitoreo de fauna silvestre',
  eia: 'Evaluación de Impacto Ambiental',
  gis_mapping: 'Cartografía y sistema de información geográfica',
  environmental_education: 'Educación ambiental',
  urban_forestry: 'Asesoramiento en arbolado urbano para frentistas y municipios',
  other: 'Otro',
};

// Workflow of an inquiry in the admin panel: new ones arrive as "pending"
export const INQUIRY_STATUSES = ['pending', 'reviewed', 'contacted'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  pending: 'Pendiente',
  reviewed: 'Revisada',
  contacted: 'Contactada',
};
