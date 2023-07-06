import React from 'react'
import { Details } from './Details'
import { OriginalBar } from './OriginalBar'
import { Cards } from './Cards'
import { UserCards } from './UserCards'
import { Activity } from '../../main/Item/Activity'

import {
  Container,
} from './styles'
import { useApi } from '../../../contexts/ApiContext';
export const Dashboard = () => {
  const [{getRole}] = useApi();
  const role = getRole();
  return (
    <Container>
      <Details />

       <OriginalBar />
      
      {role > 1 && <UserCards />}
      {role < 1 && <Cards />}
      <Activity/>
    </Container>
  )
}
