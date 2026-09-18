import { useCallback } from 'react';
import type { FormikHelpers } from 'formik';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import {
  useShowApiErrorNotification,
  useShowNotification,
  type TApiErrorNotificationOptions,
} from '@commercetools-frontend/actions-global';
import {
  FormModalPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { ApplicationPageTitle } from '@commercetools-frontend/application-shell';
import { DOMAINS } from '@commercetools-frontend/constants';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { PERMISSIONS } from '../../constants';
import {
  useProductLabelFetcher,
  useProductLabelSaver,
  useProductsForLabelsFetcher,
} from '../../hooks/use-product-labels-connector';
import {
  toProductLabelFormValues,
  type TProductLabelFormValues,
} from '../../types/product-labels';
import { logger } from '../../utils/logger';
import messages from './messages';
import ProductLabelDetailsForm from './product-label-details-form';

type TProductLabelDetailsProps = {
  onClose: () => void;
};

const ProductLabelDetails = (props: TProductLabelDetailsProps) => {
  const intl = useIntl();
  const params = useParams<{ id: string }>();
  const isNew = params.id === 'new';
  const { loading, error, productLabel } = useProductLabelFetcher(params.id);
  const { products, loading: productsLoading } = useProductsForLabelsFetcher();
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const productLabelSaver = useProductLabelSaver();

  const handleSubmit = useCallback(
    async (
      formikValues: TProductLabelFormValues,
      formikHelpers: FormikHelpers<TProductLabelFormValues>
    ) => {
      try {
        const saved = await productLabelSaver.execute({
          formValues: formikValues,
          existingLabel: isNew ? null : productLabel,
        });

        showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(
            isNew ? messages.labelCreated : messages.labelUpdated,
            {
              title: saved?.value.title || formikValues.title,
            }
          ),
        });
        props.onClose();
      } catch (saveError) {
        logger.error('Product label form submit failed', {
          id: params.id,
          isNew,
        });
        showApiErrorNotification({
          errors: (Array.isArray(saveError)
            ? saveError
            : [saveError]) as TApiErrorNotificationOptions['errors'],
        });
        formikHelpers.setSubmitting(false);
      }
    },
    [
      intl,
      isNew,
      params.id,
      productLabel,
      productLabelSaver,
      props,
      showApiErrorNotification,
      showNotification,
    ]
  );

  const pageTitle = isNew
    ? intl.formatMessage(messages.createTitle)
    : productLabel?.value.title || intl.formatMessage(messages.editTitle);

  const showForm = isNew || Boolean(productLabel);
  const showNotFound = !isNew && !loading && !error && !productLabel;

  return (
    <ProductLabelDetailsForm
      initialValues={toProductLabelFormValues(productLabel?.value)}
      onSubmit={handleSubmit}
      isReadOnly={!canManage}
      products={products}
      productsLoading={productsLoading}
    >
      {(formProps) => (
        <FormModalPage
          title={pageTitle}
          isOpen
          onClose={props.onClose}
          isPrimaryButtonDisabled={
            formProps.isSubmitting || !formProps.isDirty || !canManage
          }
          isSecondaryButtonDisabled={!formProps.isDirty}
          onSecondaryButtonClick={formProps.handleReset}
          onPrimaryButtonClick={() => formProps.submitForm()}
          labelPrimaryButton={
            isNew ? FormModalPage.Intl.create : FormModalPage.Intl.save
          }
          labelSecondaryButton={FormModalPage.Intl.revert}
        >
          {loading && (
            <Spacings.Stack alignItems="center">
              <LoadingSpinner />
            </Spacings.Stack>
          )}
          {error && (
            <ContentNotification type="error">
              <Text.Body>{intl.formatMessage(messages.errorMessage)}</Text.Body>
            </ContentNotification>
          )}
          {showForm && formProps.formElements}
          {showForm && <ApplicationPageTitle additionalParts={[pageTitle]} />}
          {showNotFound && <PageNotFound />}
        </FormModalPage>
      )}
    </ProductLabelDetailsForm>
  );
};
ProductLabelDetails.displayName = 'ProductLabelDetails';

export default ProductLabelDetails;
