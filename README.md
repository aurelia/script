# aurelia

[![ZenHub](https://raw.githubusercontent.com/ZenHubIO/support/master/zenhub-badge.png)](https://zenhub.io)
[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This repo is the home for Aurelia's concatenated script-tag-ready build. It also has a small starter app used for testing the scripts which is the source from which the new official starter kits derive.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions, please [join our community on Gitter](https://gitter.im/aurelia/discuss) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/hub.html). If you would like to have deeper insight into our development process, please install the [ZenHub](https://zenhub.io) Chrome or Firefox Extension and visit any of our repository's boards.

## Build

  1. Install the dependencies
    ```
    npm install
    ```
  2. Run either the build / bundle script
    ```bash
    # Build only core
    npm run build
    # Or full build, with router
    npm run bundle
    ```

## Run the example project
  1. Go to example folder inside this project
  2. Start a http server
  3. Navigate to `index.html` in browser