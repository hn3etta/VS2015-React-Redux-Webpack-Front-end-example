# VS2015-React-Redux-Webpack-Front-end-example
Visual Studio 2015 React Redux Webpack Front-end example

This example site was mostly built following Cory House's excellent Pluralsight course "[Building Applications with React and Redux in ES6](https://app.pluralsight.com/library/courses/react-redux-react-router-es6)".
I modified things here and there to fit into Visual Studio 2015 (update 3) and to prove out multiple technologies.

If you are completely new to React then I advise you watch [Ryan Florence's React.js course out on FrontEnd Masters](https://frontendmasters.com/courses/react/).

If you are new to Redux and Webpack please watch [Cory's course first](https://app.pluralsight.com/library/courses/react-redux-react-router-es6).

##Technologies used in this starter:
* [react](https://github.com/facebook/react)
* [redux](https://github.com/rackt/redux)
* [react-router](https://github.com/rackt/react-router)
* [immutable js](https://github.com/facebook/immutable-js)
* [redux persist](https://github.com/rt2zz/redux-persist)
* [webpack](https://github.com/webpack/webpack)
* [babel](https://github.com/babel/babel)
* [express](https://github.com/expressjs/express)
* [xo](https://github.com/sindresorhus/xo)
* [jest](http://facebook.github.io/jest)
* [enzyme](https://github.com/airbnb/enzyme)
* [node sass](https://github.com/sass/node-sass)


I created this example site for developers (like myself) that enjoy coding in Visual Studio 2015 and want to expirenece the latest in front-end development.  This starter also uses SASS following ITCSS and BEM.
#### This is still a work in progress.

### Running the Example Locally

```shell
npm install -g cross-env jest updtr xo
```

1. git clone https://github.com/hn3etta/VS2015-React-Redux-Webpack-Front-end-example
    and https://github.com/hn3etta/VS2015-React-Redux-Webpack-Back-end-example to the same location
2. Make sure .NET Core 1.0.1 is installed from https://www.microsoft.com/net/core#windowsvs2015
3. Make sure Visual Studio 2015 has update 3 installed (works using Community or Professional)
4. Install Node.js 6.9.1 to a root directory (example: C:\Node6)
5. Install Node.js Tools for Visual Studio
6. Install Visual Studio extension WebPack Task Runner
7. Install Visual Studio extension NPM Task Runner
8. Run Visual Studio as Administrator and then open the VS2015-frontend-example.sln file
9. Right click on VS2015-frontend-example project and select Properties.
    Make sure the Node.exe path: matches your Node installation directory (example: C:\Node6)
1. Make sure VS2015 uses the same Node verion you installed https://ryanhayes.net/synchronize-node-js-install-version-with-visual-studio-2015/
10. Right click on the VS2015-frontend-example's npm package property and
    select "Install Missing npm Packages"
11. I am running Windows 10 x64 so I needed to copy the "win32-ia32-47" binding node
    (https://github.com/sass/node-sass-binaries) into the node-sass vendor directory.
	Create a directory called "win32-ia32-47" inside of the node-sass vendor directory
	and drop the binding node "win32-ia32-47_binding.node" in there and rename to "binding.node".
	within node_modules.  Needed since Node Tools for Visual Studio runs in 32bit mode
12. Right click on VS2015-backend-example project and select "Set as Startup Project" then
    start without debugging (Cntr+F5)
13. Open the Visual Studio Task Runner Explorer and under package.json right click on "Start" then click "Run".

Then visit `127.0.0.1:3000` in your browser if your browser didn't already fire up.


### Test Drive the Example Site

>**Homepage and public content**

Sticking with the Pluralsight theme of "Courses" I created a public and private side of the web app.  The public side has content that talks about the various technologies used to create this example.  You can
either click on the "Learn More About" navigation links or the home page "Learn More" buttons.  The purpose of this was to showcase how easy it is to use React Router (URL routes).

The site styling is very basic and was put together using SASS and following the ITCSS and BEM methodologies.

>**Authentication**

Now click the "Login" link on the top right.
The login box should animate (GreenSock.js) into the view.  The login box has validation and an error display that slides down at the top of the login container (try entering an invalid username or password).  Animations for the error display are good old CSS Animations using setTimeout.

Any errors that occur outside of the current component (background asynchronous calls) are bubbled up to a SystemErrorContainer.  This container uses [Yahoo's react-sticky node](https://github.com/yahoo/react-stickynode) incase the user was halfway down the page when the error occurred.

On the .NET Core side of things, I configured CORS and JWT authentication.

Per the instructions on the login screen, login with a Username of "test@test.com" and a Password of "Password".

>**Courses**

Now that you successfully logged in, you should see "Courses" and "Open Courses" next to the "Home" navigational element.  Go ahead and navigate to "Courses".
Here you can add, edit and delete courses.  This is almost the same functionality from the PluralSight course, but I changed up the look and the React Component organization.
I also added the ability to switch a coure's status from "open" to "closed".  This is used for the "Open Courses" simulator.  Also added animations (GreenSock.js) for the sidebar slide in.

Try this out.  Reload the webpage while you are on the "Courses" page.  Notice that everything loaded and so did your authenticated session?  Your user authenticated store data was persisted to your browser's local storage via [Redux Persist](https://github.com/rt2zz/redux-persist).
If you logged out and then manually went to the /courses page, you will notice that you are redirected to the login page and if you logged in successfully you would be returned to the Courses page.

>**Open Courses**

Please make sure you are logged in again and Navigate to the "Open Courses" view to take this for a spin.  Building this view was the funnest part of this example.  This example really shows the power, speed and simplicity of React and Redux using Action Thunks and Immutable.js for synchronous and asynchronous data calls.
The purpose of this page was to simulate a handfull of courses that would display the number of students signed up for a certain course.  The data supplied to the course cards are just random numbers.

Click the green plus sign on each of the course cards to see synchronous and asynchronous data calls in action.  The clicking of the green plus triggers a synchronous action and the timeout execution performs an asynchronous call to the .NET Core WebAPI.
I had to throw a "Task.Delay" of one second in the .NET WebAPI so you could see the "Updating" message overlay the course card.  The ajax calls were so fast that the "Updating" message barely showed.

### Project Organization

I really enjoyed how Cory House organized all of the components, actions, reducers, selectors and stores.  I followed his lead.  All of the SASS (SCSS) file are located in the /src/styles directory.

Just like the course, everything starts at the index.js file in the /src directory.

### To Dos

Still need to work on the following

01. Fix open course modal pausing (Greensock)
02. Add logic to handle session timeouts while within the applcation (auth checks only occuring on state persist loading for page loads).
03. Add logic for localization
04. Complete all of the unit tests for the components


### License

MIT
