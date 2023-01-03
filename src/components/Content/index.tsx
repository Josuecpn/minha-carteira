import React from 'react';

import { Container } from './styles';

type ContainerProps = {
    children: React.ReactNode; //👈 children prop typr
};

const Content: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <Container>
            {children}
        </Container>
    )
}

export default Content;