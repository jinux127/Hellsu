import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 1fr 0.5fr repeat(6, auto);
  place-items: center center;
`;

export const DaySpan = styled.span<{ sat?: boolean }>`
  grid-row-start: 2;
  color: red;
  padding-bottom: 5px;

  ${(props) =>
    props.sat &&
    css`
      grid-row-start: 2;
      grid-column-start: 7;
      color: blue;
    `}
`;

export const JandiContainer = styled.div`
  grid-row-start: 3;
  grid-row-end: 9;
  grid-column-start: 1;
  grid-column-end: 8;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  width: 100%;
  height: 100%;
  place-items: center center;
  grid-row-gap: 5px;
`;

export const JandiItem = styled.div<{ active: boolean }>`
  width: 20px;
  height: 20px;
  border: 0.5px solid #3ec70b;
  border-radius: 10px;

  ${(props) =>
    props.active &&
    css`
      background-color: #3ec70b;
    `}
`;
