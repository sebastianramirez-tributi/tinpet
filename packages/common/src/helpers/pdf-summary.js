/**
 * @var {[key: string]: data => boolean } config
 * @var {[key: string]:any} data
 */
export const getDeclarationStatus = (config, data = {}) => {
  return Object.keys(config)
    .map((key) => {
      const value = config[key](data)
      return {
        [key]: {
          column: value ? 'success' : 'pending',
          classIcon: value ? 'icon-success' : 'icon-pending',
          icon: value ? 'check-square' : 'close-square',
        },
      }
    })
    .reduce(
      (acc, current) => ({
        ...acc,
        ...current,
      }),
      {}
    )
}
