# project-react-electron-ts
 > Live Editing Environment for Electron Apps using React, React-Hot-Loader, Typescript and Webpack

## Installation

```
yarn install // replace yarn with npm if desired.
```
## Usage
### Development with hot reloading
```
yarn run server		//to compile main and start the hot reloading server
yarn run dev-start		//to open electron in devmode with hmr.
```

### Compiling the files for distribution

```Shell
yarn run build     //to compile the files without hot reloading into dist/
yarn run start     //to run electron with compiled files
```

## TODO

* Remove Styled-components for `Window` component
