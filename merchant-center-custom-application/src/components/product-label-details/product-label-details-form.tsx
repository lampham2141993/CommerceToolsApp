import type { JSX, ReactElement } from 'react';
import { useFormik, type FormikHelpers } from 'formik';
import { useIntl } from 'react-intl';
import DateField from '@commercetools-uikit/date-field';
import MultilineTextField from '@commercetools-uikit/multiline-text-field';
import SelectField from '@commercetools-uikit/select-field';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import type {
  TProductLabelFormValues,
  TProductOption,
} from '../../types/product-labels';
import messages from './messages';
import validate from './validate';

type Formik = ReturnType<typeof useFormik<TProductLabelFormValues>>;
type FormProps = {
  formElements: ReactElement;
  values: Formik['values'];
  isDirty: Formik['dirty'];
  isSubmitting: Formik['isSubmitting'];
  submitForm: Formik['handleSubmit'];
  handleReset: Formik['handleReset'];
};

type TProductLabelDetailsFormProps = {
  onSubmit: (
    values: TProductLabelFormValues,
    formikHelpers: FormikHelpers<TProductLabelFormValues>
  ) => void | Promise<unknown>;
  initialValues: TProductLabelFormValues;
  isReadOnly: boolean;
  products: TProductOption[];
  productsLoading: boolean;
  children: (formProps: FormProps) => JSX.Element;
};

const ProductLabelDetailsForm = (props: TProductLabelDetailsFormProps) => {
  const intl = useIntl();
  const formik = useFormik<TProductLabelFormValues>({
    initialValues: props.initialValues,
    onSubmit: props.onSubmit,
    validate,
    enableReinitialize: true,
  });

  const productOptions = props.products.map((product) => ({
    value: product.id,
    label: product.key ? `${product.name} (${product.key})` : product.name,
  }));

  const formElements = (
    <Spacings.Stack scale="l">
      <TextField
        name="title"
        title={intl.formatMessage(messages.titleLabel)}
        value={formik.values.title}
        errors={
          TextField.toFieldErrors<TProductLabelFormValues>(formik.errors).title
        }
        touched={formik.touched.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
        renderError={(errorKey) => {
          if (errorKey === 'missing') {
            return intl.formatMessage(messages.missingTitle);
          }
          return null;
        }}
      />
      <DateField
        name="startDate"
        title={intl.formatMessage(messages.startDateLabel)}
        value={formik.values.startDate}
        errors={
          DateField.toFieldErrors<TProductLabelFormValues>(formik.errors)
            .startDate
        }
        touched={formik.touched.startDate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
        renderError={(errorKey) => {
          if (errorKey === 'missing') {
            return intl.formatMessage(messages.missingStartDate);
          }
          return null;
        }}
      />
      <DateField
        name="endDate"
        title={intl.formatMessage(messages.endDateLabel)}
        value={formik.values.endDate}
        errors={
          DateField.toFieldErrors<TProductLabelFormValues>(formik.errors)
            .endDate
        }
        touched={formik.touched.endDate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
        renderError={(errorKey) => {
          if (errorKey === 'missing') {
            return intl.formatMessage(messages.missingEndDate);
          }
          if (errorKey === 'invalidRange') {
            return intl.formatMessage(messages.invalidDateRange);
          }
          return null;
        }}
      />
      <MultilineTextField
        name="labelText"
        title={intl.formatMessage(messages.labelTextLabel)}
        value={formik.values.labelText}
        errors={
          MultilineTextField.toFieldErrors<TProductLabelFormValues>(
            formik.errors
          ).labelText
        }
        touched={formik.touched.labelText}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={props.isReadOnly}
        isRequired
        horizontalConstraint={13}
        renderError={(errorKey) => {
          if (errorKey === 'missing') {
            return intl.formatMessage(messages.missingLabelText);
          }
          return null;
        }}
      />
      <TextField
        name="imageUrl"
        title={intl.formatMessage(messages.imageUrlLabel)}
        hint={intl.formatMessage(messages.imageUrlHint)}
        value={formik.values.imageUrl}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={props.isReadOnly}
        horizontalConstraint={13}
      />
      {formik.values.imageUrl ? (
        <img
          src={formik.values.imageUrl}
          alt={formik.values.title || 'Label preview'}
          style={{ maxWidth: 240, maxHeight: 160, objectFit: 'contain' }}
        />
      ) : null}
      <SelectField
        name="productIds"
        title={intl.formatMessage(messages.productsLabel)}
        hint={intl.formatMessage(messages.productsHint)}
        value={formik.values.productIds}
        touched={formik.touched.productIds}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isMulti
        options={productOptions}
        isReadOnly={props.isReadOnly}
        isDisabled={props.productsLoading}
        horizontalConstraint={13}
      />
      {props.productsLoading ? (
        <Text.Detail intlMessage={messages.productsLoading} />
      ) : null}
    </Spacings.Stack>
  );

  return props.children({
    formElements,
    values: formik.values,
    isDirty: formik.dirty,
    isSubmitting: formik.isSubmitting,
    submitForm: formik.handleSubmit,
    handleReset: formik.handleReset,
  });
};
ProductLabelDetailsForm.displayName = 'ProductLabelDetailsForm';

export default ProductLabelDetailsForm;
