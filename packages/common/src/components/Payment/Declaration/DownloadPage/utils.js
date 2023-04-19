import { STATUS } from '../../../../constants/documents'

const { PENDING } = STATUS

export const generateButton = (text, link = '#', onClick = null) => ({
  link,
  onClick,
  text,
  isLoading: link && link.startsWith(PENDING),
})
