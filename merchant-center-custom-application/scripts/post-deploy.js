/**
 * No-op postDeploy for merchant-center-custom-application.
 * Connect may invoke this after install; Custom Applications do not
 * register API Extensions or Subscriptions.
 */
console.log(
  '[merchant-center-custom-application] postDeploy: no-op (nothing to register)'
);
process.exit(0);
