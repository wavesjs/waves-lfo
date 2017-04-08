ES6 Prototyping Boilerplate
=======================================================

> A full-stack boilerplate for rapid prototyping with latest EcmaScript features (using [babel-latest](https://babeljs.io/docs/plugins/preset-latest/) preset) and websocket.

## Available Commands

```
npm run [command]
```

- `transpile`
  * transpile all files from `src` folder to `dist` folder
- `bundle`
  * run `transpile` command
  * create the browserified bundle
- `watch`
  * create a static file server
  * transpile files in `src` folder when changed
  * rebundle application on page load

## Usage

```sh
git clone --depth=1 https://github.com/Ircam-RnD/es6-prototyping-boilerplate.git dest_directory
cd dest_directory
rm -rf .git  # remove git history
npm install
```

This boilerplate uses [https://babeljs.io/](https://babeljs.io/) and [http://browserify.org/](http://browserify.org/).

