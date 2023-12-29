<img src="https://github.com/dufoli/salesforce-inspector-reboot/blob/master/addon/icon128.png?raw=true" align="right">

# Salesforce inspector reloaded

![GitHub release](https://img.shields.io/github/v/release/dufoli/salesforce-inspector-reboot?sort=semver)
[![Chrome Web Store Installs](https://img.shields.io/chrome-web-store/users/hpijlohoihegkfehhibggnkbjhoemldh)](https://chrome.google.com/webstore/detail/salesforce-inspector-relo/hpijlohoihegkfehhibggnkbjhoemldh)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/hpijlohoihegkfehhibggnkbjhoemldh)](https://chrome.google.com/webstore/detail/salesforce-inspector-relo/hpijlohoihegkfehhibggnkbjhoemldh)
[![GitHub stars](https://img.shields.io/github/stars/dufoli/salesforce-inspector-reboot?cacheSeconds=3600)](https://github.com/dufoli/salesforce-inspector-reboot/stargazers/)
[![GitHub contributors](https://img.shields.io/github/contributors/dufoli/salesforce-inspector-reboot.svg)](https://github.com/dufoli/salesforce-inspector-reboot/graphs/contributors/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Chrome and Firefox extension to add a metadata layout on top of the standard Salesforce UI to improve the productivity and joy of Salesforce configuration, development, and integration work.

We all know and love Salesforce Inspector: As the great Søren Krabbe did not have the time to maintain it anymore, I decided to take over so trailblazer community can keep asking for new features !

- [Salesforce inspector reloaded](#salesforce-inspector-reloaded)
  - [Documentation](#documentation)
  - [New features compared to original SF Inspector](#new-features-compared-to-original-sf-inspector)
  - [Security and Privacy](#security-and-privacy)
  - [Use Salesforce Inspector with a Connected App](#use-salesforce-inspector-with-a-connected-app)
  - [Installation](#installation)
    - [Browser Stores](#browser-stores)
    - [Local Installation](#local-installation)
  - [Troubleshooting](#troubleshooting)
  - [Contributions](#contributions)
  - [Development](#development)
    - [Chrome](#chrome)
    - [Firefox](#firefox)
    - [Unit tests](#unit-tests)
    - [Linting](#linting)
  - [Design Principles](#design-principles)
  - [About](#about)
  - [License](#license)

## Documentation

> User guide for using the extension.

[![view - Documentation](https://img.shields.io/badge/view-Documentation-blue?style=for-the-badge)](https://tprouvot.github.io/Salesforce-Inspector-reloaded/ "Go to extension documentation")


## New features compared to original SF Inspector

[List of changes](CHANGES.md)

- Allow users to update API Version [feature 58](https://github.com/tprouvot/Salesforce-Inspector-reloaded/issues/58)
- Add new "Shortcuts" tab to accelerate setup navigation [feature 42](https://github.com/tprouvot/Salesforce-Inspector-reloaded/issues/42)
- Add shortcuts links to (list of record types, current SObject RecordType and objet details, show all data from user tab) from popup [feature 34](https://github.com/tprouvot/Salesforce-Inspector-reloaded/issues/34)
- Control access to Salesforce Inspector reloaded with profiles / permissions (Implement Auth2 flow to generate access token for connected App) [how to](https://github.com/dufoli/salesforce-inspector-reboot/wiki/How-to#use-sf-inspector-with-a-connected-app)
- Update manifest version from [v2](https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/) to v3 (extensions using manifest v2 will be removed from the store)
- New UI for Export / Import

## Security and Privacy

The Salesforce Inspector browser extension/plugin communicates directly between the user's web browser and the Salesforce servers. No data is sent to other parties and no data is persisted outside of Salesforce servers after the user leaves the Salesforce Inspector pages.
The Inspector communicates via the official Salesforce webservice APIs on behalf of the currently logged in user. This means the Inspector will be capable of accessing nothing but the data and features the user has been granted access to in Salesforce.

All Salesforce API calls from the Inspector re-uses the access token/session used by the browser to access Salesforce. To acquire this access token the Salesforce Inspector requires permission to read browser cookie information for Salesforce domains.

To validate the accuracy of this description, inspect the source code, monitor the network traffic in your browser or take my word.

## Use Salesforce Inspector with a Connected App

Follow steps described in [how-to documentation](https://tprouvot.github.io/Salesforce-Inspector-reloaded/how-to/#use-sf-inspector-with-a-connected-app)

## Installation

### Browser Stores

- [Chrome Web Store](https://chrome.google.com/webstore/detail/salesforce-inspector-relo/hpijlohoihegkfehhibggnkbjhoemldh)
- [Firefox Browser Add-ons](https://addons.mozilla.org/en-US/firefox/addon/salesforce-inspector-reloaded/)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/salesforce-inspector-relo/noclfopoifgfgnflgkakofglfeeambpd)

### Local Installation

1. Download or clone the repo.
2. Checkout the releaseCandidate branch.
3. Open `chrome://extensions/`.
4. Enable `Developer mode`.
5. Click `Load unpacked extension...`.
6. Select the **`addon`** subdirectory of this repository.

## Troubleshooting

- If Salesforce Inspector is not available after installation, the most likely issue is that your browser is not up to date. See [instructions for Google Chrome](https://productforums.google.com/forum/#!topic/chrome/YK1-o4KoSjc).
- When you enable the My Domain feature in Salesforce, Salesforce Inspector may not work until you have restarted your browser (or until you have deleted the "sid" cookie for the old Salesforce domain by other means).

## Contributions

Contributions are welcome!

To submit a PR, please create a branch from releaseCandidate which is the work in progress next version.
This branch will be merge into master when the new version is published on web store.

Make sure to update CHANGES.md file by describing the improvement / bugfix you realised.

In order to make sure everyone who reads documentation is aware of your improvement, you can update the 'how-to' page to document / expose this new functionality.

Linting : to assure indentation, formatting and best practices coherence, please install ESLint extension.

## Development

1. Install Node.js with npm
2. `npm install`

### Chrome

1. `npm run chrome-dev-build`
2. Open `chrome://extensions/`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select the `addon` subdirectory of this repository.

### Firefox

1. `npm run firefox-dev-build`
2. In Firefox, open `about:debugging`.
3. Click `Load Temporary Add-on…`.
4. Select the file `addon/manifest.json`.

### Unit tests
TODO
1. `npm test`

### Linting

TODO REMOVE :`npm run eslint`
1. `npm run build`

## Design Principles

(we don't live up to all of them. pull requests welcome)

- Stay completely inactive until the user explicitly interacts with it. The tool has the potential to break Salesforce functionality when used, since we rely on monkey patching and internal APIs. We must ensure that you cannot break Salesforce just by having the tool installed or enabled. For example, we won't fix the setup search placeholder bug.
- For manual ad-hoc tasks only. The tool is designed to help administrators and developers interact with Salesforce in the browser. It is after all a browser add-on. Enabling automation is a non-goal.
- User experience is important. Features should be intuitive and discoverable, but efficiency is more important than discoverability. More advanced features should be hidden, and primary features should be central. Performance is key.
- Automatically provide as much contextual information as possible, without overwhelming the user. Information that is presented automatically when needed is a lot more useful than information you need to explicitly request. For example, provide autocomplete for every input.
- Provide easy access to the raw Salesforce API. Enhance the interaction in a way that does not break the core use case, if our enhancements fails. For example, ensure we can display the result of a data export even if we cannot parse the SOQL query.
- It is fine to implement features that are already available in the core Salesforce UI, if we can make it easier, smarter or faster.
- Ensure that it works for as many users as possible. (for system administrators, for standard users, with person accounts, with multi currency, with large data volumes, with professional edition, on a slow network etc.)
- Be conservative about the number and complexity of Salesforce API requests we make, but don't sacrifice the other principles to do so.
- Focus on system administrators, developers and integrators.

## About

By Thomas Prouvot and forked from [Søren Krabbe and Jesper Kristensen](https://github.com/sorenkrabbe/Chrome-Salesforce-inspector)

## License

[MIT](./LICENSE)