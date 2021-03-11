import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  checkUserAccount?: Maybe<UserAccount>;
  me?: Maybe<User>;
  products?: Maybe<Array<Product>>;
  orders?: Maybe<Array<Order>>;
};


export type QueryCheckUserAccountArgs = {
  accountName: Scalars['String'];
};

export type UserAccount = {
  __typename?: 'UserAccount';
  username?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['Float']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Float'];
};

export type Order = {
  __typename?: 'Order';
  id: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  totalPrice: Scalars['Float'];
  quantity: Scalars['Float'];
  orderStatus: Scalars['String'];
  buyer: User;
  productName: Product;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: UserResponse;
  register: UserResponse;
  addProduct: Product;
  payOrder: PayResponse;
  placeOrder: Order;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  userData: RegisterInputs;
};


export type MutationAddProductArgs = {
  input: ProductInput;
};


export type MutationPayOrderArgs = {
  password: Scalars['String'];
  accountName: Scalars['String'];
  orderId: Scalars['Float'];
};


export type MutationPlaceOrderArgs = {
  quantity: Scalars['Float'];
  productName: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type RegisterInputs = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type ProductInput = {
  name: Scalars['String'];
  price: Scalars['Float'];
  quantity: Scalars['Float'];
};

export type PayResponse = {
  __typename?: 'PayResponse';
  username?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['Float']>;
};

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products?: Maybe<Array<(
    { __typename?: 'Product' }
    & Pick<Product, 'id' | 'name' | 'price' | 'quantity' | 'createdAt' | 'updatedAt'>
  )>> }
);


export const ProductsDocument = gql`
    query Products {
  products {
    id
    name
    price
    quantity
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductsQuery(baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;