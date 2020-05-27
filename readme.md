# TFS PullRequest Dashboard
## What is it?
An extension for visual studio team services that adds a hub to the code section of tfs for viewing pull requests across all repositories.  To see specific details about features, including screenshots, see [overview.md](src/overview.md)

## Getting started

### Running Locally

To develop and run this project locally, you need to make changes src/app/appConfig.service.ts.  Uncomment the commented out lines near the top that set AppConfigService._devMode & AppConfigService._devApiEndpoint.  You will need to change _devApiEndpoint to a tfs collection uri that you wish to run against (ex. 'https://myname.visualstudio.com/' if running against visual studio online, or 'http://mytfsserver:8080/tfs/DefaultCollection' if running against an on-prem server).

With the local changes made, run:

`npm install && npm run start`

This will serve the dashboard page at localhost:8080/.  One caveat is that requests to tfs apis have cross-origin resource sharing (CORS) headers in their repsonses, which means that browsers such as chrome and firefox will not automatically handle authentication with the endpoints, and requests will fail.

To work around this issue:
- either use IE (which does not have this CORS restriction)
- run chrome without web security. See <http://stackoverflow.com/a/19317888> for instructions.
- Install [this Chrome plugin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) which allows you to easily toggle CORS restrictions on and off

### Packaging

To package a new vsix installer for the extension, run:

`npm install && npm run package`

## License
[MIT](LICENSE)
