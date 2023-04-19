export const mockItemsNoCertificate = [
  {
    id: '13c9c0e1-9014-4199-80e0-9b8262777ee6',
    code: '1',
    text: 'Información personal',
    type: 'tab',
    instances: [],
  },
  {
    id: '6ba7fcbc-87c3-4e33-a16c-484f4cac6b40',
    code: '1.1.1',
    text: 'Información personal',
    type: 'group',
    instances: [
      {
        instance_id: 'e3b39e3b-3322-466e-8da6-8ab567b79cf8',
        code: '1.1.1.1',
        value: 'Información personal',
        group_code: '1.1.1',
        certificates: [],
      },
      {
        instance_id: '79755326-f747-4ec6-85f2-263e1ca6d7c3',
        code: '1.1.1.1',
        value: 'Información personal',
        group_code: '1.1.1',
        certificates: [],
      },
    ],
  },
]

export const mockItemsWithCertificates = [
  {
    id: '13c9c0e1-9014-4199-80e0-9b8262777ee6',
    code: '1',
    text: 'Información personal',
    type: 'tab',
    instances: [],
  },
  {
    id: '6ba7fcbc-87c3-4e33-a16c-484f4cac6b40',
    code: '1.1.1',
    text: 'Información personal',
    type: 'group',
    instances: [
      {
        instance_id: 'e3b39e3b-3322-466e-8da6-8ab567b79cf8',
        code: '1.1.1.1',
        value: 'Información personal',
        group_code: '1.1.1',
        certificates: [
          {
            id: '8f7a913f-3eb3-4342-9dd4-003089f9a232',
            code: '1.2.1.2',
            text: 'Información de presentación',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/informacio-sancion-dian',
            },
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
            certificate_kind: 'normal',
            is_oculus: false,
            required_level: 2,
            user_certificate: null,
          },
        ],
      },
      {
        instance_id: '79755326-f747-4ec6-85f2-263e1ca6d7c3',
        code: '1.1.1.1',
        value: 'Información personal',
        group_code: '1.1.1',
        certificates: [
          {
            id: '8f7a913f-3eb3-4342-9dd4-003089f9a232',
            code: '1.2.1.2',
            text: 'Información de presentación',
            type: 'certificate',
            values: {
              certificate_url:
                'https://www.tributi.com/ayuda/informacio-sancion-dian',
            },
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
            certificate_kind: 'normal',
            is_oculus: false,
            required_level: 2,
            user_certificate: null,
          },
        ],
      },
    ],
  },
]
