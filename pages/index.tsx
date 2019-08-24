import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const menuList = [
  {
    title: 'Simple List',
    href: '/simple-list',
  },
];

const Home = () => {
  return (
    <ul className="tw-w-1/2 tw-m-auto tw-text-lg">
      {menuList.map(menu => {
        return (
          <li className="tw-px-2 tw-py-3 tw-text-indigo-800 tw-border-b tw-border-blue-600" key={menu.title}>
            <Link href={menu.href}>
              <a className="tw-flex tw-items-center tw-justify-between">
                {menu.title}
                <FontAwesomeIcon icon="chevron-right"></FontAwesomeIcon>
              </a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Home;
