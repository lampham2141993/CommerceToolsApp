import { defineMessages } from 'react-intl';

export default defineMessages({
  createTitle: {
    id: 'ProductLabelDetails.createTitle',
    defaultMessage: 'Create product label',
  },
  editTitle: {
    id: 'ProductLabelDetails.editTitle',
    defaultMessage: 'Edit product label',
  },
  titleLabel: {
    id: 'ProductLabelDetails.titleLabel',
    defaultMessage: 'Title',
  },
  startDateLabel: {
    id: 'ProductLabelDetails.startDateLabel',
    defaultMessage: 'Start date',
  },
  endDateLabel: {
    id: 'ProductLabelDetails.endDateLabel',
    defaultMessage: 'End date',
  },
  labelTextLabel: {
    id: 'ProductLabelDetails.labelTextLabel',
    defaultMessage: 'Label text',
  },
  imageUrlLabel: {
    id: 'ProductLabelDetails.imageUrlLabel',
    defaultMessage: 'Image URL',
  },
  imageUrlHint: {
    id: 'ProductLabelDetails.imageUrlHint',
    defaultMessage: 'Provide a publicly reachable image URL for this label.',
  },
  productsLabel: {
    id: 'ProductLabelDetails.productsLabel',
    defaultMessage: 'Products',
  },
  productsHint: {
    id: 'ProductLabelDetails.productsHint',
    defaultMessage: 'Select one or more products this label applies to.',
  },
  missingTitle: {
    id: 'ProductLabelDetails.missingTitle',
    defaultMessage: 'Title is required.',
  },
  missingLabelText: {
    id: 'ProductLabelDetails.missingLabelText',
    defaultMessage: 'Label text is required.',
  },
  missingStartDate: {
    id: 'ProductLabelDetails.missingStartDate',
    defaultMessage: 'Start date is required.',
  },
  missingEndDate: {
    id: 'ProductLabelDetails.missingEndDate',
    defaultMessage: 'End date is required.',
  },
  invalidDateRange: {
    id: 'ProductLabelDetails.invalidDateRange',
    defaultMessage: 'End date must be on or after the start date.',
  },
  labelCreated: {
    id: 'ProductLabelDetails.labelCreated',
    defaultMessage: 'Product label "{title}" created',
  },
  labelUpdated: {
    id: 'ProductLabelDetails.labelUpdated',
    defaultMessage: 'Product label "{title}" updated',
  },
  errorMessage: {
    id: 'ProductLabelDetails.errorMessage',
    defaultMessage:
      'We were unable to fetch the product label. Please check your connection and try again.',
  },
  productsLoading: {
    id: 'ProductLabelDetails.productsLoading',
    defaultMessage: 'Loading products…',
  },
});
