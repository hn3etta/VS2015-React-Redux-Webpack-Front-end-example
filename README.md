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

01. git clone https://github.com/hn3etta/VS2015-React-Redux-Webpack-Front-end-example 
    and https://github.com/hn3etta/VS2015-React-Redux-Webpack-Back-end-example to the same location
02. Make sure Visual Studio 2015 has update 3 installed
03. Install Node.js 6.9.1 to a root directory (example: C:\Node6)
04. Install Node.js Tools for Visual Studio
05. Install Visual Studio extension WebPack Task Runner
06. Install Visual Studio extension NPM Task Runner
07. In Visual Studio, open the VS2015-frontend-example.sln file
08. Right click on VS2015-frontend-example project and select Properties.
    Make sure the Node.exe path: matches your Node installation directory (example: C:\Node6)
09. Right click on the VS2015-frontend-example's npm package property and 
    select "Install Missing npm Packages"
10. I am running Windows 10 x64 so I needed to copy the "win32-ia32-47" binding node
    (https://github.com/sass/node-sass-binaries) into the node-sass vendor directory.
	Create a directory called "win32-ia32-47" inside of the node-sass vendor directory
	and drop the binding node "win32-ia32-47_binding.node" in there and rename to "binding.node".
	within node_modules.  Needed since Node Tools for Visual Studio runs in 32bit mode 
11. Right click on VS2015-backend-example project and select "Set as Startup Project" then
    start without debugging (Cntr+F5)
12. Open the Visual Studio Task Runner Explorer and under package.json right click on Start then click Run.

Then visit `localhost:3000` in your browser if your browser didn't already fire up.


### Test Drive the Demo

>**Go ahead and click around on the public content**

Sticking with the Pluralsight theme of "Courses" I created a public and private side of the web app.  The public side has content that talks about the various technologies used to create this example.  You can
either click on the "Learn More About" navigation links or the home page "Learn More" buttons.  The purpose of this was to showcase how easy it is to use React Router (URL routes).

The site styling is very basic and was put together using SASS and following the ITCSS and BEM methodologies.

>**Login and view the private side**

Now click the "Login" link on the top right.
The login box should animate (GreenSock.js) into the view.  The login box has validation and an error display that slides down at the top of the login container (try entering an invalid username or password).  Animations for the error display are good old CSS Animations using setTimeout.

Per the instructions, login with a Username of "test@test.com" and a Password of "Password".

>**Courses**

Now that you successfully logged in, you should see "Courses" and "Open Courses" next to the "Home" navigational element.  Go ahead and navigate to "Courses".
Here you can add, edit and delete courses.  This is pretty much the same functionality from the PluralSight course, but I changed up the look and the React Component organization.  Also added animations (GreenSock.js) for the sidebar slide in.

>**Open Courses**

Navigate to the "Open Courses" view to take this for a spin.  Building this view was the funnest part of this example.  This example really shows the power, speed and simplicity of React and Redux using Immutable.js for synchronous and asynchronous data calls.
The purpose of this page was to simulate a handfull of courses that would display the number of students signed up for a certain course.

Click the green plus sign on each of the course cards to see synchronous and asynchronous data calls in action.  The clicking of the green plus triggers a synchronous action and the timeout execution performs an asynchronous call to the .NET Core WebAPI.
I had to throw a "Task.Delay" of one second in the .NET WebAPI so you could see the "Updating" message overlay to the course card.  The ajax calls were so fast that the "Updating" message barely showed.

### Project Organization