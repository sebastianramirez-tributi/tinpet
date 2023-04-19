export const uploadedCertificate = {
  id: 'test-id',
  code: '1.',
  text: 'Certificado Test',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/test',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: {
    id: 'test-id',
    created_at: '2020-07-08T22:54:11.462425Z',
    updated_at: '2020-07-08T22:54:11.462487Z',
    instance_id: '93cccecd-ffd3-475a-a1cd-00b1e229bfe9',
    cert_file: 'https://test-certificate/location',
    code: '1.',
    is_active: true,
    docucharm_id: null,
    status: 'processed',
    read_status: 'processed',
    is_automated: true,
    filling: 'e71d07a4-c2de-41a3-a841-d6a8c5e9ff83',
    author: '53b11d42-d83d-44ec-b9c3-a639d75a7003',
    taxobject: 'fc964b83-9a81-4945-9d13-fb8e2fd0f956',
  },
}

export const exogenaCertificate = {
  id: 'test-id-exogena',
  code: '1.',
  text: 'Exogena Test',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/exogena',
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
  certificate_kind: 'exógena',
  is_oculus: false,
  required_level: 1,
  user_certificate: null,
}

export const blankCertificate = {
  id: 'test-id-blank-cert',
  code: '1.',
  text: 'Cert Blank',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/cert',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: null,
}

export const partialCertificate = {
  id: 'test-partial-id',
  code: '1.',
  text: 'Certificate partial',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/partial',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: {
    id: '4dffdd14-e847-4b3c-a69b-48ff763879f2',
    created_at: '2020-07-14T20:19:33.718842Z',
    updated_at: '2020-07-14T20:19:33.718896Z',
    instance_id: 'e8209b07-67ef-4c3a-a14c-2567d9516e6f',
    cert_file: null,
    code: '1.',
    is_active: true,
    docucharm_id: null,
    status: 'partial',
    is_automated: false,
    filling: '80d1e478-3045-475f-a04f-aacb019fe9d9',
    author: '53b11d42-d83d-44ec-b9c3-a639d75a7003',
    taxobject: 'fc964b83-9a81-4945-9d13-fb8e2fd0f956',
  },
}

export const processingCertificate = {
  id: 'fbfe41a4-9413-4684-b31e-530baaf09e92',
  code: '2.',
  text: 'RUT',
  type: 'certificate',
  values: {
    certificate_url:
      'https://www.tributi.com/ayuda/registro-unico-tributario-rut',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: {
    id: 'eb36e2db-5ecb-4dbb-8ff2-ab0fbe5f7160',
    created_at: '2020-07-15T21:54:52.500793Z',
    updated_at: '2020-07-15T21:54:52.500858Z',
    instance_id: 'ba1798e0-0e61-444b-8f54-dfa44beb5a6c',
    cert_file: 'https://storage.googleapis.com/cert',
    code: '6.2.1.1',
    is_active: true,
    docucharm_id: '5691a733-db9f-4896-b84c-b33b03c066b3',
    status: 'processing',
    is_automated: true,
    filling: 'ee9678ce-da0a-4385-9bae-f86c00b18cf8',
    author: '53b11d42-d83d-44ec-b9c3-a639d75a7003',
    taxobject: 'fbfe41a4-9413-4684-b31e-530baaf09e92',
  },
}

export const failedCertificate = {
  id: 'fbfe41a4-9413-4684-b31e-530baaf09e92',
  code: '2.',
  text: 'RUT',
  type: 'certificate',
  values: {
    certificate_url:
      'https://www.tributi.com/ayuda/registro-unico-tributario-rut',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: {
    id: 'eb36e2db-5ecb-4dbb-8ff2-ab0fbe5f7160',
    created_at: '2020-07-15T21:54:52.500793Z',
    updated_at: '2020-07-15T21:54:52.500858Z',
    instance_id: 'ba1798e0-0e61-444b-8f54-dfa44beb5a6c',
    cert_file: 'https://storage.googleapis.com/failed-cert',
    code: '2.',
    is_active: true,
    docucharm_id: '5691a733-db9f-4896-b84c-b33b03c066b3',
    status: 'failed',
    is_automated: true,
    filling: 'ee9678ce-da0a-4385-9bae-f86c00b18cf8',
    author: '53b11d42-d83d-44ec-b9c3-a639d75a7003',
    taxobject: 'fbfe41a4-9413-4684-b31e-530baaf09e92',
  },
}

export const passwordCerticate = {
  id: 'fc964b83-9a81-4945-9d13-fb8e2fd0f956',
  code: '5.4.1.1',
  text: 'Certificado anual de retención en la fuente e información adicional',
  type: 'certificate',
  values: {
    certificate_url:
      'https://www.tributi.com/ayuda/certificado-bancolombia-retencion',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: {
    id: '7e69d287-52e5-414a-972d-a8b8b0c679ea',
    created_at: '2020-07-15T22:28:36.838383Z',
    updated_at: '2020-07-15T22:28:36.838572Z',
    instance_id: '4562c1b2-418a-4663-8720-681bc6195d46',
    cert_file: 'https://storage.googleapis.com/pass-cert',
    code: '5.4.1.1',
    is_active: true,
    docucharm_id: null,
    status: 'pending',
    is_automated: true,
    filling: 'ee9678ce-da0a-4385-9bae-f86c00b18cf8',
    author: '53b11d42-d83d-44ec-b9c3-a639d75a7003',
    taxobject: 'fc964b83-9a81-4945-9d13-fb8e2fd0f956',
  },
}

export const manualCompletedCertificate = {
  id: '1234',
  code: '3.5.10.1',
  text: 'Información ingresos y gastos',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/honorarios',
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
  user_certificate: {
    id: '4354543',
    created_at: '2020-09-10T12:24:50.392970Z',
    updated_at: '2020-09-10T12:25:24.352058Z',
    instance_id: 'f0af264f-e053-4a9d-b977-ed31f738ec2e',
    cert_file: null,
    code: '3.5.10.1',
    is_active: true,
    docucharm_id: null,
    status: 'processed',
    is_automated: false,
    filling: 'ee9678ce-da0a-4385-9bae-f86c00b18cf8',
    author: '44088b0c-6fa0-4350-b4f8-5f2ac261751e',
    taxobject: '27e31a28-2050-4f07-84ea-73d731551c84',
  },
}

export const partialAutomatedCertificate = {
  id: 'test-partial-id',
  code: '1.',
  text: 'Certificate partial',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/partial',
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
  is_oculus: true,
  required_level: 1,
  user_certificate: {
    id: '4dffdd14-e847-4b3c-a69b-48ff763879f2',
    created_at: '2020-07-14T20:19:33.718842Z',
    updated_at: '2020-07-14T20:19:33.718896Z',
    instance_id: 'e8209b07-67ef-4c3a-a14c-2567d9516e6f',
    cert_file: null,
    code: '1.',
    is_active: true,
    docucharm_id: null,
    status: 'partial',
    is_automated: true,
    filling: '80d1e478-3045-475f-a04f-aacb019fe9d9',
    author: '53b11d42-d83d-44ec-b9c3-a639d75a7003',
    taxobject: 'fc964b83-9a81-4945-9d13-fb8e2fd0f956',
  },
}
export const missingInfoCertificate = {
  id: 'test-id-blank-cert',
  code: '1.',
  text: 'Cert Missing',
  type: 'certificate',
  values: {
    certificate_url: 'https://www.tributi.com/ayuda/cert',
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
  user_certificate: null,
}
