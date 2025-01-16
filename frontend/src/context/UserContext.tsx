import { Product } from '@/types/subscriptionPlans';

export type UserBootupInfo = {
  user: User & { subscription_id: Subscription };
  subscription_warninig: {
    visible: boolean;
    text: string;
    plan_end: boolean;
    type: string;
  };
  product: Product & { plan_name: 'montly' | 'annual' };
};

import { useContext, createContext, useEffect, useState } from 'react';
import { FetchStates, useFetch } from '../hooks/useFetch';
import { base_url } from '../utils/base_url';
import { Subscription, User } from '@/types/mongoose-types';

const defaultValues: UserBootupInfo | null = null;
const UserContext = createContext<{
  user: UserBootupInfo | null;
  userFetchState: FetchStates;
}>({
  user: defaultValues,
  userFetchState: FetchStates.IDLE,
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<UserBootupInfo | null>(null);
  const { doFetch, fetchState } = useFetch<UserBootupInfo>({
    url: base_url + '/user/bootup',
    authorized: true,
    method: 'GET',
    onSuccess: (data) => {
      setData(data);
    },
  });

  useEffect(() => {
    doFetch();
  }, []);

  return (
    <UserContext.Provider value={{ user: data, userFetchState: fetchState }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
