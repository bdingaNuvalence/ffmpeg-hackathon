import React from 'react';
import { Link } from 'react-router-dom';

import './css.scss';

const paginationClassNameFactory = (linkType, { currentPage, page, perPage, maxPage }) => {
  if (linkType === 'num' && currentPage === page) {
    return ' pagination-current';
  }
  if (linkType === 'prev' && currentPage <= 1) {
    return ' pagination-cancelled';
  }
  if (linkType === 'next' && currentPage >= maxPage) {
    return ' pagination-cancelled';
  }
  return '';
};
const paginationLinkFactory = (location, { onPaginationUpdate, onGenerateTo, currentPage, page, perPage, maxPage }) => {
  const outputTo = {
    pathname: location.pathname
  };
  const optionalAttr = {
    onClick: page === currentPage || page < 1 || page > maxPage
      ? (ev) => {
          ev.preventDefault();
          return false;
        }
      : () => {
          onPaginationUpdate({ currentPage, page, perPage, maxPage });
        }
  };
  return onGenerateTo({ to: outputTo, ...optionalAttr }, { currentPage, page, perPage, maxPage });
};
const PaginationNumberLinks = (props) => {
  const { maxPage, location } = props;

  const numberLinks = [];
  for (let p = 1; p <= maxPage; p++) {
    numberLinks.push(<li key={`paged-link-${p}`} className={`pagination-num-link${paginationClassNameFactory('num', { ...props, page: p })}`}>
      <Link {...paginationLinkFactory(location, { ...props, page: p })}>{p}</Link>
    </li>);
  }
  return numberLinks;
};
const PaginationLinks = (props) => {
  const { location, currentPage } = props;

  return <ul className="inline-list pagination-links">
    <li className={`page-previous${paginationClassNameFactory('prev', { ...props, page: currentPage - 1 })}`}>
      <Link {...paginationLinkFactory(location, { ...props, page: currentPage - 1 })}>&#9664;</Link>
    </li>
    <PaginationNumberLinks {...props} />
    <li className={`page-next${paginationClassNameFactory('next', { ...props, page: currentPage + 1 })}`}>
      <Link {...paginationLinkFactory(location, { ...props, page: currentPage + 1 })}>&#9654;</Link>
    </li>
  </ul>;
};
const Pagination = (props) => {
  const { children, location, maxPage, currentPage, onGenerateTo, onPaginationUpdate } = props;
  const uiProps = { maxPage, currentPage, location, onGenerateTo, onPaginationUpdate };

  return <>
    <div className="pagination pagination-top">
      <PaginationLinks {...uiProps} />
    </div>
    {children}
    <div className="pagination pagination-bottom">
      <PaginationLinks {...uiProps} />
    </div>
  </>;
};

export default Pagination;
