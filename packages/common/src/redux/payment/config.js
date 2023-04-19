const DEFAULT_CONFIG = {
  pro: {
    accountant_amount: 50_000,
    upgradeDisabled: ({ originalPrice, paidValue }, self) =>
      originalPrice - self.accountant_amount < paidValue,
  },
  expres: {
    upgradeDisabled: ({ originalPrice, paidValue }, self) =>
      originalPrice < paidValue,
  },
  estandar: {
    upgradeDisabled: ({ originalPrice, paidValue }, self) => true,
  },
}

export const PLANS_CONFIG = {
  2022: DEFAULT_CONFIG,
  2021: DEFAULT_CONFIG,
  2020: DEFAULT_CONFIG,
  2019: DEFAULT_CONFIG,
  2018: DEFAULT_CONFIG,
}
