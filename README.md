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

Bitcoin Alerts implements Web Push Protocol Standard and works [across browsers](http://caniuse.com/#feat=push-api) :smirk:. No authentication is required to run this demo but only some willingess and :heart.

This applications consists of a client side, to subscribe to the Push Notificaiton as well as trigger the Push Notifications, alongwith a server side used to Trigger the Push Notifications on the server side as well as storing the subscriptions. 

<!--
  Write more about Application
  The client side of the application and how it operates
  The server side of the application
  Code structure of the application
-->

<!--Is it necessary, It's useful but I still don't know if it's necessary to write this -->
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