### Creating a client

A basic bitcoin client which provides the subscription in the output,
and functions a lot like our previous work. But this is in Vanilla JavaScript.

### ServerSide Notification System

The system for the ServerSide is a common Push Notification system based on storing 
the Alerts for the user. This stores all the subscriptions in a database and can 
send notifications to a specific one or all the subscribers in the system.

How do I envision a server based Push Notification System for Bitcoin Alerts?

These are CRUD operations and list can go on for these kinds of operations, but the key
here is to be minimalistic.
Then endpoints this system is going to contain will include:

- An endpoint to submit newly created subscription
- An endpoint to get all the subscriptions
- An endpoint to get the currency 
- An endpoint to remove the subscriptions
- An endpoint to delete all the subscriptions

How can we expand this system to account for groups?

First, we'll need a way, to collect subscribers based on a certain
characteristic, whether by device group or location. Afterwards, we can just send
the notifications to the given group.

This is a nice problem to work on and one that hasn't been solved in the open world
by anyone till now.

### Microservices based Architecture.

Some of the things our current applications are doing require
processing power, as well as delays due to the network, separating the services for these
tasks should give a performance boost as we can delegate, one heavy task of sending web push 
notifications which involves encrypting the JSON Web Token as well as payload to this service.

So we can rapidly process our notifications and leave the delivery to this microservice, this 
is a pattern I am going to further explore, but right now I am still working on 
developing using Monolith.

### Client

Real Test is not just displaying a few logging statements 
to propagate the message to the user, but to also make the flow 
easier to follow for the user of the application. 

In order to make it easier for the user to understand what messages are they going 
through and what can be the consequences of these messsages.

#### We have updates for three of the subscriptions to the server

1. Updating the Subscription on the Server
2. Deleting the Subscription from the Server
3. Creating a subscription on the Server

All three are very important to be read, as they are needed
to establish the proper connections in the server. So it'll be important 
to identify scenarios in which we should make a request to the server
in all three cases.


#### Updating the ServiceWorker

ServiceWorker is going to do most of the formatting required to display 
the message on the Client side, from Server Side it's going to obtain the useful data,
such as the rate and currency, it's the client responsibility  
to generate useful messages.

If the type is unknown, a generic push notification can be displayed which
is sufficient for the use case at hand.

##### Welcome Push Notification

Welcome Push Notification is not going to display the welcome, but represents the 
first notification any user should receive when they subscribe to the bitcoin application,
discussion related to the design of this notification.

This notification should take the user back to the bitcoin alerts 
website, or create a client to take the user back to this website. This can be done 
both using the action as well as a generic touch/click event on the notification.

Designing the notifications and the associated images for these notifications
- Badge (Android badge for any bitcoin would work)

##### Bitcoin admin page

In order to trigger events, we need an admin page. In reality when using an application 
similar to Bitcoin Alerts, the notification will be triggered in response to an event such as
a surge in the rates of Bitcoin, or any other major event related to Bitcoins but since we 
don't have that backend. Our events are going to be triggered using an Admin Page.

###### Conception of Admin Page

Admin Page will trigger two events one in order to send a notification to a specific
user using their identification and other for sending the notification
to all users. UI should be kept relatively simple and what matters more is
it's a lot managable and very similar to the Bitcoin Alerts Notification Page,
but with support for admin configurations.

For the first concept there can be two cards. One card can be used to send the notification 
to all the subscribers in our list. The other card can be used to send the notification
to a specific subscriber by using the Server id stored in the database for the subscriber.

Tasks to complete for the application

- Complete the Admin Page and Alert Functionality (Design is approximately done) (done)
- Code the Bitcoin Alerts Admin Page Subscriber Card! (done)
- Build a Production Version of client (done)
- Implement Specific Subscriber Logic (done)

 Refrain from creating a new subscriber every time the page is refreshed. This is one of
 the biggest problems we are facing, as it creates multiple accounts for a given user.
 Creating a new subscription can be acheived through finding the subscribers based on the endpoint, 

 Creating a server id, and then getting identified by that server id,
 can be a time consuming process. A more easier thing to do will be to do the manipulations
 on the client side, and use those manipulations to make sense of the data.

 Final task before we can move on to other things.

 ### Features for future
 
 Create a wider range of control using the Admin Page present to display Bitcoin Alerts.
 Enable options for creating and removing supscribptions too.

### Add a Specific Subscriber ID version
