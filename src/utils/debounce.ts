import {useCallback} from 'react';
import _ from 'lodash';

type FetchDataFunction = any;

const useDebouncedFetchData = (
  fetchData: FetchDataFunction,
): FetchDataFunction => {
  return useCallback(_.debounce(fetchData, 500), []);
};

export default useDebouncedFetchData;
