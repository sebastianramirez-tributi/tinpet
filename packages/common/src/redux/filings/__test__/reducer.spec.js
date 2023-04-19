import { FILING_STATUS, STATUS_HUMANIZATED } from '../../../constants/filings'
import { INITIAL_STATE } from '../constants'
import { formattedDate, formattedDateTime } from '../utils'
import * as reducer from '../reducer'

jest.mock('../../../helpers/collections', () => ({
  getMaxTaxYear: () => 2022,
}))

describe('filings reducer specs', () => {
  it('should set into state persons from payload when `setPersons` is called', () => {
    const DATA = ['info']
    expect(reducer.setPersons(INITIAL_STATE, DATA)).toEqual({
      ...INITIAL_STATE,
      persons: DATA,
    })
  })

  it('should remove from state a person with the given id when `removePerson` is called', () => {
    const PERSON_TO_REMOVE = { id: 'test' }
    const STATE = {
      ...INITIAL_STATE,
      persons: [PERSON_TO_REMOVE],
    }
    expect(reducer.removePerson(STATE, PERSON_TO_REMOVE.id)).toEqual({
      ...INITIAL_STATE,
    })
  })

  it('should remove from state the persons with `is_own_person` equals true when `excludeOwnPerson` is called', () => {
    const PERSON_TO_REMOVE = { is_own_person: true }
    const STATE = {
      ...INITIAL_STATE,
      persons: [PERSON_TO_REMOVE],
    }
    expect(reducer.excludeOwnPerson(STATE)).toEqual({
      ...INITIAL_STATE,
    })
  })

  it('should add missing filings to persons on state when when `mockFilings` is called`', () => {
    const FILINGS = [
      {
        id: 'test id',
        document_id: 'document test',
        first_name: 'fist name test',
        last_name: 'last name test',
        person_id: 'person id test',
        status: 'test',
        tax_year: 2018,
      },
    ]
    const PERSON_DATA = {
      document_id: 'document test',
      first_name: 'fist name test',
      last_name: 'last name test',
      person_id: 'person id test',
    }
    const PERSON = {
      ...PERSON_DATA,
      id: 'person id test',
      filings: FILINGS,
    }
    const STATE = {
      ...INITIAL_STATE,
      persons: [PERSON],
    }

    const MOCKED_FILINGS = [
      {
        ...PERSON_DATA,
        status: FILING_STATUS.UN_STARTED,
        mock: true,
        tax_year: 2022,
      },
      {
        ...PERSON_DATA,
        status: FILING_STATUS.UN_STARTED,
        mock: true,
        tax_year: 2021,
      },
      {
        ...PERSON_DATA,
        status: FILING_STATUS.UN_STARTED,
        mock: true,
        tax_year: 2020,
      },
      {
        ...PERSON_DATA,
        status: FILING_STATUS.UN_STARTED,
        mock: true,
        tax_year: 2019,
      },
      ...FILINGS,
    ]
    expect(reducer.mockFilings(STATE, {})).toEqual({
      ...INITIAL_STATE,
      persons: [
        {
          ...PERSON,
          filings: MOCKED_FILINGS,
        },
      ],
    })
  })

  it('should mock due date from filings', () => {
    const FILING = {
      id: 'test id',
      document_id: 'document test',
      first_name: 'fist name test',
      last_name: 'last name test',
      person_id: 'person id test',
      status: 'test',
      tax_year: 2021,
      due_date: null,
    }

    const PERSON_DATA = {
      document_id: '10012301',
      user_document_type: 'cedula_de_ciudadania',
      first_name: 'fist name test',
      last_name: 'last name test',
      person_id: 'person id test',
    }
    const PERSON = {
      ...PERSON_DATA,
      id: 'person id test',
      filings: [FILING],
    }
    const STATE = {
      ...INITIAL_STATE,
      persons: [PERSON],
    }

    expect(reducer.mockDueDates(STATE, {})).toEqual({
      ...INITIAL_STATE,
      persons: [
        {
          ...PERSON,
          filings: [
            {
              ...FILING,
              due_date: '2022/08/09',
            },
          ],
        },
      ],
    })
  })

  it('should update state with a give payload when `updateFilingsTable` is called', () => {
    const PERSONS = ['test 1', 'test 2']
    expect(
      reducer.updateFilingsTable(INITIAL_STATE, { persons: PERSONS })
    ).toEqual({
      ...INITIAL_STATE,
      persons: PERSONS,
    })
  })

  it('should set normalized and filtered into state from persons, by flattening the filings when `formatFilingsTable` is called', () => {
    const FILING = {
      id: 'filing id',
      document_id: 'document id',
      due_date: '2020-01-12',
      first_name: 'first',
      last_name: 'last',
      is_submitted: false,
      person_id: 'person',
      scheduling: { scheduled_at: 'scheduled' },
      status: FILING_STATUS.CREATED,
      tax_year: 2020,
      owner: undefined,
    }

    const PERSON = {
      filings: [FILING],
    }

    const FILING_NORMALIZED = {
      key: `person-${FILING.document_id}-${0}`,
      name: 'first last',
      firstName: 'first',
      lastName: 'last',
      nit: FILING.document_id,
      personId: FILING.person_id,
    }

    const NORMALIZED = [
      {
        ...FILING_NORMALIZED,
        name: 'first last' + ' - NIT: ' + FILING.document_id,
        id: [FILING.id],
        filingName: 'first last',
        children: [
          {
            ...FILING_NORMALIZED,
            id: FILING.id,
            key: `filing-${FILING.document_id}-${0}`,
            taxYear: FILING.tax_year,
            dueDate: formattedDate(FILING.due_date),
            scheduled: formattedDateTime(FILING.scheduling.scheduled_at),
            isSubmitted: FILING.is_submitted,
            status: STATUS_HUMANIZATED[FILING.status],
            filing: FILING,
          },
        ],
      },
    ]

    const STATE = {
      ...INITIAL_STATE,
      persons: [PERSON],
    }
    expect(reducer.formatFilingsTable(STATE)).toEqual({
      ...STATE,
      normalized: NORMALIZED,
      filtered: NORMALIZED,
    })
  })

  it('should update filtered on state filtering by nit and name when `filterFilingsTable` is called', () => {
    const PERSONS = [
      {
        filings: [
          {
            id: 'filing id 1',
            document_id: 'findable test 1',
            due_date: '2020-01-12',
            first_name: 'search',
            last_name: 'and find',
            is_submitted: false,
            person_id: 'person-1',
            scheduling: { scheduled_at: 'scheduled' },
            status: FILING_STATUS.CREATED,
            tax_year: 2020,
            owner: undefined,
          },
        ],
      },
      {
        filings: [
          {
            id: 'filing id 2',
            document_id: 'not findable test 2',
            due_date: '2020-01-12',
            first_name: 'search',
            last_name: 'and find',
            is_submitted: false,
            person_id: 'person-2',
            scheduling: { scheduled_at: 'scheduled' },
            status: FILING_STATUS.CREATED,
            tax_year: 2020,
            owner: undefined,
          },
        ],
      },
    ]

    const NORMALIZED = reducer.formatFilingsTable({ persons: PERSONS })

    const STATE = {
      ...INITIAL_STATE,
      ...NORMALIZED,
      persons: PERSONS,
    }
    expect(
      reducer.filterFilingsTable(STATE, {
        filings: NORMALIZED.normalized,
        filters: { search: 'findable test 1' },
        sort: false,
      })
    ).toEqual({
      ...STATE,
      filtered: [STATE.normalized[0]],
    })
  })

  it('should update filtered by flattening when `filterFilingsTable` is called', () => {
    const PERSONS = [
      {
        filings: [
          {
            id: 'filing id 1',
            document_id: 'findable test 1',
            due_date: '2021-01-12',
            first_name: 'search',
            last_name: 'and find',
            is_submitted: false,
            person_id: 'person-1',
            scheduling: { scheduled_at: 'scheduled' },
            status: FILING_STATUS.CREATED,
            tax_year: 2020,
            owner: undefined,
          },
        ],
      },
      {
        filings: [
          {
            id: 'filing id 2',
            document_id: 'not findable test 2',
            due_date: '2022-01-12',
            first_name: 'search',
            last_name: 'and find',
            is_submitted: false,
            person_id: 'person-2',
            scheduling: { scheduled_at: 'scheduled' },
            status: FILING_STATUS.CREATED,
            tax_year: 2021,
            owner: undefined,
          },
        ],
      },
    ]

    const NORMALIZED = reducer.formatFilingsTable({ persons: PERSONS })

    const STATE = {
      ...INITIAL_STATE,
      ...NORMALIZED,
      persons: PERSONS,
    }
    expect(
      reducer.filterFilingsTable(STATE, {
        filings: NORMALIZED.normalized,
        filters: {},
        sort: true,
      })
    ).toEqual({
      ...STATE,
      filtered: [
        ...STATE.normalized[0].children,
        ...STATE.normalized[1].children,
      ],
    })
  })
})
