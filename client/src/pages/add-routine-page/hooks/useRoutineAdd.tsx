import { useCallback, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { customAxios } from 'common/api';
import { useNavigate } from 'react-router-dom';

type ValidationResponse = {
  message: string;
};

interface IData {
  name: string;
  _id: string;
}

interface IResult {
  status: number;
  data: [IData];
}

const useRoutineAdd = () => {
  const [error, setError] = useState<Error['message']>('');
  const [isLoading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [result, setResult] = useState<IResult>();
  const navigate = useNavigate();

  const addRoutine = useCallback((data: object) => {
    setLoading(true);
    customAxios
      .post(`/api/routine/register`, data, { withCredentials: true })
      .then((response) => {
        setResult({ status: response.status, data: response.data });
        setError('');
        setShowError(false);
        navigate('/routine');
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          const responseError = err as AxiosError<ValidationResponse>;
          if (responseError && responseError.response) {
            setError(responseError.response.data.message);
            setShowError(true);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    addRoutine,
    result,
    isLoading,
    error,
    showError,
  };
};

export default useRoutineAdd;
