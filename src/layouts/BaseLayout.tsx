import { ROUTER } from '@/configs/router';
import { Navigate, useOutlet } from 'react-router-dom';

const BaseLayout = () => {
  const outlet = useOutlet();

  return <div className="app-container">{outlet}</div>;
};

export default BaseLayout;
