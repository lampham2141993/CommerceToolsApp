# CommerceTools Custom Application (Connect)

Merchant Center Custom Application with **Product labels**, packaged for [commercetools Connect](https://docs.commercetools.com/merchant-center-customizations/deployment/commercetools-connect.md).

## Structure

```
connect.yaml
merchant-center-custom-application/   # Custom Application source
```

## Local development

```sh
cd merchant-center-custom-application
cp .env.example .env   # fill CTP_* for scripts; set ENTRY_POINT_URI_PATH / CLOUD_IDENTIFIER
npm install
npm start
```

## Deploy with Connect (Option B)

1. **Register** the Custom Application in Merchant Center (placeholder URL is fine).
   - Entry point URI path must match `ENTRY_POINT_URI_PATH` (default: `starter-typescript-4e8eec`).
   - Scopes: `view_products`, `manage_products`, `view_key_value_documents`, `manage_key_value_documents`.
   - Copy the **Application ID**.

2. **Push** this repo to GitHub and create a **git tag** (release), e.g. `v1.0.0`.

3. **Create a Connector** (MC → Connect, or Connect API) pointing at this repo + tag.

4. **Publish** the Connector (preview or private use).

5. **Deploy / Install** with:
   - `CUSTOM_APPLICATION_ID` = Application ID from step 1
   - `ENTRY_POINT_URI_PATH` = `starter-typescript-4e8eec`
   - `CLOUD_IDENTIFIER` = `gcp-au`

6. Copy the deployment **URL** from the installation, then update the Custom Application’s **Application URL** in Merchant Center.

7. **Install** the Custom Application on your Project and grant team permissions.

If the GitHub repo is **private**, grant read access to the [connect-mu](https://github.com/connect-mu) machine user (SSH URL).
