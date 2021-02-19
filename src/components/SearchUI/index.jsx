import React, { useRef, useState, useEffect } from 'react';

import './css.scss';

const SearchUIState = (props) => {
  const { onSearchUpdate, query } = props;
  const inputElRef = useRef(null);
  const [searchPayload, setSearchUi] = useState({ timeoutId: null, searchQuery: query || '' });
  const { timeoutId, searchQuery } = searchPayload;

  // functions called here so that update state is available in scope correctly
  // updating the state after API call
  const onNotifyUpdate = (value) => {
    cancelInputBounce();
    onSearchUpdate(value);
  };

  // allow hitting enter on the keyboard or using a submit button (a11y)
  const onSubmitHandler = (ev) => {
    let updatedValue = '';

    if (inputElRef.current) {
      updatedValue = inputElRef.current.value;
    } else if (searchQuery) {
      updatedValue = searchQuery;
    }

    onNotifyUpdate(updatedValue || '');

    // prevent default browser action
    ev.preventDefault();
    return false;
  };
  // cancel delaying from input
  const cancelInputBounce = () => timeoutId && clearTimeout(timeoutId);
  // handle input changes
  const onChangeHandler = ({ target: { value } }) => {
    cancelInputBounce();
    setSearchUi({
      timeoutId: setTimeout(() => onNotifyUpdate(value), Math.floor((1000 / 3) * 2)),
      searchQuery: value
    });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  // on component mount
  useEffect(() => {
    return () => {
      // on component unmount
      cancelInputBounce();
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (document.activeElement !== inputElRef.current) {
      cancelInputBounce();
      setSearchUi({
        timeoutId: null,
        searchQuery: query
      });
      inputElRef.current.value = query || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { onSubmitHandler, inputElRef, onChangeHandler, searchQuery };
};

const SearchUI = (props) => {
  const { onSubmitHandler: onSubmit, inputElRef, onChangeHandler: onChange, searchQuery } = SearchUIState(props);

  return <form className="search-ui-form" onSubmit={onSubmit}>
    <input type="text" className="search-ui-input" placeholder="Search" ref={inputElRef} onChange={onChange} defaultValue={searchQuery} />
  </form>;
};

export default SearchUI;
