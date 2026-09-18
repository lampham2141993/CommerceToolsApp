import { apiRoot, projectKey } from '../lib/ct/client';

async function main() {
  const { body } = await apiRoot.get().execute();

  console.log(
    JSON.stringify(
      {
        ok: true,
        projectKey,
        name: body.name,
        key: body.key,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('commercetools health check failed');
  console.error(error);
  process.exit(1);
});
