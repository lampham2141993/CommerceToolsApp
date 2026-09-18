/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import {
  useMcQuery,
  useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import {
  PRODUCT_LABELS_CONTAINER,
  createProductLabelKey,
  formValuesToProductLabelValue,
  parseProductLabelValue,
  type TProductLabel,
  type TProductLabelFormValues,
  type TProductLabelValue,
  type TProductOption,
} from '../../types/product-labels';
import { logger } from '../../utils/logger';
import CreateOrUpdateProductLabelMutation from './create-or-update-product-label.ctp.graphql';
import DeleteProductLabelMutation from './delete-product-label.ctp.graphql';
import FetchProductLabelQuery from './fetch-product-label.ctp.graphql';
import FetchProductLabelsQuery from './fetch-product-labels.ctp.graphql';
import FetchProductsForLabelsQuery from './fetch-products-for-labels.ctp.graphql';

type TCustomObjectResult = {
  id: string;
  key: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  value: unknown;
};

type TFetchProductLabelsQuery = {
  customObjects: {
    total: number;
    count: number;
    offset: number;
    results: TCustomObjectResult[];
  };
};

type TFetchProductLabelsQueryVariables = {
  container: string;
  limit: number;
  offset: number;
  sort?: string[];
};

type TFetchProductLabelQuery = {
  customObject?: TCustomObjectResult | null;
};

type TFetchProductLabelQueryVariables = {
  id: string;
};

type TCreateOrUpdateProductLabelMutation = {
  createOrUpdateCustomObject?: TCustomObjectResult | null;
};

type TCreateOrUpdateProductLabelMutationVariables = {
  draft: {
    container: string;
    key: string;
    value: string;
    version?: number;
  };
};

type TDeleteProductLabelMutation = {
  deleteCustomObject?: { id: string; key: string } | null;
};

type TDeleteProductLabelMutationVariables = {
  id: string;
  version?: number;
};

type TFetchProductsForLabelsQuery = {
  products: {
    total: number;
    count: number;
    offset: number;
    results: Array<{
      id: string;
      key?: string | null;
      masterData: {
        current?: {
          nameAllLocales: Array<{ locale: string; value: string }>;
        } | null;
      };
    }>;
  };
};

type TFetchProductsForLabelsQueryVariables = {
  limit: number;
  offset: number;
};

const mapCustomObjectToLabel = (
  customObject: TCustomObjectResult
): TProductLabel => ({
  id: customObject.id,
  key: customObject.key,
  version: customObject.version,
  createdAt: customObject.createdAt,
  lastModifiedAt: customObject.lastModifiedAt,
  value: parseProductLabelValue(customObject.value),
});

type PaginationProps = {
  page: { value: number };
  perPage: { value: number };
};

export const useProductLabelsFetcher = ({ page, perPage }: PaginationProps) => {
  const { data, error, loading, refetch } = useMcQuery<
    TFetchProductLabelsQuery,
    TFetchProductLabelsQueryVariables
  >(FetchProductLabelsQuery, {
    variables: {
      container: PRODUCT_LABELS_CONTAINER,
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: ['createdAt desc'],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (result: TFetchProductLabelsQuery) => {
      logger.info('Fetched product labels', {
        total: result.customObjects.total,
        count: result.customObjects.count,
        offset: result.customObjects.offset,
      });
    },
    onError: (queryError: ApolloError) => {
      logger.error('Failed to fetch product labels', {
        message: queryError.message,
      });
    },
  });

  return {
    productLabelsPaginatedResult: data
      ? {
          total: data.customObjects.total,
          count: data.customObjects.count,
          offset: data.customObjects.offset,
          results: data.customObjects.results.map(mapCustomObjectToLabel),
        }
      : undefined,
    error,
    loading,
    refetch,
  };
};

export const useProductLabelFetcher = (labelId?: string) => {
  const skip = !labelId || labelId === 'new';
  const { data, error, loading } = useMcQuery<
    TFetchProductLabelQuery,
    TFetchProductLabelQueryVariables
  >(FetchProductLabelQuery, {
    variables: {
      id: labelId ?? '',
    },
    skip,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (result: TFetchProductLabelQuery) => {
      logger.info('Fetched product label', {
        id: result.customObject?.id,
        key: result.customObject?.key,
      });
    },
    onError: (queryError: ApolloError) => {
      logger.error('Failed to fetch product label', {
        id: labelId,
        message: queryError.message,
      });
    },
  });

  return {
    productLabel: data?.customObject
      ? mapCustomObjectToLabel(data.customObject)
      : undefined,
    error: skip ? undefined : (error as ApolloError | undefined),
    loading: skip ? false : loading,
  };
};

export const useProductsForLabelsFetcher = () => {
  const { data, error, loading } = useMcQuery<
    TFetchProductsForLabelsQuery,
    TFetchProductsForLabelsQueryVariables
  >(FetchProductsForLabelsQuery, {
    variables: {
      limit: 200,
      offset: 0,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (result: TFetchProductsForLabelsQuery) => {
      logger.info('Fetched products for label picker', {
        total: result.products.total,
        count: result.products.count,
      });
    },
    onError: (queryError: ApolloError) => {
      logger.error('Failed to fetch products for label picker', {
        message: queryError.message,
      });
    },
  });

  const products: TProductOption[] =
    data?.products.results.map(
      (
        product: TFetchProductsForLabelsQuery['products']['results'][number]
      ) => {
        const localizedName =
          product.masterData.current?.nameAllLocales?.[0]?.value;
        return {
          id: product.id,
          key: product.key,
          name: localizedName || product.key || product.id,
        };
      }
    ) ?? [];
  return {
    products,
    error,
    loading,
  };
};

export const useProductLabelSaver = () => {
  const [createOrUpdateProductLabel, { loading }] = useMcMutation<
    TCreateOrUpdateProductLabelMutation,
    TCreateOrUpdateProductLabelMutationVariables
  >(CreateOrUpdateProductLabelMutation);

  const execute = async ({
    formValues,
    existingLabel,
  }: {
    formValues: TProductLabelFormValues;
    existingLabel?: TProductLabel | null;
  }) => {
    const value: TProductLabelValue = formValuesToProductLabelValue(formValues);
    const draft = {
      container: PRODUCT_LABELS_CONTAINER,
      key: existingLabel?.key ?? createProductLabelKey(value.title),
      value: JSON.stringify(value),
      ...(existingLabel ? { version: existingLabel.version } : {}),
    };

    logger.info('Saving product label', {
      key: draft.key,
      isUpdate: Boolean(existingLabel),
      productCount: value.productIds.length,
    });

    try {
      const result = await createOrUpdateProductLabel({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: { draft },
      });

      const saved = result.data?.createOrUpdateCustomObject;
      logger.info('Product label saved', {
        id: saved?.id,
        key: saved?.key,
        version: saved?.version,
      });

      return saved ? mapCustomObjectToLabel(saved) : undefined;
    } catch (graphQlResponse) {
      logger.error('Failed to save product label', {
        key: draft.key,
      });
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};

export const useProductLabelDeleter = () => {
  const [deleteProductLabel, { loading }] = useMcMutation<
    TDeleteProductLabelMutation,
    TDeleteProductLabelMutationVariables
  >(DeleteProductLabelMutation);

  const execute = async (
    label: Pick<TProductLabel, 'id' | 'version' | 'key'>
  ) => {
    logger.info('Deleting product label', {
      id: label.id,
      key: label.key,
      version: label.version,
    });

    try {
      const result = await deleteProductLabel({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          id: label.id,
          version: label.version,
        },
      });

      logger.info('Product label deleted', {
        id: result.data?.deleteCustomObject?.id,
        key: result.data?.deleteCustomObject?.key,
      });

      return result.data?.deleteCustomObject;
    } catch (graphQlResponse) {
      logger.error('Failed to delete product label', {
        id: label.id,
        key: label.key,
      });
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
