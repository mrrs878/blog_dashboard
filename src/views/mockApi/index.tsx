import React from 'react';
import { GET_MOCK_APIS } from '../../api/mockApi';
import useRequest from '../../hooks/useRequest';

const Index = () => {
  const [getting, getMockApiRes, getMockApi] = useRequest(GET_MOCK_APIS, false);
  return (
    <div className="container">there is mockApi page</div>
  );
};

export default Index;
