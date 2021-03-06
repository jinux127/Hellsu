import styled from 'styled-components';

export const MealWrapper = styled.div<{ view: boolean }>`
  visibility: ${(props) => (props.view ? '' : 'hidden')};
  position: fixed;
  display: flex;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 9999;
  & > form {
    padding: 2rem;
    border: 1px solid;
    background-color: aliceblue;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  label::after {
    content: ' :';
  }
  input {
    border: 1px dotted;
    margin-left: 0.5rem;
  }
  input[type='button'],
  input[type='submit'] {
    cursor: pointer;
  }
  div {
    margin: 0.5rem;
  }
`;
