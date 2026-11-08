import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `text text_type_main-default ml-2 mr-10 ${styles.link} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              Конструктор
            </>
          )}
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `text text_type_main-default ml-2 ${styles.link} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              Лента заказов
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Link to="/">
          <Logo className="" />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text text_type_main-default ml-2 ${styles.link} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              {userName ?? 'Личный кабинет'}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
