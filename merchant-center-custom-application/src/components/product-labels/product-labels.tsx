import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { ConfirmationDialog } from '@commercetools-frontend/application-components';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import {
  useShowApiErrorNotification,
  useShowNotification,
  type TApiErrorNotificationOptions,
} from '@commercetools-frontend/actions-global';
import { DOMAINS, NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import Constraints from '@commercetools-uikit/constraints';
import DataTable from '@commercetools-uikit/data-table';
import FlatButton from '@commercetools-uikit/flat-button';
import { usePaginationState } from '@commercetools-uikit/hooks';
import IconButton from '@commercetools-uikit/icon-button';
import { BackIcon, BinLinearIcon } from '@commercetools-uikit/icons';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PERMISSIONS } from '../../constants';
import { getErrorMessage } from '../../helpers';
import {
  useProductLabelDeleter,
  useProductLabelsFetcher,
} from '../../hooks/use-product-labels-connector';
import type { TProductLabel } from '../../types/product-labels';
import { logger } from '../../utils/logger';
import ProductLabelDetails from '../product-label-details';
import messages from './messages';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'labelText', label: 'Label text' },
  { key: 'startDate', label: 'Start date' },
  { key: 'endDate', label: 'End date' },
  { key: 'products', label: 'Products' },
  { key: 'actions', label: 'Actions', width: 'max-content' },
];

type TProductLabelsProps = {
  linkToWelcome: string;
};

const ProductLabels = (props: TProductLabelsProps) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const productLabelDeleter = useProductLabelDeleter();
  const [labelPendingDelete, setLabelPendingDelete] =
    useState<TProductLabel | null>(null);

  const { productLabelsPaginatedResult, error, loading, refetch } =
    useProductLabelsFetcher({
      page,
      perPage,
    });

  const handleConfirmDelete = useCallback(async () => {
    if (!labelPendingDelete) {
      return;
    }

    try {
      await productLabelDeleter.execute(labelPendingDelete);
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.deleteSuccess, {
          title: labelPendingDelete.value.title || labelPendingDelete.key,
        }),
      });
      setLabelPendingDelete(null);
      await refetch();
    } catch (deleteError) {
      logger.error('Delete confirmation failed', {
        id: labelPendingDelete.id,
      });
      showApiErrorNotification({
        errors: (Array.isArray(deleteError)
          ? deleteError
          : [deleteError]) as TApiErrorNotificationOptions['errors'],
      });
    }
  }, [
    intl,
    labelPendingDelete,
    productLabelDeleter,
    refetch,
    showApiErrorNotification,
    showNotification,
  ]);

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Spacings.Inline justifyContent="space-between" alignItems="center">
          <Text.Headline as="h2" intlMessage={messages.title} />
          {canManage && (
            <PrimaryButton
              label={intl.formatMessage(messages.createLabel)}
              onClick={() => push(`${match.url}/new`)}
            />
          )}
        </Spacings.Inline>
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.hint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {productLabelsPaginatedResult ? (
        <Spacings.Stack scale="l">
          {productLabelsPaginatedResult.results.length === 0 ? (
            <Text.Body intlMessage={messages.noResults} />
          ) : (
            <DataTable<TProductLabel>
              isCondensed
              columns={columns.map((column) => ({
                ...column,
                label:
                  column.key === 'title'
                    ? intl.formatMessage(messages.columnTitle)
                    : column.key === 'labelText'
                    ? intl.formatMessage(messages.columnLabelText)
                    : column.key === 'startDate'
                    ? intl.formatMessage(messages.columnStartDate)
                    : column.key === 'endDate'
                    ? intl.formatMessage(messages.columnEndDate)
                    : column.key === 'products'
                    ? intl.formatMessage(messages.columnProducts)
                    : column.key === 'actions'
                    ? intl.formatMessage(messages.columnActions)
                    : column.label,
              }))}
              rows={productLabelsPaginatedResult.results}
              itemRenderer={(item, column) => {
                switch (column.key) {
                  case 'title':
                    return item.value.title || NO_VALUE_FALLBACK;
                  case 'labelText':
                    return item.value.labelText || NO_VALUE_FALLBACK;
                  case 'startDate':
                    return item.value.startDate || NO_VALUE_FALLBACK;
                  case 'endDate':
                    return item.value.endDate || NO_VALUE_FALLBACK;
                  case 'products':
                    return String(item.value.productIds.length);
                  case 'actions':
                    return canManage ? (
                      <IconButton
                        icon={<BinLinearIcon />}
                        label={intl.formatMessage(messages.deleteLabel)}
                        onClick={(event) => {
                          event.stopPropagation();
                          setLabelPendingDelete(item);
                        }}
                      />
                    ) : null;
                  default:
                    return null;
                }
              }}
              onRowClick={(row) => push(`${match.url}/${row.id}`)}
            />
          )}
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={productLabelsPaginatedResult.total}
            perPageRange="s"
          />
          <Switch>
            <SuspendedRoute path={`${match.url}/:id`}>
              <ProductLabelDetails
                onClose={() => {
                  push(`${match.url}`);
                  void refetch();
                }}
              />
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      ) : null}

      <ConfirmationDialog
        title={intl.formatMessage(messages.deleteConfirmTitle)}
        isOpen={Boolean(labelPendingDelete)}
        onClose={() => setLabelPendingDelete(null)}
        onCancel={() => setLabelPendingDelete(null)}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      >
        <Text.Body>
          {intl.formatMessage(messages.deleteConfirmMessage, {
            title:
              labelPendingDelete?.value.title || labelPendingDelete?.key || '',
          })}
        </Text.Body>
      </ConfirmationDialog>
    </Spacings.Stack>
  );
};
ProductLabels.displayName = 'ProductLabels';

export default ProductLabels;
