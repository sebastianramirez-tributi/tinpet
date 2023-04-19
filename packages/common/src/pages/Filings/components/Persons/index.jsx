import React from 'react'

import Person from '../../../../components/Filings/Person'
import { ContainerPersons } from './style'
import { TABLE_PROP_TYPES } from '../../utils'

function Persons({
  persons,
  onEditPerson,
  onDeletePerson,
  onContinueFiling,
  onDeleteFiling,
  onChangePlan,
}) {
  const table = persons.map(
    ({
      first_name: firstName,
      last_name: lastName,
      is_own_person: isOwnPerson,
      ...person
    }) => (
      <Person
        {...person}
        key={person.id}
        name={`${firstName} ${lastName}`}
        isOwnPerson={isOwnPerson}
        onEdit={onEditPerson}
        onDelete={onDeletePerson}
        onContinueFiling={onContinueFiling}
        onDeleteFiling={onDeleteFiling}
        onChangePlan={onChangePlan}
      />
    )
  )

  return <ContainerPersons>{table}</ContainerPersons>
}

Persons.propTypes = TABLE_PROP_TYPES

export default Persons
