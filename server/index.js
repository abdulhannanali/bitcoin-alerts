process.env.NODE_ENV === 'development' ? require('dotenv').config() : null;

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const coindesk = require('node-coindesk-api');
const webPush = require('web-push');
const DataStore = require('nedb');
const cors = require('cors');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT_EMAIL;

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

app.disable('x-powered-by');
app.use(morgan('dev'));

// Enable CORS for all the requests
app.use(cors());
app.options('*', cors());

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const db = {};

db.subscribers = new DataStore({ filename: 'subscribers.db', autoload: true });

app.use(bodyParser.json());

/**
 * bitcoin_rate endpoint used for  admin page to display the current rate 
 * not required for push notifiications
 */
app.get('/bitcoin_rate', function (req, res, next) {
  const currency = req.query.currency;
  coindesk.getCurrentPrice(currency)
    .then(bitcoin_data => res.json(bitcoin_data))
    .catch(error => next(error));
});

app.get('/subscriber', function (req, res, next) {
  const subscriberId = req.query.id ;
  if (subscriberId) {
    db.subscribers.find({ _id: subscriberId }, function (error, newDoc) {
      if (error) return next(error);
      res.json(newDoc[0]);
    });
  } else {
    res.status(400).json({ message: 'Provide a subscriber id in body as `id`' });
  }
});

app.post('/subscriber', checkSubscription, function (req, res, next) {
  const subscription = req.body.subscription;

  return db.subscribers.insert(subscription, function (error, newDoc) {
    if (error) return next(error);
    res.json(newDoc);
    triggerWelcomeNotification(newDoc);
  });
});

app.delete('/subscriber', function (req, res, next) {
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ message: 'Provide the ID of the subscription to be deleted'})
  }

  return deleteSubscription(id).then(result => res.json(result)).catch(error => next(error));
});

app.get('/subscribers', function (req, res, next) {
  return getAllSubscriptions()
    .then(function (subscriptions) {
      return res.json(subscriptions);
    })
    .catch(function (error) {
      next(error);
    });
});

/**
 * Handler to Push the bitcoin price to all the subscribers
 */
app.get('/push_bitcoin', function (req, res, next) {
  return getAllSubscriptions()
    .then(function (subscribers) {
      if (subscribers.length === 0 && !subscribers[0]) {
        return res.json({ message: 'There are no subscriptions to send to, create a subscription first'})
      }

      return coindesk.getCurrentPrice().then(function (data) {
        const usdBpi = data.bpi.USD;
        return triggerPushAll(subscribers, { type: 'bitcoin_rate', price: usdBpi });
      })
      .then(function (response) {
        res.status(200).send(response);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send({ message: 'Error occured while handling the request'});
      });
    });
});

/**
 * Trigger Push for All Subscriptions
 */
function triggerPushAll(subscribers, pushData) {
  // Parallel Chain method adopted from
  // https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/sending-messages-with-web-push-libraries
  return Promise.all(subscribers.map(sub => triggerPush(sub, pushData)));
}

/**
 * Triggers a push notification to the user
 */
function triggerPush(subscription, pushPayload) {
  const options = {
    vapidDetails: {
      publicKey: VAPID_PUBLIC_KEY,
      privateKey: VAPID_PRIVATE_KEY,
      subject: VAPID_SUBJECT
    },
  };

  return webPush.sendNotification(subscription, JSON.stringify(pushPayload))
    .then(() => ({ success: true, subscription }))
    .catch(function (error) {
      if ([404, 410].indexOf(error.status) !== -1) {
        return deleteSubscription(subscription._id);
      } else {
        console.log('Request not succeeded for id: ' + subscription._id);
        console.error(error);
      }

      return { error: error.message, subscription }
    });
}

/**
 * 
 * Welcome notification triggered the first time 
 * subscriber is registered to the server, as a way of acknowledgement and demo
 * about the way user is going to receive the notifications
 * in the future
 */
function triggerWelcomeNotification(subscription) {
  return triggerPush(subscription, { type: 'welcome' })
}

/**
 * Deletes a subscription from the database 
 * by providing it's id
 * 
 * @param {string} id
 * @return {Promise<number>} number of subscriptions removed if successful
 */
function deleteSubscription(id) {
  return new Promise((resolve, reject) => db.subscribers.remove({ _id: id },
  function (error, result) {
    if (error) {
      return reject(error);
    }
    else {
      return resolve(result);
    }
  }));
}

/**
 * Get all the subscriptions there are in the database
 */
function getAllSubscriptions() {
  return new Promise((resolve, reject) => {
    db.subscribers.find({}, (error, docs) => error ? reject(error) : resolve(docs));
  });
}

/**
 * Checks for a Subscription on the given
 * request, if not there, calls next with an error
 * 
 * Truly, a helper method to handle validation
 */
function checkSubscription(req, res, next) {
  console.log(req.body);
  if (!req.body.subscription) {
    return next(new Error('Subscription is not provided, please pass a subscription in body'));
  } else {
    return next();
  }
}

app.listen(PORT, HOST, function (error) {
  if (!error) {
    console.log(`Server is listening on ${HOST}:${PORT}`);
  }
});