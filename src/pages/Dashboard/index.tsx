import React from 'react';

import ContentHeader from "../../components/ContentHeader";
import SelectInput from '../../components/SelectInput';

import { Container } from './styles';

const Dashboard: React.FC = () => {
    
    const options = [
        {value: '1', label: 'Opção 1'},
        {value: '2', label: 'Opção 2'},
        {value: '3', label: 'Opção 3'},
    ]

    return (
        <Container>
            <ContentHeader title='Dashboard' lineColor='#fff'>
                <SelectInput options={options} onChange={() => {}}/>
            </ContentHeader>
        </Container>
    )
}

export default Dashboard;