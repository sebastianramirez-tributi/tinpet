export const FILE_FORMAT = 'application/pdf'
export const STATUS = {
  PENDING: 'pending',
  CREATED: 'created',
  FAILED: 'failed',
  PARTIAL: 'partial',
  PROCESSED: 'processed',
  PROCESSING: 'processing',
  CANCELLED: 'cancelled',
}

export const FILE_TYPES = {
  DRAFT: 'draft',
  LITOGRAFICO: 'litografico',
  FILED: 'filed',
}

export const FILE_COPIES_DICTIONARY = {
  [FILE_TYPES.FILED]: 'Declaración Presentada: ',
  [FILE_TYPES.DRAFT]: 'Borrador: ',
  [FILE_TYPES.LITOGRAFICO]: 'Presentable en el banco: ',
}
