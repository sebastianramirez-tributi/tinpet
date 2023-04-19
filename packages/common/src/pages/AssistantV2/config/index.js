export const RBAC = {
  assistant: {
    payment_approve: ['is_staff'],
    account_change: ['is_staff'],
    disable_tax_file: ['is_staff'],
    enable_tax_file: ['is_staff'],
    active_or_inactive_user: ['is_staff'],
  },
}

export const ACTIONS = {
  PAYMENT_APPROVE: 'payment_approve',
  ACCOUNT_CHANGE: 'account_change',
  DISABLE_TAX_FILE: 'disable_tax_file',
  ENABLE_TAX_FILE: 'enable_tax_file',
  ACTIVE_OR_INACTIVE_USER: 'active_or_inactive_user',
}
