
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { siteUtils, jsUtils } from '../utils';

const { parseSearchString } = jsUtils;
// functions independant of state/hooks-state
const cleanedPaginationValues = ({ allPagination = false, relativePagination, flexiblePageSizePagination, defaultPageSize }, pagination) => {
  if (!defaultPageSize || typeof defaultPageSize !== 'number') {
    throw new TypeError('useSearchController() -> cleanedPaginationValues ---> Prop \'defaultPageSize\' needs to be a number');
  }
  let { maxPage, perPage, page } = pagination;
  maxPage = parseInt(maxPage) >= 1 ? parseInt(maxPage) : 1;
  perPage = parseInt(perPage) >= 1 ? parseInt(perPage) : defaultPageSize;
  page = parseInt(page) >= 1 ? parseInt(page) : 1;
  const basePagination = {
    ...pagination.page && parseInt(pagination.page) > 1 && { page },
    ...(relativePagination || flexiblePageSizePagination) && {
      ...pagination.perPage && perPage > 1 && { perPage }
    },
    ...(relativePagination) && {
      ...pagination.maxPage && maxPage > 1 && { maxPage }
    }
  };
  return {
    ...basePagination,
    ...allPagination && { maxPage, perPage, page }
  };
};
// normalize key-state parameters & compare them - re-render gate-keeper
const isFlattenedStateMatched = (props, queryObj, nextObj) => {
  const { defaultPageSize } = props || {};
  if (!defaultPageSize || typeof defaultPageSize !== 'number') {
    throw new TypeError('useSearchController() -> isFlattenedStateMatched ---> Prop \'defaultPageSize\' needs to be a number');
  }
  const { page: nextPage, perPage: nextPerPage } = cleanedPaginationValues({ defaultPageSize, allPagination: true }, nextObj);
  const { search: nextSearch } = nextObj;
  const { page, perPage } = cleanedPaginationValues({ defaultPageSize, allPagination: true }, queryObj);
  const { search } = queryObj;
  // following isn't type safe - early return anything falsy keyword search/query is the same
  if (!nextSearch && !search) {
    process.env.NODE_ENV !== 'production'
      && console.info('isFlattenedStateMatched --> both keywords falsy !', nextSearch, '  !', search);
    return true;
  }
  if ((nextSearch || '').trim().toLowerCase() !== (search || '').trim().toLowerCase()) {
    process.env.NODE_ENV !== 'production'
      && console.info('isFlattenedStateMatched --> both \'keywords\' mismatch', nextSearch, ' !== ', search);
    return false;
  }
  // check pagination properties
  let cleanNextPage = parseInt(nextPage);
  let cleanPage = parseInt(page);
  cleanNextPage = cleanNextPage >= 1 ? cleanNextPage : 1;
  cleanPage = cleanPage >= 1 ? cleanPage : 1;

  if (cleanPage !== cleanNextPage) {
    process.env.NODE_ENV !== 'production'
      && console.info('isFlattenedStateMatched --> both \'page nums\' mismatch', cleanPage, ' !== ', cleanNextPage);
    return false;
  }

  let cleanNextPerPage = parseInt(nextPerPage);
  let cleanPerPage = parseInt(perPage);
  cleanNextPerPage = cleanNextPerPage >= 1 ? cleanNextPerPage : defaultPageSize;
  cleanPerPage = cleanPerPage >= 1 ? cleanPerPage : defaultPageSize;
  if (cleanPerPage !== cleanNextPerPage) {
    process.env.NODE_ENV !== 'production'
      && console.info('isFlattenedStateMatched --> both \'per page nums\' mismatch', cleanPerPage, ' !== ', cleanNextPerPage);
    return false;
  }

  process.env.NODE_ENV !== 'production'
    && console.info('isFlattenedStateMatched --> both match!!!!');
  return true;
};

