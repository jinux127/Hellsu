import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 2%;
  margin-bottom: 1rem;
  background-color: #fff;
  height: 300px;
  max-height: 50vh;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  :hover {
    background-color: rgb(235, 235, 235);
  }
  cursor: pointer;
`;

export const ArticleImg = styled.img`
  width: 50%;
  object-fit: cover;
  border-radius: 50px;
  aspect-ratio: 1 / 1;
`;

export const Article = styled.article`
  display: flex;
  width: 100%;
  margin-left: 1rem;
  justify-content: space-around;
  flex-direction: column;
`;

export const AuthorContent = styled.div`
  font-size: 1.5rem;
  font-weight: bolder;
  line-height: 140%;
  height: auto;

  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-top: 2rem;
  }
`;

export const DateContent = styled.div`
  font-size: 0.8rem;
  line-height: 140%;
  height: auto;
  text-align: right;
  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-top: 2rem;
  }
`;

export const ArticleContent = styled.h1`
  font-size: 2rem;
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const TagContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, auto));
  grid-gap: 10px;
  max-height: 4vh;
  overflow: hidden;
`;

export const Tag = styled.span`
  display: inline-block;
  padding: 5px 15px;
  border: 1px solid ${(props) => props.theme.pointColors.lightGreen};
  border-radius: 25px;
  text-align: center;
`;
