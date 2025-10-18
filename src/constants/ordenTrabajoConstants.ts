/**
 * Constants para Orden de Trabajo Mobile
 * Basados en OrdenTrabajo.tsx (web)
 */

export const CAPACIDAD_UNIDADES = ['KILOS', 'LIBRAS', 'LITROS'] as const

export const CAPACIDAD_VALORES = {
  KILOS: [
    '6 KILOS',
    '4 KILOS',
    '12 KILOS',
    '8 KILOS',
    '2 KILOS',
    '10 KILOS',
    '2,5 KILOS',
    '9 KILOS',
    '5 KILOS',
    '20 KILOS',
    '3 KILOS',
    '50 KILOS',
    '0,5 KILOS'
  ],
  LIBRAS: ['10 LIBRAS', '20 LIBRAS', '5 LIBRAS', '15 LIBRAS', '2.5 LIBRAS', '13 LIBRAS', '22 LIBRAS'],
  LITROS: ['6 LITROS', '9,5 LITROS', '10 LITROS']
} as const

export const MARCAS = [
  'KIDDE BRASIL',
  'RESIL',
  'FANACIM',
  'SIN MARCA',
  'MELISAM',
  'AMEREX',
  'GEORGIA',
  'YUKON',
  'BADGER',
  'FADESA',
  'EFIR'
] as const

export const TIPOS = ['ABC', 'BC', 'CO2', 'POLVO QUÍMICO SECO', 'ESPUMA', 'AGUA'] as const

export const CLIENTES = [
  'BANCO NACIONAL DE BOLIVIA S.A.',
  'BANCO BISA S.A.',
  'MINISTERIO DE LA PRESIDENCIA',
  'SOBOCE S.A.',
  'TIGRE S.A.',
  'COOP. MIN. AU. LA ESPERANZA R.L.',
  'EPSAS S.A.',
  'BANCO DE CREDITO DE BOLIVIA S.A.',
  'CERVECERIA BOLIVIANA NACIONAL S.A.',
  'INDUSTRIAS VENADO S.A.',
  'BANCO SOLIDARIO S.A.'
] as const

export const AGENCIAS_BANCO_SOLIDARIO = [
  'Ventanilla de Cobranza SIN - Distrital El Alto, El Alto',
  'El Tejar, La Paz',
  'Cota Cota, La Paz',
  'San Miguel, La Paz',
  'Ventanilla de Cobranza SIN - Ballivian, La Paz',
  'Agencia Santiago II, El Alto',
  'Regional La Paz, La Paz',
  'Garita de Lima, La Paz',
  'Agencia Gran Poder, La Paz'
] as const

export const TELEFONOS_EJEMPLO = [
  '70572005',
  '70572006',
  '70572007',
  '70572008',
  '70572009',
  '70572010',
  '70572011',
  '70572012',
  '70572013'
] as const

/**
 * Storage Keys para MMKV
 */
export const STORAGE_KEYS = {
  ORDEN_TRABAJO_DRAFT: 'orden:trabajo:draft',
  ORDEN_TRABAJO_HISTORY: 'orden:trabajo:history'
} as const

/**
 * Valores por defecto
 */
export const DEFAULT_VALUES = {
  DETALLE_EXTINTOR: {
    id: '',
    extintorNro: '',
    capacidadUnidad: '',
    capacidadValor: '',
    marca: '',
    tipo: ''
  }
} as const
