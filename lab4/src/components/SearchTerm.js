import React from 'react';

const SearchTerm = (props) => {
  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name='formName'
      className='center'
    >
      <label>
        <span>SearchTerm: </span>
        <input
          autoComplete='off'
          type='text'
          name='searchTerm'
          onChange={handleChange}
        />
      </label>
    </form>
  );
};

export default SearchTerm;
