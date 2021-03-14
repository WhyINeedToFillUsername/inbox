# Inbox

This application is a messaging application for [inrupt/solid](https://inrupt.com/). Inbox is an web application written in angular
It uses [Yarn](https://yarnpkg.com/) (instead of angular's default npm) as a package manager.

## Live version
Application is deployed live at https://whyineedtofillusername.github.io/inbox/.

## How to run application yourself
### Prerequisites
Follow steps for running angular at https://angular.io/guide/setup-local - install node.js and yarn (instead/after npm).

### Build
Run `yarn install`, then you can run any step from package.json. To build app, run `ng build`. The build artifacts will be stored in the `dist/` directory.
However, you can omit the `ng build` and run the app directly:

### Run - development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Tests
### Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further details
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.
