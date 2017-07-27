# Bitcoin Alerts

**Bitcoin Rate Alerts using [Web Push Notifications](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/)**

## Motivation

Open Web Standards make the web great, and it's always exciting to experiment with new features
on Web. Push Notifications are a very powerful way to [engage and retain](https://developers.google.com/web/fundamentals/engage-and-retain) customers on the web, and provides instant communication with them.

The Web Push Protocol is a secure way to implement Push Notifications using technologies such as VAPID and Secure Content encryption for the payload, making it more secure if you don't want to trust any third party to handle your sensitive data. Implementing Push Notifications system based on Web Push Protocol will be the best choice for you.

Third party solutions such as [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/) also implement this standard for the latest browsers under the hood but provide syntactic sugar and abstractions on top of it which makes things easier. So, learning more about Web Push Protocol makes it totally worth the shot.

### About Bitcoin Alerts 

Bitcoin Alerts provides users with updated information on Bitcoin Exchange Rate from currently 
Bitcoin to USD using the power of [Web Push Protocol](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/web-push-protocol) without using any propreitary solution 
such as [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/) staying 
true to ther power of Web.

Bitcoin Alerts implements Web Push Protocol Standard and works [across browsers](http://caniuse.com/#feat=push-api) :smirk:. No credentials are required to run this demo :tada: but only some willingess and :heart.

This applications consists of a client side, to subscribe to the Push Notificaiton as well as trigger the Push Notifications, alongwith a server side used to Trigger the Push Notifications on the server side as well as storing the subscriptions.

## Installing and Building this Application

The application is divided into two parts and process varies for both 
Server and Client. So the process for both of these components of applications is explained
below. Installation procedure is exactly the same for both of these applications.

You can run either `npm install` or `yarn` depending on the package manager 
you are using. Both should work, however, this repo only provides `package-lock.json`.

### Frontend

The client side can be run in the development and production mode, which differ in the output produced. The development version produces unminified output and starts using a devServer without outputting any thing to the filebased system and keeping everything in memory.

While production version, produces minified output into the dist folder. 

After installating dependencies you can use the following command to start the development server.

```bash
npm run start
```

In order to build the server, you can use the command `npm run build` replacing start with build.

#### Modifying constants for your purpose

If you want to build the application, and modify some constants such as the URL of the Server client talks to. You can do it, without mingling with the code. An easy way to do it set the following environment variables and run `npm run build` or `npm run start` based on your needs.

- `DEFAULT_SERVER_URL` (Server our client talks to for storing subscriptions and triggering alerts)

In order to hard set the value in webpack's config, read [Usage Of DefinePlugin](usage-of-defineplugin).


### Application Server

In order to install all the dependencies of Application Server run `npm install`.
Running `npm start`, will start the server on port 3000.

There are a few environment variables you will need to configure in order to successfully run this application server. This include the VAPID related details you need to have in order to launch the server successfully otherwise error will be thrown.

#### Getting the VAPID Credentials

In order to get the VAPID credentials to use for your application, you can use web-push commandline. Read their [command line guide](https://github.com/web-push-libs/web-push#command-line), it might be easiest way to generate a VAPID Public and Private key. 

#### Environment variables

The Environment Variables we need to set in the server are mostly related to VAPID.

- `VAPID_PUBLIC_KEY` Public Key required for VAPID
- `VAPID_PRIVATE_KEY` Private key required for VAPID
- `VAPID_SUBJECT_EMAIL` Subject email required for VAPID

#### Setting environment varibales in Developmnet

In development mode you can set the environment variables in .env file to make things simple. You are also welcome to set them through other ways.

Here's the format for `.env` file:

```.env
VAPID_PUBLIC_KEY=VALUE
VAPID_PRIVATE_KEY=VALUE
VAPID_SUBJECT_EMAIL=VALUE
```

#### Setting env variables in Production

In production environment they should be a part of your environment, your cloud host must have a functionality to do that. Such as `now` or `heroku` or any other popular host provide.

## Code Structure of the application

The Code Structure of the application consists of a separate Front end and Application Server, both are required for a fully functioning application.

### Front end Application

The front end application is contained within [`client/`](./client/) directory and contains the code that's related to front end.

#### Webpack Usage

This application is bundled using Webpack, and takes advantage of different Webpack specific features, such as automatic injection of scripts using HTMLWebpackPlugin, Entry Points, DefinePlugin etc. I want to explain about few customization options in the Webpack, but other than that, it's good to go.

##### Usage of DefinePlugin

Do you want to bundle this application for a Custom Server Host? Well, than you should read on, because here I explain how. One manual bruteforce stone age way, is to go into the source code and change the variable `SERVER_API_HOST` and `SERVER_BASE_URL` constants for [serverSubscription.js](./client/src/app/serverSubscription.js) and [serverApi.js](./client/src/admin/serverApi.js) to point to your own hostname. 

The DefinePlugin solves this problem and makes it much easier, with the added accessibility of DefinePlugin you only need to go in `[webpack.common.js](./client/webpack.common.js)` change the properties passed to DefinePlugin, and then run `npm build` or `npm start` depending on your usecase. This makes things simple. 

<!--Write more about DefinePlugin-->

#### Usage of Entry points in this application

Another advanced feature being used here is known as entry points, which allows us to compile different JavaScript files based on different entry points. Keeping code bases for different entry points separate and more modular. We have two major entry points in our application.

1. Bitcoin Notifications Page
2. Bitcoin Admin Page

#### Bitcoin Notifications Page

This entry point contains the code related to subscribing/unsubscribing the user to/from the application and sending the subscription to the Application Server. ServiceWorker also gets registered through this entry point.

Entry file for this bundle is at [client/src/app/index.js](./client/src/app/index.js) and you can find the HTML template for this entry point, in which the code is injected in [./client/templates/index.html](./client/templates/index.html).

The ServiceWorker file in this application listens for the major event `push` which is emitted whenever the client receives a push notification for the application. 

Currently, only two types of notifications are displayed to the user. One is the `welcome` type notification which is displayed only the first time for the subscriber, whenever the subscription is stored on the server side. The other is of type `bitcoin_rate` which is displayed whenever the bitcoin rate notification is triggered. 

I encourage you to take a peak in [service-worker.js](./client/src/app/service-worker.js), it's a one file based ServiceWorker, without any imports and complexities. You should take note no how `push` event is handled. Only the required data is transmitted to the service worker, icons and other such information is determined by the worker itself.

#### Bitcoin Admin Page

The entry point of the Bitcoin Admin page contains the code related to triggering a Bitcoin Rate Push Notification on the Server Side using a user friendly UI. The entry point for Bitcoin Admin page can be found in [`./src/admin/index.js`](./src/admin/index.js) and is simply issuing XHR Requests to the Application Server.

There's also a [template](./client/templates/admin.html) associated with the admin page.

### Application Server (Backend) for Bitcoin Alerts

Application Server is important component in the Push Notifications flow and is required 
in order to trigger Web Push Notifications. As a JavaScript based project, we are making use of a simple Node based backend in this project which has the following responsibilities:

#### Provide a CRUD API for the PushSubscription
In order to independently send Push Notifications to all the Subscribers we are going to store the PushSubscriptions somewhere. Since, this is a demo application I have chosen [nedb](https://github.com/louischatriot/nedb) to store the PushSubscription received from the client.

However, this specific app server because of it's nature doesn't have any authentication builtin so you should either build that within this application or refrain from using it production :speak_no_evil: .

#### Sends Notifications to the user using WebPush Protocol

In order to send Push Notifications the application server needs to implement the Web Push Protocol and use it to communicate with different Push Services on the Web, but it's hard and time consuming to implement all this from scratch, that's why we are using an easy to use library known as [web-push](https://github.com/web-push-libs/web-push) available for nodejs to make this simple for us. 

This library manages all the tough parts for us and also provides backwards compatibility support for old browsers using GCM.

Now whenever the request to the `push_bitcoin` endpoint is made, it retrieves the latest price from the [CoinDesk API](https://www.coindesk.com/api/) and sends the Push Notifications to all the available subscribers.

These are all the components of this application explained. For any other confusion or queries feel free to open an issue on this repository.

### Application flow for the system

Following details the flow of specific cases Bitcoin Alerts was created for.

The flow starts when client subscribes to the Push Notifications and grants necessary permissions for the Push Notifications to work. Afterwards, the Subscription is send to the Server, where it's stored. Now, whenever the client needs to trigger a Push Notification Alert, the client makes a request to a server endpoint, either using the provided UI Client known as Bitcoin Alerts Admin or manually to a URL. Afterwards, server retrieves the latest Bitcoin Exchange rate and uses the credentials previously stored to prepare a request to be sent to the Push Server 
in order to trigger a Push Event on the client. 

This is an abstract summary of the application and doesn't contain any programmatic details. VAPID and various content encryptions mechanism are delegated to the open sourced [web-push](https://github.com/web-push-libs/web-push) library provided for [node.js](https://nodejs.org).

## Questions 

### How are alerts pushed?

There's no rocket sceince in how we do it, we use an Admin page, which sends a request to the server component
of our application to push alerts to either all or one specific subscriber. That's pretty much it. In a system with real world implications, this push event can be launched in response to an event related to bitcoins or on a schedules, there are many ways this can happen. The goal here is to launch it using the simplest system.

<!--
  Details about the Contributions, tell that this project is not done yet and any 
  ammendments and features to be 
-->
## Contributions

Software is never complete. If you find something you can improve on, you are going to Fix it and make a super awesome PR. You have all my force. Looking forward for your contribution. :heart:


## LICENSE

MIT LICENSE. SEE [LICENSE](LICENSE) for more details.