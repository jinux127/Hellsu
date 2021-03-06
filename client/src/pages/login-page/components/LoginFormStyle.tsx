import styled from 'styled-components';

export const LoginButton = styled.button`
  width: 100%;
  height: 2.6rem;
  border: ${(props) => `1px solid ${props.theme.pointColors.orange}`};
  border-radius: 2.6rem;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  background-color: ${(props) => props.theme.pointColors.orange};
  color: white;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s linear;

  &:hover {
    opacity: 1;
  }
`;

export const LoadingDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const ErrorMessage = styled.p`
  width: 100%;
  margin: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.2rem;
  color: red;
`;
