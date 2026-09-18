import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ClientBuilder } from '@commercetools/ts-client';

import {
  apiUrl,
  authUrl,
  clientId,
  clientSecret,
  projectKey,
  scopes,
} from './config';

function buildClient() {
  return new ClientBuilder()
    .withProjectKey(projectKey)
    .withClientCredentialsFlow({
      host: authUrl,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes,
    })
    .withHttpMiddleware({ host: apiUrl })
    .build();
}

export const apiRoot = createApiBuilderFromCtpClient(buildClient()).withProjectKey(
  { projectKey }
);

export { apiUrl, authUrl, projectKey };
