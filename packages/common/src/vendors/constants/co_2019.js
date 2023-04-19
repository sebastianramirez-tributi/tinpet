import shareConstants from '.'

export default {
  ...shareConstants,
  INDIVIDUAL: 'Individual',
  INSTITUTIONAL: 'Institucional',
  RULE_NO_ACTIONS: '01/01/2017',
  RULE_ACTIONS: '01/01/2015',
  YEAR_END_RATE: '12/31/2019',
  YEAR_END_RATE_2019: '12/31/2019', // Keep this as fallback in case the MathOPS are not recalculated
  LAST_YEAR_END_RATE: '12/31/2018',
  AVERAGE_FISCAL_YEAR_RATE: 3281.09,
  PERCENT_FISCAL_ADJUSTMENT: 0.0336,
  START_YEAR: '12/31/2018',
  END_OF_YEAR: '12/31/2019',
  DEPENDENT: 'Dependiente',
  VOLUNTEER: 'Voluntario',
  FEC_BANCOLOMBIA: 'FEC - Bancolombia',
  FEPEP: 'FEPEP',
  FONDO_SURA: 'FondoSURA',
  SOMOSIG: 'SOMOSIG',
  PRESENT: 'Presente',
  FONDEARGOS: 'FONDEARGOS',
  FOMUNE: 'FOMUNE',
  DUNNO: 'No estoy seguro',
  UVT: 34270,
}
