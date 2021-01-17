import React from 'react';
import { GET_MOCK_APIS } from '../../api/mockApi';
import useRequest from '../../hooks/useRequest';
import EditableTagGroup from './components/EditableTagGroup';

const Index = () => {
  const [getting, getMockApiRes, getMockApi] = useRequest(GET_MOCK_APIS, false);
  return (
    <div className="container">
      <EditableTagGroup tags={['1', '2', '3']} />
    </div>
  );
};

export default Index;
