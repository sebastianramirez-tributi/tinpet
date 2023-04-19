const model = {
  selected: [
    {
      type: 'super_group',
      code: 'selectedObjects',
      objects: [
        {
          id: '31b7d41b-075d-4ebd-9506-4adddcbcaf6f',
          code: '3.1.3',
          text: 'Negocio propio',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si tuviste ingresos por un negocio propio durante el 2020; por ejemplo, si eres comerciante o tienes un negocio de repostería a domicilio. ',
          },
          order: 1256,
          instances_limit: 10,
          has_onboarding: false,
          group_instances: ['instance-id'],
          is_belvo: false,
          is_outlier: false,
          min_value: null,
          max_value: null,
          exogena_group_type: 'collapsible',
        },
      ],
    },
  ],
  relevant: [
    {
      id: '94e5bb06-7403-4bdb-9805-a2ea47c29f64',
      code: '3.1',
      text: 'Ingresos recurrentes',
      type: 'super_group',
      values: null,
      help: {
        title: '',
        documents: [
          {
            url: 'http://',
            description: '',
          },
        ],
        description: '',
      },
      order: 386,
      instances_limit: 50,
      has_onboarding: true,
      group_instances: [],
      is_belvo: false,
      objects: [
        {
          id: '17e4de13-ad65-44f4-8aee-56682725efe5',
          code: '3.1.1',
          text: 'Salarios',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si recibiste ingresos por concepto de salarios durante el 2020. Recuerda que constituyen salarios todos los dineros provenientes de una relación laboral, recibidos como pago por los servicios prestados.',
          },
          order: 388,
          instances_limit: 10,
          has_onboarding: true,
          group_instances: [],
          exogena_group_type: 'relevant',
          is_belvo: false,
        },
      ],
    },
    {
      id: '4382457b-e916-41c6-83ff-209e6f9db103',
      code: '3.3',
      text: 'Ingresos por venta de bienes',
      type: 'super_group',
      values: null,
      help: {
        title: '',
        documents: [
          {
            url: 'http://',
            description: '',
          },
        ],
        description: '',
      },
      order: 2987,
      instances_limit: 10,
      has_onboarding: true,
      group_instances: [],
      is_belvo: false,
      objects: [
        {
          id: 'eb897b06-a4e8-4d64-b4de-4116cef21e79',
          code: '3.3.1',
          text: 'Venta de vehículo',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si vendiste vehículos durante el 2020. ',
          },
          order: 2989,
          instances_limit: 10,
          has_onboarding: true,
          group_instances: [],
          exogena_group_type: 'relevant',
          is_belvo: false,
        },
      ],
    },
  ],
  collapsible: [
    {
      id: '94e5bb06-7403-4bdb-9805-a2ea47c29f64',
      code: '3.1',
      text: 'Ingresos recurrentes',
      type: 'super_group',
      values: null,
      help: {
        title: '',
        documents: [
          {
            url: 'http://',
            description: '',
          },
        ],
        description: '',
      },
      order: 386,
      instances_limit: 50,
      has_onboarding: true,
      group_instances: [],
      is_belvo: false,
      objects: [
        {
          id: 'f9b2786c-e080-4db6-8274-0a9d4e0fb9a1',
          code: '3.1.4',
          text: 'Pensiones',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si recibiste pensiones de jubilación, invalidez, vejez, sobrevivientes o riesgos profesionales durante el 2020. ',
          },
          order: 1757,
          instances_limit: 10,
          has_onboarding: true,
          group_instances: [],
          exogena_group_type: 'collapsible',
          is_belvo: false,
        },
      ],
    },
    {
      id: 'd1adc274-576d-4173-96cf-c603f0c1f0d8',
      code: '3.2',
      text: 'Ingresos por arrendamientos',
      type: 'super_group',
      values: null,
      help: {
        title: '',
        documents: [
          {
            url: 'http://',
            description: '',
          },
        ],
        description: '',
      },
      order: 2813,
      instances_limit: 10,
      has_onboarding: true,
      group_instances: [],
      exogena_group_type: 'collapsible',
      is_belvo: false,
      objects: [
        {
          id: '320dd4a6-871a-42ab-9b2f-d92de70b5282',
          code: '3.2.1',
          text: 'Arrendamiento de bienes raíces',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si recibiste ingresos por arrendamientos de bienes inmuebles durante el 2020. Por ejemplo, si alquilaste un apartamento, una casa, una oficina, un finca, etc. ',
          },
          order: 2815,
          instances_limit: 10,
          has_onboarding: true,
          group_instances: [],
          exogena_group_type: 'collapsible',
          is_belvo: false,
        },
      ],
    },
    {
      id: '4382457b-e916-41c6-83ff-209e6f9db103',
      code: '3.3',
      text: 'Ingresos por venta de bienes',
      type: 'super_group',
      values: null,
      help: {
        title: '',
        documents: [
          {
            url: 'http://',
            description: '',
          },
        ],
        description: '',
      },
      order: 2987,
      instances_limit: 10,
      has_onboarding: true,
      group_instances: [],
      is_belvo: false,
      objects: [
        {
          id: '173f61d2-ce4b-4c4d-886c-f883b63d5e12',
          code: '3.3.2',
          text: 'Venta de bienes raíces (incluye lotes)',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si vendiste bienes raíces, incluyendo lotes, durante el 2020. ',
          },
          order: 3035,
          instances_limit: 10,
          has_onboarding: true,
          group_instances: [],
          exogena_group_type: 'collapsible',
          is_belvo: false,
        },
      ],
    },
    {
      id: '955454e4-9e27-43c0-9cc2-d9262029cf8a',
      code: '3.4',
      text: 'Ingresos ocasionales',
      type: 'super_group',
      values: null,
      help: {
        title: '',
        documents: [
          {
            url: 'http://',
            description: '',
          },
        ],
        description: '',
      },
      order: 3330,
      instances_limit: 10,
      has_onboarding: true,
      group_instances: [],
      is_belvo: false,
      objects: [
        {
          id: '24577165-2969-4ee1-96b6-738f6be6153c',
          code: '3.4.1',
          text: 'Herencia, legado, o donación',
          type: 'group',
          values: null,
          help: {
            title: '',
            documents: [
              {
                url: 'http://',
                description: '',
              },
            ],
            description:
              'Selecciona esta casilla si recibiste herencias, legados o donaciones durante el 2020. Las herencias y legados son derechos que le deja una persona a otra cuando fallece, y las donaciones son dineros que se reciben de forma gratuita. ',
          },
          order: 3332,
          instances_limit: 10,
          has_onboarding: true,
          group_instances: [],
          exogena_group_type: 'collapsible',
          is_belvo: false,
        },
      ],
    },
  ],
}

