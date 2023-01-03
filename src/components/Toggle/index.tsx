import React from 'react';
import { Container, ToggleLabel, ToggleSelector } from './styles';

const Toggle: React.FC = () => (
    <Container>
        <ToggleLabel>Light</ToggleLabel>
            <ToggleSelector 
                checked={true}
                onChange={checked => console.log(checked)}
                uncheckedIcon={false}
                checkedIcon={false}
            />
        <ToggleLabel>Dark</ToggleLabel>
    </Container>
)

export default Toggle;