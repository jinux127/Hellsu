import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';

import { dateObjectAtom } from 'recoil/infoState';
import { customAxios } from 'common/api';
import loadingThrottle from 'common/utils/loadingThrottle';
import { ArticleErrResponse } from 'types/interfaces';

const useArticle = <T>(apiLink: string) => {
  const [isLoading, setLoading] = useState(false);
  const standardDate = useRecoilValue(dateObjectAtom);
  const [articleList, setArticleList] = useState<Array<T>>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [reqNumber, setReqNumber] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [post, setPost] = useState<T>();
  const [id, setId] = useState<string>();
  const { userId } = useParams();

  useEffect(() => {
    setArticleList([]);
    setReqNumber(0);
    setHasMore(false);
  }, [standardDate]);

  useEffect(() => {
    async function getArticle() {
      try {
        const response = await customAxios.get(
          `/api/${apiLink}/user?userId=${userId}&year=${
            standardDate.year
          }&month=${standardDate.month + 1}&limit=6&reqNumber=${reqNumber}`
        );
        setArticleList((previousArticle) => [
          ...previousArticle,
          ...response.data,
        ]);
        setHasMore(response.data.length > 0);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const responseError = err as AxiosError<ArticleErrResponse>;
          if (responseError && responseError.response) {
            setErrorMessage(responseError.response.data.reason);
            setIsOpen(true);
          }
        }
      }
    }
    loadingThrottle(0.8, getArticle, setLoading);
  }, [standardDate, userId, reqNumber]);

  const getArticle = async (articleId: string | undefined) => {
    setLoading(true);
    setId(articleId);
    try {
      const response = await customAxios.get(
        `/api/${apiLink}/article/${articleId}`
      );
      setPost(response.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return {
    isLoading,
    articleList,
    errorMessage,
    isOpen,
    hasMore,
    post,
    id,
    setIsOpen,
    setReqNumber,
    getArticle,
  };
};

export default useArticle;
