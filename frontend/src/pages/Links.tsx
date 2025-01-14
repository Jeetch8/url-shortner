export interface StatsPopulatedShortnedUrl
  extends Omit<ShortendUrl, 'clicker_info' | 'updatedAt'> {
  stats: Stat;
  favorite: boolean;
}

export interface IUserGeneratedLinksResp {
  generated_links: StatsPopulatedShortnedUrl[];
}

import GeneratedLinkList from '../components/Links/GeneratedLinkList';
import { twMerge } from 'tailwind-merge';
import { useUserContext } from '../context/UserContext';
import { ShortendUrl, Stat } from '@shared/types/mongoose-types';

const Links = () => {
  const { user } = useUserContext();
  console.log(user);

  return (
    <div
      className={twMerge(
        'max-w-[1600px] w-full mx-auto px-4 py-4',
        user?.subscription_warninig.visible && 'pt-[35px]'
      )}
    >
      <h1 className=" text-3xl font-bold">Links</h1>
      <GeneratedLinkList />
    </div>
  );
};

export default Links;
