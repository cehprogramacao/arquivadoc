import { Container } from '@mui/system';

const CustomContainer = (props) => {
    const { children, sx, fullHeight, ...rest } = props;

    return (
        <Container
            fixed
        >
            {children}
        </Container>
    );
};

export default CustomContainer;
