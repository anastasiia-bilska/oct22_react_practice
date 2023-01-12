import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import { User } from './types/User';
import { Category } from './types/Category';
import { Product } from './types/Product';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

function findUserById(userId: number): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

const preparedCategories: Category[] = categoriesFromServer.map(category => (
  {
    ...category,
    user: findUserById(category.ownerId),
  }
));

function findCategoryById(categoryId: number): Category | null {
  return preparedCategories.find(category => (
    category.id === categoryId
  )) || null;
}

const preparedProducts: Product[] = productsFromServer.map(product => (
  {
    ...product,
    category: findCategoryById(product.categoryId),
  }
));

export const App: React.FC = () => {
  const [products, setProducts] = useState(preparedProducts);
  const [input, setInput] = useState('');
  const [shouldAllbeActive, setShouldAllbeActive] = useState(true);
  // const [error, setError] = useState('');

  const handleUserFilter = (user: User) => {
    const filteredProducts = preparedProducts.filter(product => (
      product.category?.user?.id === user.id
    ));

    setShouldAllbeActive(false);
    setProducts(filteredProducts);
  };

  const resetFilters = () => {
    setProducts(preparedProducts);
    setInput('');
    setShouldAllbeActive(true);
  };

  const showAll = () => {
    setShouldAllbeActive(true);
    setProducts(preparedProducts);
  };

  // const choosenUser = usersFromServer.find(user => (
  //   user.id === selectedUser.id
  // )) || usersFromServer[0];

  const handleInputChange = (part: string) => {
    setInput(part);

    const filteredProducts = products.filter(product => (
      product.name.toLowerCase().includes(part.toLowerCase())
    ));

    // if (products.length === 0) {
    //   setError('No results');
    // } else {
    //   setError('');
    // }

    setProducts(filteredProducts);
  };

  const clearInput = () => {
    setInput('');
    setProducts(preparedProducts);
  };

  // if (products.length === 0) {
  //   setError('No results');
  // }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn(
                  {
                    'is-active': shouldAllbeActive,
                  },
                )}
                onClick={showAll}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={cn(
                    {
                      'is-active': products.every(product => (
                        product.category?.user?.id === user.id
                      )),
                    },
                  )}
                  onClick={() => handleUserFilter(user)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={input}
                  onChange={(event) => handleInputChange(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {input && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearInput}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {products.map(product => (
                <a
                  key={product.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {product.category?.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {products.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map(product => (
                <tr key={product.id} data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.category?.icon} - ${product.category?.title}`}</td>

                  <td
                    data-cy="ProductUser"
                    className={cn(
                      {
                        'has-text-link': product.category?.user?.sex === 'm',
                        'has-text-danger': product.category?.user?.sex === 'f',
                      },
                    )}
                  >
                    {product.category?.user?.name}
                  </td>
                </tr>
              ))}
              {/* <p>{error}</p> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