const initialGroupData = [
  {
    id: '94e5bb06-7403-4bdb-9805-a2ea47c29f64',
    code: '3.1',
    text: 'Ingresos recurrentes',
    type: 'super_group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description: '',
    },
    order: 386,
    instances_limit: 50,
    has_onboarding: true,
    group_instances: [],
    is_belvo: false,
  },
  {
    id: '17e4de13-ad65-44f4-8aee-56682725efe5',
    code: '3.1.1',
    text: 'Salarios',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si recibiste ingresos por concepto de salarios durante el 2020. Recuerda que constituyen salarios todos los dineros provenientes de una relación laboral, recibidos como pago por los servicios prestados.',
    },
    order: 388,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'relevant',
    is_belvo: false,
  },
  {
    id: '31b7d41b-075d-4ebd-9506-4adddcbcaf6f',
    code: '3.1.3',
    text: 'Negocio propio',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si tuviste ingresos por un negocio propio durante el 2020; por ejemplo, si eres comerciante o tienes un negocio de repostería a domicilio. ',
    },
    order: 1256,
    instances_limit: 10,
    has_onboarding: false,
    group_instances: ['instance-id'],
    is_belvo: false,
    is_outlier: false,
    min_value: null,
    max_value: null,
    exogena_group_type: 'collapsible',
  },
  {
    id: 'f9b2786c-e080-4db6-8274-0a9d4e0fb9a1',
    code: '3.1.4',
    text: 'Pensiones',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si recibiste pensiones de jubilación, invalidez, vejez, sobrevivientes o riesgos profesionales durante el 2020. ',
    },
    order: 1757,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'collapsible',
    is_belvo: false,
  },
  {
    id: 'd1adc274-576d-4173-96cf-c603f0c1f0d8',
    code: '3.2',
    text: 'Ingresos por arrendamientos',
    type: 'super_group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description: '',
    },
    order: 2813,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'collapsible',
    is_belvo: false,
  },
  {
    id: '320dd4a6-871a-42ab-9b2f-d92de70b5282',
    code: '3.2.1',
    text: 'Arrendamiento de bienes raíces',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si recibiste ingresos por arrendamientos de bienes inmuebles durante el 2020. Por ejemplo, si alquilaste un apartamento, una casa, una oficina, un finca, etc. ',
    },
    order: 2815,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'collapsible',
    is_belvo: false,
  },
  {
    id: '4382457b-e916-41c6-83ff-209e6f9db103',
    code: '3.3',
    text: 'Ingresos por venta de bienes',
    type: 'super_group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description: '',
    },
    order: 2987,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    is_belvo: false,
  },
  {
    id: 'eb897b06-a4e8-4d64-b4de-4116cef21e79',
    code: '3.3.1',
    text: 'Venta de vehículo',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si vendiste vehículos durante el 2020. ',
    },
    order: 2989,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'relevant',
    is_belvo: false,
  },
  {
    id: '173f61d2-ce4b-4c4d-886c-f883b63d5e12',
    code: '3.3.2',
    text: 'Venta de bienes raíces (incluye lotes)',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si vendiste bienes raíces, incluyendo lotes, durante el 2020. ',
    },
    order: 3035,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'collapsible',
    is_belvo: false,
  },
  {
    id: '955454e4-9e27-43c0-9cc2-d9262029cf8a',
    code: '3.4',
    text: 'Ingresos ocasionales',
    type: 'super_group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description: '',
    },
    order: 3330,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    is_belvo: false,
  },
  {
    id: '24577165-2969-4ee1-96b6-738f6be6153c',
    code: '3.4.1',
    text: 'Herencia, legado, o donación',
    type: 'group',
    values: null,
    help: {
      title: '',
      documents: [
        {
          url: 'http://',
          description: '',
        },
      ],
      description:
        'Selecciona esta casilla si recibiste herencias, legados o donaciones durante el 2020. Las herencias y legados son derechos que le deja una persona a otra cuando fallece, y las donaciones son dineros que se reciben de forma gratuita. ',
    },
    order: 3332,
    instances_limit: 10,
    has_onboarding: true,
    group_instances: [],
    exogena_group_type: 'collapsible',
    is_belvo: false,
  },
]

