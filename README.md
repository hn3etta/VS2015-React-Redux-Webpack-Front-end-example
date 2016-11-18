# VS2015-React-Redux-Webpack-Front-end-example
Visual Studio 2015 React Redux Webpack Front-end example

This example site was mostly built following Cory House's excellent Pluralsight course "[Building Applications with React and Redux in ES6](https://app.pluralsight.com/library/courses/react-redux-react-router-es6)".  I modified things here and there to fit into Visual Studio 2015 (update 3) and to prove out multiple other technologies.

##Technologies used in this starter:
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [react-router](https://github.com/rackt/react-router)
* [immutable js](https://github.com/facebook/immutable-js)
* [redux persist](https://github.com/rt2zz/redux-persist)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [express](https://github.com/expressjs/express)
* [eslint](http://eslint.org)
* [mocha](https://github.com/mochajs/mocha)
* [enzyme](https://github.com/airbnb/enzyme)
* [expect](https://github.com/mjackson/expect)
* [node sass](https://github.com/sass/node-sass)


I created this example site for developers (like myself) that enjoy coding in Visual Studio 2015 and want to expirenece the latest in front-end development.  This starter also uses SASS following ITCSS and BEM.

### Running the Example Locally
````
01. git clone https://github.com/hn3etta/VS2015-React-Redux-Webpack-Front-end-example and https://github.com/hn3etta/VS2015-React-Redux-Webpack-Back-end-example to the same location
02. Make sure Visual Studio 2015 has update 3 installed
03. Install Node.js 6.9.1 to a root directory (example: C:\Node6)
04. Install Node.js Tools for Visual Studio
05. Install Visual Studio extension WebPack Task Runner
06. Install Visual Studio extension NPM Task Runner
07. In Visual Studio, open the VS2015-frontend-example.sln file
08. Right click on VS2015-frontend-example project and select Properties.  Make sure the Node.exe path: matches your Node installation directory (example: C:\Node6)
09. Right click on the VS2015-frontend-example's npm package property and select "Install Missing npm Packages"
10. I am running Windows 10 x64 so I needed to copy the "win32-ia32-47" node binding (https://github.com/sass/node-sass-binaries) into the node-sass vendor directory within node_modules.  Needed since Node Tools for Visual Studio runs in 32bit mode 
11. Open the Visual Studio Task Runner Explorer and under package.json right click on Start then click Run.

````
Then visit `localhost:3000` in your browser.


