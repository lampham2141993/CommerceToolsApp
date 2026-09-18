export const PRODUCT_LABELS_CONTAINER = 'product-labels';

export type TProductLabelValue = {
  title: string;
  startDate: string;
  endDate: string;
  labelText: string;
  imageUrl: string;
  productIds: string[];
};

export type TProductLabelFormValues = {
  title: string;
  startDate: string;
  endDate: string;
  labelText: string;
  imageUrl: string;
  productIds: string[];
};

export type TProductLabel = {
  id: string;
  key: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  value: TProductLabelValue;
};

export type TProductOption = {
  id: string;
  key?: string | null;
  name: string;
};

export const emptyProductLabelValue = (): TProductLabelValue => ({
  title: '',
  startDate: '',
  endDate: '',
  labelText: '',
  imageUrl: '',
  productIds: [],
});

export const parseProductLabelValue = (raw: unknown): TProductLabelValue => {
  if (!raw || typeof raw !== 'object') {
    return emptyProductLabelValue();
  }

  const value = raw as Record<string, unknown>;
  return {
    title: typeof value.title === 'string' ? value.title : '',
    startDate: typeof value.startDate === 'string' ? value.startDate : '',
    endDate: typeof value.endDate === 'string' ? value.endDate : '',
    labelText: typeof value.labelText === 'string' ? value.labelText : '',
    imageUrl: typeof value.imageUrl === 'string' ? value.imageUrl : '',
    productIds: Array.isArray(value.productIds)
      ? value.productIds.filter((id): id is string => typeof id === 'string')
      : [],
  };
};

export const toProductLabelFormValues = (
  value?: TProductLabelValue | null
): TProductLabelFormValues => ({
  title: value?.title ?? '',
  startDate: value?.startDate ?? '',
  endDate: value?.endDate ?? '',
  labelText: value?.labelText ?? '',
  imageUrl: value?.imageUrl ?? '',
  productIds: value?.productIds ?? [],
});

export const formValuesToProductLabelValue = (
  values: TProductLabelFormValues
): TProductLabelValue => ({
  title: values.title.trim(),
  startDate: values.startDate,
  endDate: values.endDate,
  labelText: values.labelText.trim(),
  imageUrl: values.imageUrl.trim(),
  productIds: values.productIds,
});

export const createProductLabelKey = (title: string) => {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = Date.now().toString(36);
  return `${slug || 'label'}-${suffix}`;
};