const summaryDataCompleted = [
  {
    id: 'f55500de-1a55-49c5-a01c-87b142d04db2',
    code: '1',
    text: 'Información personal',
    type: 'tab',
    instances: [],
  },
  {
    id: '56f6c5fe-2dd2-459c-9244-ae4b4640c5c7',
    code: '1.1.1',
    text: 'Información personal',
    type: 'group',
    instances: [
      {
        instance_id: '137f423b-9fb7-4169-88a9-60d4592107c3',
        code: '1.1.1.1',
        value: 'Información personal',
        group_code: '1.1.1',
        certificates: [
          {
            id: '537dd081-3528-4b40-aafd-3f5fffe7e720',
            code: '1.2.1.2',
            text: 'Información de presentación',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/informacio-sancion-dian',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'normal',
            is_oculus: false,
            ocr_status: '',
            is_pseudo_certificate: false,
            required_level: 2,
            user_certificate: {
              id: '2b5b435a-cb6a-4fc6-954f-c31be4f615ff',
              instance_id: '137f423b-9fb7-4169-88a9-60d4592107c3',
              cert_file: null,
              code: '1.2.1.2',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: null,
              status_code: null,
              is_automated: false,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: '537dd081-3528-4b40-aafd-3f5fffe7e720',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-26T16:41:10.423352Z',
              updated_at: '2023-01-26T16:41:10.423394Z',
            },
          },
          {
            id: '7db3513d-2a6d-45ca-b6b4-1c9d8dd42fcf',
            code: '1.2.2.1',
            text: 'RUT',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/registro-unico-tributario-rut',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'normal',
            is_oculus: true,
            ocr_status: 'ready',
            is_pseudo_certificate: false,
            required_level: 1,
            user_certificate: {
              id: '75fc2b10-7ee4-4ed5-a09d-5ccd472dd27b',
              instance_id: '137f423b-9fb7-4169-88a9-60d4592107c3',
              cert_file:
                'https://storage.googleapis.com/api-bucket-labs/certificates/rut_mbHOSjA.pdf?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=storage-labs%40tributilabs.iam.gserviceaccount.com%2F20230126%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230126T203302Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=7c1cd8fc5f6e939c95eceacf70d949801373f5e2cfe56245a98c92f8159fe9ff1ff957226b02c9db532b0d2aac1fcbd58a24a144e7ca267b312eb9664543b1fbc1737908c708b828a146f9c50ab53c630770dccf29eeff5df9f87fef5cddef7b16c9996c0251c1e9d6844431f070648b0193683aab53a4e0a571ca87e942a536a94ee6a8d5c9b3f03367e7747ea706a7bc2742fc5ced19f44840b0eddeef0a122bb0f2354cdf6046c8ae33b5f71199504d9f010609844ca4d457ba129a5f3142b187bf05677615276dfe3bd0b3b73968efd4c171814ee91dfee008ba6582dfc418472e90adaebead5d02ef1ca393cf73cb729266ceea6069a738328f00059541',
              code: '1.2.2.1',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: 'processed',
              status_code: null,
              is_automated: true,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: '7db3513d-2a6d-45ca-b6b4-1c9d8dd42fcf',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-17T21:36:05.286032Z',
              updated_at: '2023-01-17T21:36:05.286066Z',
            },
          },
          {
            id: '8d95cea0-3548-4f2c-b499-5d7652efeb54',
            code: '1.2.2.3',
            text: 'Información reportada por la DIAN (información exógena)',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/informacion-reportada-terceros-exogena',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'exógena',
            is_oculus: false,
            ocr_status: '',
            is_pseudo_certificate: false,
            required_level: 1,
            user_certificate: {
              id: '7bcacd05-a8c1-4660-a130-13669a296033',
              instance_id: '137f423b-9fb7-4169-88a9-60d4592107c3',
              cert_file: '',
              code: '1.2.2.3',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: null,
              status_code: null,
              is_automated: true,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: '8d95cea0-3548-4f2c-b499-5d7652efeb54',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-17T21:36:06.351461Z',
              updated_at: '2023-01-17T21:36:06.351498Z',
            },
          },
        ],
        status: 'complete',
      },
    ],
  },
  {
    id: 'e9af3901-6cf5-42b6-b602-403f11558a4f',
    code: '2',
    text: 'Bienes',
    type: 'tab',
    instances: [],
  },
  {
    id: '348b5295-ad6b-49d0-8771-a0700586af33',
    code: '2.1.1',
    text: 'Carros, motos y demás vehículos',
    type: 'group',
    instances: [
      {
        instance_id: 'e8cdc74e-1f46-40de-97a5-acf89e2abf6e',
        code: '2.1.1.3',
        value: 'Carros, motos y demás vehículos (KKK999)',
        group_code: '2.1.1',
        certificates: [
          {
            id: 'fe4863d9-f8f9-499b-ae31-b372ed9f1ac8',
            code: '2.3.1.1',
            text: 'Valor de compra aproximado o factura de impuesto del vehículo',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/factura-compra-vehiculo',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'normal',
            is_oculus: false,
            ocr_status: '',
            is_pseudo_certificate: true,
            required_level: 2,
            user_certificate: {
              id: '58b30aab-8198-41a9-b554-290b6185c997',
              instance_id: 'e8cdc74e-1f46-40de-97a5-acf89e2abf6e',
              cert_file: null,
              code: '2.3.1.1',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: null,
              status_code: null,
              is_automated: false,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: 'fe4863d9-f8f9-499b-ae31-b372ed9f1ac8',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-26T16:58:10.744453Z',
              updated_at: '2023-01-26T16:58:10.744490Z',
            },
          },
        ],
        status: 'complete',
      },
    ],
  },
  {
    id: '47caa845-249c-4e2c-bf2d-a39a4724d5ae',
    code: '3',
    text: 'Ingresos',
    type: 'tab',
    instances: [],
  },
  {
    id: '131af568-3b23-46e0-bac3-2c04857720e1',
    code: '3.1.1',
    text: 'Salarios',
    type: 'group',
    instances: [
      {
        instance_id: '55efb287-6703-4c57-8272-8002f3552211',
        code: '3.1.1.3',
        value: 'Salarios (IC TECNOLOGIA SAS)',
        group_code: '3.1.1',
        certificates: [
          {
            id: '3aceefb2-80e8-4462-8eaf-8515791f7719',
            code: '3.5.1.1',
            text: 'Certificado de ingresos y Retenciones 220',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/certificado-salarios-220',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'normal',
            is_oculus: true,
            ocr_status: 'ready',
            is_pseudo_certificate: false,
            required_level: 1,
            user_certificate: {
              id: 'c1eb9d9e-b4d0-4a43-9424-23ab9822469f',
              instance_id: '55efb287-6703-4c57-8272-8002f3552211',
              cert_file: null,
              code: '3.5.1.1',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: null,
              status_code: null,
              is_automated: false,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: '3aceefb2-80e8-4462-8eaf-8515791f7719',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-17T21:37:35.053321Z',
              updated_at: '2023-01-17T21:37:35.053366Z',
            },
          },
          {
            id: 'ae198772-7689-4a9e-a9e3-0633c7369a56',
            code: '3.5.1.2',
            text: 'Información adicional salario',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/certificado-salarios-220',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'normal',
            is_oculus: false,
            ocr_status: '',
            is_pseudo_certificate: false,
            required_level: 2,
            user_certificate: {
              id: '6193fd7d-33e5-4dae-8b7d-fbac9ec75ada',
              instance_id: '55efb287-6703-4c57-8272-8002f3552211',
              cert_file: null,
              code: '3.5.1.2',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: null,
              status_code: null,
              is_automated: false,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: 'ae198772-7689-4a9e-a9e3-0633c7369a56',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-17T21:37:35.105594Z',
              updated_at: '2023-01-26T17:06:39.091925Z',
            },
          },
        ],
        status: 'complete',
      },
    ],
  },
]

