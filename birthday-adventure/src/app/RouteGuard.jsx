import { Navigate, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';

export function RouteGuard({ canAccess, redirectTo = '/aventura', children }) {
  const { state } = useProgress();
  const location = useLocation();

  if (!canAccess(state)) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ blockedRoute: location.pathname }}
      />
    );
  }

  return children;
}
