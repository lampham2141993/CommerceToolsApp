import type { FormikErrors } from 'formik';
import omitEmpty from 'omit-empty-es';
import TextInput from '@commercetools-uikit/text-input';
import type { TProductLabelFormValues } from '../../types/product-labels';

type TErrors = {
  title: { missing?: boolean };
  labelText: { missing?: boolean };
  startDate: { missing?: boolean };
  endDate: { missing?: boolean; invalidRange?: boolean };
};

const validate = (
  formikValues: TProductLabelFormValues
): FormikErrors<TProductLabelFormValues> => {
  const errors: TErrors = {
    title: {},
    labelText: {},
    startDate: {},
    endDate: {},
  };

  if (TextInput.isEmpty(formikValues.title)) {
    errors.title.missing = true;
  }
  if (TextInput.isEmpty(formikValues.labelText)) {
    errors.labelText.missing = true;
  }
  if (TextInput.isEmpty(formikValues.startDate)) {
    errors.startDate.missing = true;
  }
  if (TextInput.isEmpty(formikValues.endDate)) {
    errors.endDate.missing = true;
  } else if (
    formikValues.startDate &&
    formikValues.endDate < formikValues.startDate
  ) {
    errors.endDate.invalidRange = true;
  }

  return omitEmpty(errors);
};

export default validate;