const summaryData = [
  ...summaryDataCompleted,
  {
    id: '2a9466c9-7ac4-4634-9f26-0992385d5535',
    code: '3.1.2',
    text: 'Honorarios, servicios o comisiones como independiente',
    type: 'group',
    instances: [
      {
        instance_id: '88c7ce4e-9945-42f4-9a79-7c8b339917af',
        code: '3.1.2.61',
        value: 'Honorarios, servicios o comisiones como independiente (ABC)',
        group_code: '3.1.2',
        certificates: [
          {
            id: 'c71fffad-a615-44d1-b554-78bef2721825',
            code: '3.5.2.1',
            text: 'Información ingresos y gastos',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/certificado-ingresos-retenciones-honorarios',
            },
            help: {
              title: '',
              documents: [{ url: 'http://', description: '' }],
              description: '',
            },
            certificate_kind: 'normal',
            is_oculus: false,
            ocr_status: '',
            is_pseudo_certificate: true,
            required_level: 2,
            user_certificate: {
              id: '7028083a-2fe1-42b8-86b4-5a454ab7dc38',
              instance_id: '88c7ce4e-9945-42f4-9a79-7c8b339917af',
              cert_file: null,
              code: '3.5.2.1',
              filling: '17c19ffc-0be3-434d-9262-41dda9ff95f1',
              status: 'processed',
              read_status: null,
              status_code: null,
              is_automated: false,
              author: 'b087b9a2-bdaa-4119-9c71-c7085b0e9349',
              taxobject: 'c71fffad-a615-44d1-b554-78bef2721825',
              tax_inputs: [],
              oculus_error: false,
              created_at: '2023-01-18T14:26:59.303540Z',
              updated_at: '2023-01-26T17:08:35.899290Z',
            },
          },
        ],
        status: 'partial',
      },
    ],
  },
]

export { model, initialGroupData, summaryData, summaryDataCompleted }