// main export
const useSearchController = (props) => {
  const history = useHistory();
  const location = useLocation();
  const parsedLocationSearch = useMemo(() => parseSearchString(location.search), [location]);
  // render context is 'current context'
  const [renderContext, setRenderContext] = useState({
    pagination: cleanedPaginationValues({ ...props, allPagination: true }, {}),
    keyword: '',
    movieList: null
  });
  // query context is 'next context'
  const [queryContext, setQueryContext] = useState({
    pagination: cleanedPaginationValues({ ...props, allPagination: true }, parsedLocationSearch),
    query: parsedLocationSearch.search || ''
  });
  const paginationProps = useMemo(() => {
    const pageProps = cleanedPaginationValues({ ...props, allPagination: true }, renderContext.pagination);
    return {
      ...pageProps,
      currentPage: pageProps.page
    };
  }, [props, renderContext]);
  const updateUrlSearchQuery = useCallback((compareObj, nextObj) => {
    const { replacePagination } = props;
    const { search, pagination = {} } = compareObj;
    const { search: nextSearch, pagination: nextPagination } = nextObj;
    const compareSearchQuery = search
      ? { search, ...cleanedPaginationValues(props, pagination) }
      : {};
    const nextSearchQuery = nextSearch
      ? { search: nextSearch, ...cleanedPaginationValues(props, nextPagination) }
      : {};

    const comparePathQuery = new URLSearchParams(compareSearchQuery).toString();
    const nextPathQuery = new URLSearchParams(nextSearchQuery).toString();
    const newUri = `${location.pathname}${nextPathQuery ? `?${nextPathQuery}` : ''}`;

    if (comparePathQuery === nextPathQuery) {
      return;
    }
    if (replacePagination) {
      history.replace(newUri);
      return;
    }
    history.push(newUri);
  }, [props, location, history]);
  const fetchActionCallback = useCallback(({ query, pagination }) => {
    process.env.NODE_ENV !== 'production'
      && console.info('Fetch Action Network Request!!!', query, pagination);
    const { relativePagination } = props;
    const { query: keyword } = queryContext;
    const fetchPromise = keyword ? props.fetchAction({ query, pagination }) : Promise.resolve(null);

    fetchPromise.then((result) => {
      if (result) {
        process.env.NODE_ENV !== 'production' && console.info('FETCHED: IS GOOD');
        const { records: movieList, pagination: resultsPagination = {} } = result;
        const pagination = cleanedPaginationValues({ ...props, allPagination: true }, resultsPagination);
        if (relativePagination && keyword.trim().toLowerCase() === renderContext.keyword.trim().toLowerCase() && pagination.maxPage !== renderContext.pagination.maxPage) {
          pagination.maxPage = Math.max(pagination.maxPage, renderContext.pagination.maxPage);
        }

        setRenderContext({ pagination, keyword, movieList });
      } else {
        process.env.NODE_ENV !== 'production' && console.info('FETCHED: NO RESULTS');
        const pagination = cleanedPaginationValues({ ...props, allPagination: true }, {});

        setRenderContext({ pagination, keyword, movieList: null });
      }
      return result;
    })
      .catch((error) => {
        console.log('Failed to fetch ', error.message);
        console.error(error);
        return null;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, updateUrlSearchQuery, renderContext, queryContext]);

  // three states (url gets priority): search-query -> queryContext -> renderContext
  useEffect(() => {
    const flatQueryContext = { search: queryContext.query, ...queryContext.pagination };
    const flatRenderContext = { search: renderContext.keyword, ...renderContext.pagination };
    process.env.NODE_ENV !== 'production'
      && console.info('------------------------\n', 'Validate the state', '\n\tflatQueryContext:', flatQueryContext, '\n\tflatRenderContext:', flatRenderContext);
    if (!isFlattenedStateMatched(props, flatRenderContext, flatQueryContext)) {
      console.log('\tqueryContext:', queryContext);
      fetchActionCallback(queryContext);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderContext, queryContext]);

  // when search-query updates in the url - needs to happen after above hook
  useEffect(() => {
    process.env.NODE_ENV !== 'production'
      && console.info('Location Update', parseSearchString(location.search));
    const { page, perPage, maxPage } = parseSearchString(location.search);
    if (!isFlattenedStateMatched(props, { search: queryContext.query, ...queryContext.pagination }, parsedLocationSearch)) {
      process.env.NODE_ENV !== 'production'
        && console.info('\t Location Update: Force Redirect');
      // trigger a cascade of state changes to update view/render
      setQueryContext({
        query: parsedLocationSearch.search,
        pagination: cleanedPaginationValues({ ...props, allPagination: true }, { page, perPage, maxPage })
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const flatRenderContext = { search: renderContext.keyword, ...renderContext.pagination };
    if (!isFlattenedStateMatched(props, parsedLocationSearch, flatRenderContext)) {
      updateUrlSearchQuery({
        pagination: cleanedPaginationValues({ ...props, allPagination: true }, parsedLocationSearch),
        search: renderContext.keyword
      }, {
        ...renderContext,
        search: renderContext.keyword
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderContext]);

  // make the page-title & back-button look good
  document.title = `${props.pageLabel}${
    renderContext.keyword && renderContext.keyword.length > 0 ? ` : "${renderContext.keyword}"` : ''
  }${
    renderContext.pagination && renderContext.pagination.page > 1 ? ` Page: #${renderContext.pagination.page}` : ''
  } - ${siteUtils.websiteTitle()}`;

  return useMemo(() => ({
    paginationProps,
    queryContext,
    renderContext: {
      ...renderContext,
      renderList: renderContext.movieList || []
    },
    // data-notification functions
    // notify the controller that <Link /> was clicked - event blocked in <SearchUi />
    onPaginationUpdate: ({ maxPage, perPage, page }) => setQueryContext({
      pagination: cleanedPaginationValues({ ...props, allPagination: true }, { maxPage, perPage, page }),
      query: renderContext.keyword
    }),
    // how to generate pagination links - feeds into <Link /> props
    onGenerateTo: (toProps, { page: toPage }) => {
      const { pagination } = renderContext;
      const nextPaginationData = {
        search: renderContext.keyword,
        ...cleanedPaginationValues(props, pagination),
        page: toPage
      };
      if (nextPaginationData.page <= 1) {
        delete nextPaginationData.page;
      }
      if (props.relativePagination) {
        nextPaginationData.maxPage = Math.max(renderContext.pagination.maxPage, nextPaginationData.maxPage);
      }
      const newPathQuery = new URLSearchParams(nextPaginationData).toString();
      const pathname = location.pathname;
      const linkToProp = {
        ...toProps.to,
        ...newPathQuery && { search: `?${newPathQuery}` },
        pathname
      };

      return { ...toProps, to: linkToProp, ...props.replacePagination && { replace: true } };
    },
    // when a form submits or an option selected - how to pass that value
    onSearchUpdate: query => setQueryContext({
      query,
      pagination: cleanedPaginationValues({ ...props, allPagination: true }, {
        ...renderContext.pagination,
        page: null
      })
    })
  }),
  [props, location, renderContext, paginationProps, queryContext]
  );
};

export default useSearchController;
