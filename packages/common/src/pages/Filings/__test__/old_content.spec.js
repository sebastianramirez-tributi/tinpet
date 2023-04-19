import React from 'react'
import { mount } from 'enzyme'
import moment from 'moment'
import { act } from 'react-dom/test-utils'
import {
  MockWithProvidersLegacy,
  themeProvider,
  rootContextProvider,
  reduxProvider,
  routerProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import {
  clearCurrentFiling,
  deleteFiling as deleteLocalFiling,
} from '../../../redux/personalInfo/actions'

import Filing from '../content'
import Person from '../../../components/Filings/Person'

const PERSON_DATA = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  filings: [
    {
      id: 100,
      tax_year: '2018',
      due_date: '2019-10-01',
    },
  ],
}

const setup = (baseProps, reduxPersonalInfo) => {
  const props = {
    loadPersons: jest.fn(),
    calculateFilings: jest.fn(),
    submitPerson: jest.fn(),
    deletePerson: jest.fn(),
    createFiling: jest.fn(),
    modifyFiling: jest.fn(),
    deleteFiling: jest.fn(),
    deleteFilingSnapshot: jest.fn(),
    getFillingState: jest.fn(),
    setIsAccountant: jest.fn(),
    clearPaymentOrderInfo: jest.fn(),
    ...baseProps,
  }
  const store = overwriteStore({
    personalInfo: reduxPersonalInfo,
  })
  const wrapper = MockWithProvidersLegacy(<Filing {...props} />, mount, [
    themeProvider(),
    rootContextProvider(),
    reduxProvider(store),
    routerProvider(),
  ])
  return { props, wrapper, store }
}

xdescribe('Filings page spec', () => {
  it('should show headers of table', () => {
    const { wrapper } = setup({
      persons: [PERSON_DATA],
    })
    expect(wrapper.find('HeaderItem').at(0).find('div').text()).toEqual(
      'Año Gravable'
    )
    expect(wrapper.find('HeaderItem').at(1).find('div').text()).toEqual(
      'Fecha de vencimiento'
    )
    expect(wrapper.find('HeaderItem').at(2).find('div').text()).toEqual('Plan')
    expect(wrapper.find('HeaderItem').at(3).find('div').text()).toEqual(
      'Acciones'
    )
    // Pending to do UT for expect(wrapper).toMatchSnapshot()
  })

  it('should call loadPersons just once', () => {
    const { props, wrapper } = setup()
    expect(props.loadPersons).toHaveBeenCalled()
    wrapper.setProps({
      persons: [PERSON_DATA],
    })
    expect(props.loadPersons).toHaveBeenCalledTimes(1)
  })

  it('should not render any person if no person data is given', () => {
    const { wrapper } = setup()
    expect(wrapper.find(Person)).toHaveLength(0)
  })

  it('should render every person with filings data', () => {
    const { props, wrapper } = setup({
      persons: [PERSON_DATA],
    })
    expect(wrapper.find(Person)).not.toHaveLength(0)
    props.persons.forEach(
      ({ first_name: firstName, last_name: lastName, filings }, idx) => {
        const person = wrapper.find(`[data-testid="filing-person"]`).at(idx)
        expect(person.exists()).toBeTruthy()
        expect(person).toHaveLength(1)
        expect(person.find(`[data-testid="filing-person-name"]`).text()).toBe(
          `${firstName} ${lastName}`
        )
        filings.forEach((filing) => {
          expect(
            wrapper.find(`div[data-testid="filing-${filing.id}"]`)
          ).toHaveLength(1)
          expect(
            wrapper
              .find(
                `div[data-testid="filing-${filing.id}"] div[data-testid="tax-year"]`
              )
              .text()
          ).toContain(filing.tax_year)
          expect(
            wrapper
              .find(
                `div[data-testid="filing-${filing.id}"] div[data-testid="due-date"]`
              )
              .text()
          ).toContain(moment(filing.due_date).format('DD [de] MMMM [de] YYYY'))
        })
      }
    )
  })

  it('Should call deleteFiling with no filing in redux state', () => {
    const { props, wrapper } = setup({
      persons: [PERSON_DATA],
    })
    const { deleteFiling } = props
    deleteFiling.mockResolvedValue({})
    wrapper.find(Person).prop('onDeleteFiling')()
    expect(deleteFiling).toBeCalled()
  })

  it('Should call deleteFiling with filing in redux state', async () => {
    const PERSON_ID = 'testing-id'
    const FILING_ID = 'testing-filing'
    const mockPersonalInfo = {
      id: PERSON_ID,
      first_name: 'John',
      last_name: 'Doe',
      localFilings: [
        {
          id: FILING_ID,
          tax_year: 2018,
          due_date: '2019-10-01',
        },
      ],
      own_person: {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
      },
    }
    const { props, wrapper, store } = setup(
      {
        persons: [PERSON_DATA],
      },
      mockPersonalInfo
    )
    const { deleteFiling } = props
    deleteFiling.mockResolvedValue({})
    await act(async () => {
      wrapper.find(Person).prop('onDeleteFiling')(PERSON_ID, FILING_ID)
      expect(deleteFiling).toBeCalled()
      expect(deleteFiling).toHaveBeenCalledWith(PERSON_ID, FILING_ID)
      await expect(deleteFiling()).resolves.toEqual({})
      expect(store.dispatch.mock.calls[0]).toEqual([
        deleteLocalFiling(FILING_ID),
      ])
    })
  })
})
