import { v4 as uuidv4 } from 'uuid'

const itemIdGenerate = uuidv4()

const groupFactory = ({
  helpDek = '',
  exogenaGroupType,
  groupInstances = [],
  type = 'super_group',
  code,
  text,
  order,
  hasOnboarding,
  itemId,
  status,
}) => {
  return {
    id: itemId,
    code,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description: helpDek,
    },
    type,
    values: null,
    has_onboarding: hasOnboarding,
    exogena_group_type: exogenaGroupType,
    is_belvo: false,
    group_instances: groupInstances,
    instances_limit: 50,
    text,
    order,
    status,
  }
}

const noExogenaRelevant = {
  relevant: [
    {
      ...groupFactory({
        code: '3.1',
        text: 'Ingresos recurrentes',
        order: 386,
        hasOnboarding: true,
        itemId: itemIdGenerate,
      }),
      objects: [
        {
          ...groupFactory({
            helpDek:
              'Selecciona esta casilla si recibiste ingresos por concepto de salarios durante el 2020. Recuerda que constituyen salarios todos los dineros provenientes de una relación laboral, recibidos como pago por los servicios prestados.',
            type: 'group',
            code: '3.1.1',
            text: 'Salarios',
            order: 388,
            hasOnboarding: true,
            itemId: itemIdGenerate,
          }),
        },
      ],
    },
  ],
}

const exogenaRelevantOnly = {
  relevant: [
    {
      ...groupFactory({
        code: '3.1',
        text: 'Ingresos recurrentes',
        order: 386,
        hasOnboarding: true,
        itemId: itemIdGenerate,
      }),
      objects: [
        {
          ...groupFactory({
            helpDek:
              'Selecciona esta casilla si recibiste ingresos por concepto de salarios durante el 2020. Recuerda que constituyen salarios todos los dineros provenientes de una relación laboral, recibidos como pago por los servicios prestados.',
            exogenaGroupType: 'relevant',
            type: 'group',
            code: '3.1.1',
            text: 'Salarios',
            order: 388,
            hasOnboarding: true,
            itemId: itemIdGenerate,
          }),
        },
      ],
    },
  ],
}

// no need to prefix with exogena since this only will apply
// if the exogena filter is present.
const relevantAndCollapsible = {
  relevant: exogenaRelevantOnly.relevant,
  collapsible: [
    {
      ...groupFactory({
        code: '3.1',
        text: 'Ingresos recurrentes',
        order: 386,
        hasOnboarding: true,
        itemId: itemIdGenerate,
      }),
      objects: [
        {
          ...groupFactory({
            helpDek:
              'Selecciona esta casilla si recibiste pensiones de jubilación, invalidez, vejez, sobrevivientes o riesgos profesionales durante el 2020. ',
            exogenaGroupType: 'collapsible',
            type: 'group',
            code: '3.1.4',
            text: 'Pensiones',
            order: 388,
            hasOnboarding: true,
            id: 'test-id-please',
            itemId: itemIdGenerate,
          }),
        },
      ],
    },
  ],
}

const relevantAndCollapsibleInstances = {
  selected: [
    {
      type: 'super_group',
      code: 'selectedObjects',
      objects: [
        {
          ...groupFactory({
            helpDek:
              'Selecciona esta casilla si recibiste pensiones de jubilación, invalidez, vejez, sobrevivientes o riesgos profesionales durante el 2020. ',
            exogenaGroupType: 'collapsible',
            type: 'group',
            code: '3.1.4',
            text: 'Pensiones',
            order: 388,
            groupInstances: ['test'],
            hasOnboarding: true,
            itemId: itemIdGenerate,
          }),
        },
      ],
    },
  ],
  relevant: exogenaRelevantOnly.relevant,
  collapsible: [
    {
      ...groupFactory({
        code: '3.1',
        text: 'Ingresos recurrentes',
        order: 386,
        hasOnboarding: true,
        itemId: itemIdGenerate,
      }),
      objects: [
        {
          ...groupFactory({
            helpDek: 'Selecciona esta casilla si recibiste honorarios',
            exogenaGroupType: 'collapsible',
            type: 'group',
            code: '3.1.2',
            text: 'Honorarios',
            order: 388,
            groupInstances: [],
            hasOnboarding: true,
            itemId: itemIdGenerate,
          }),
        },
      ],
    },
  ],
}

const relevantWithIncreaseAndDecrease = {
  selected: [
    {
      type: 'super_group',
      code: 'selectedObjects',
      objects: [
        {
          ...groupFactory({
            helpDek:
              'Selecciona esta casilla si recibiste ingresos provenientes de regalías, explotación de propiedad intelectual o derechos de autor durante el 2021. Por ejemplo, por la explotación de una marca o patente, o por la elaboración y publicación de un libro, etc.',
            exogenaGroupType: 'relevant',
            groupInstances: ['instance-id'],
            type: 'group',
            code: '3.1.5',
            text: 'Regalías, propiedad intelectual o derechos de autor',
            order: 1353,
            hasOnboarding: false,
            itemId: 'instance-id',
          }),
        },
      ],
    },
  ],
  relevant: exogenaRelevantOnly.relevant,
  collapsible: [
    {
      ...groupFactory({
        code: '3.1',
        text: 'Ingresos recurrentes',
        order: 386,
        hasOnboarding: true,
        itemId: itemIdGenerate,
      }),
      objects: [
        {
          ...groupFactory({
            helpDek: 'Selecciona esta casilla si recibiste honorarios',
            exogenaGroupType: 'relevant',
            groupInstances: [],
            type: 'group',
            code: '3.1.2',
            text: 'Honorarios',
            order: 1353,
            hasOnboarding: false,
            itemId: 'instance-id',
          }),
        },
      ],
    },
  ],
}

const partialInformation = {
  selected: [
    {
      type: 'super_group',
      code: 'selectedObjects',
      objects: [
        {
          ...groupFactory({
            helpDek: 'Selecciona esta casilla si recibiste honorarios',
            exogenaGroupType: 'relevant',
            groupInstances: [],
            type: 'group',
            code: '3.1.2',
            text: 'Honorarios',
            order: 1353,
            hasOnboarding: false,
            itemId: 'instance-id',
            status: 'partial',
          }),
        },
      ],
    },
  ],
  relevant: exogenaRelevantOnly.relevant,
  collapsible: [
    {
      ...groupFactory({
        code: '3.1',
        text: 'Ingresos recurrentes',
        order: 386,
        hasOnboarding: true,
        itemId: itemIdGenerate,
      }),
      objects: [
        {
          ...groupFactory({
            helpDek:
              'Selecciona esta casilla si recibiste ingresos provenientes de regalías, explotación de propiedad intelectual o derechos de autor durante el 2021. Por ejemplo, por la explotación de una marca o patente, o por la elaboración y publicación de un libro, etc.',
            exogenaGroupType: 'relevant',
            groupInstances: ['instance-id'],
            type: 'group',
            code: '3.1.5',
            text: 'Regalías, propiedad intelectual o derechos de autor',
            order: 1353,
            hasOnboarding: false,
            itemId: 'instance-id',
          }),
        },
      ],
    },
  ],
}

export {
  exogenaRelevantOnly,
  relevantAndCollapsible,
  noExogenaRelevant,
  relevantAndCollapsibleInstances,
  relevantWithIncreaseAndDecrease,
  partialInformation,
}
