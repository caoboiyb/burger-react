import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationItem.css';

const navigationItem = (props) => (
  <li className="NavigationItem">
    <NavLink
      className={props.active ? 'active' : null}
      exact={props.exact}
      to={props.link}
    >
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
