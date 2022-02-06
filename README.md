# user-service
User service for getf1tickets

## Description

> User management is delegated to the “User” microservice. This microservice allows you to create, modify, delete them. It also allows you to retrieve various information such as personal data, the list of orders, etc.

## Installation

Make sure you have Node >12.X installed, yarn and yalc is installed globally.

```bash
git clone https://github.com/getf1tickets/user-service
cd user-service
yarn run local:install-sdk
yarn
```

## Deployment

1. Make sure the package.json is correct (especially with the sdk version)
2. Make sure the helm package is correct
2. Commit and push your changes
3. Tag the last commit to trigger the CI
4. When the CI is finished, do the rollup on the kubernetes cluster.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to tests as appropriate.
