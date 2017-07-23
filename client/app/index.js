// Imports all the Custom Styles as well as Material Design Lite
// Using a Webpack Familiar Syntax
import './styles.js';

import axios from 'axios';
import updateSupportCard from './supportCard';
import localForage from 'localforage';
import { updateSwitch, subscriptionSwitch, waitToggle } from './pushToggle';
import {  displayServerResponse, displayPushInfo, displayServerError } from './pushInfo';
import serverSubscription from './serverSubscription';
/**
 * Webpack Bundling Specific logic related to service worker.
 * Please IGNORE THIS!
 */
import swUrl from 'file-loader?name=[name].[ext]!./service-worker.js'

// Global Variables Regarding the Support of the PushManager Related APIs
const swSupport = navigator && 'serviceWorker' in navigator;
const pushSupport = window && 'PushManager' in window;
const isSupported = navigator  && swSupport && pushSupport;
const SAFE_APPLICATION_SERVER_KEY = 'BFyMIWmgIvBFAbC-0CrU6tqfiqr4A4rcVqWtnHncpPuKeFfGrnHCjOfvdumLoN6Lh8fdOecWdy2_yKF7dDPldAM'

/*
 * Global Variables to hold the state of
 * - `pushManager` - Manager for Push Notifications
 * - `pushSubscription` - Current Subscription stored in global state
 * 
 * `pushSubscription` is helpful to coordinate in actions such as
 * delete subscription so we don't have to do an additional getSubscription
 * call for the sake of this demo.
 */
let pushManager = null;
let pushSubscription = null;

document.addEventListener('DOMContentLoaded', function () {
  updateSupportCard(swSupport, pushSupport);
  if (isSupported) {
    // Registering the server here if supported
    navigator.serviceWorker.register('./service-worker.js').catch(function (error) {
      console.error('Failed to register the latest ServiceWorker');
      throw error;
    });

    initSubscription();
    subscriptionSwitch.addEventListener('change', function (changeEvent) {
      const checked = changeEvent.target.checked;
      waitToggle();
      if (checked) {
        subscribe();
      } else {
        unsubscribe();
      }
    });
  }
});

/**
 * Helper Function to Convert a URL Base 64 String to a Uint8Array type in JavaScript
 * @param {String} base64String
 * @return {Uint8Array} Uint8Array type
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Initial Subscription related logic
 */
function initSubscription() {
  navigator.serviceWorker.ready.then(
    function (registration) {
      pushManager = registration.pushManager;
      pushManager.getSubscription()
        .then(function (subscription) {
          updateSubscriptionUI(subscription);
        })
        .catch(function (error) {
          console.error(error);
          updateServerSubscription(null);
        });
    }
  );
}

/**
 * Subscribes to the Push Manager and updates the
 * UI if successful
 */
function subscribe () {
  pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(SAFE_APPLICATION_SERVER_KEY)
  })
  .then(function (subscription) {
    console.log('Subscribed!')
    pushSubscription = subscription;
    updateSubscriptionUI(subscription);
  })
  .catch(function (error) {
    console.log('Error occured while subscribing');
    console.error(error);
    updateSubscriptionUI(pushSubscription);
  });
}


/**
 * Unsubscribes the PushSubscription
 * and updates the subscription UI 
 */
function unsubscribe() {
  if (!pushSubscription) {
    console.log('`pushSubscription` is null');
    updateSubscriptionUI(null);
    return;
  }

  return (
    pushSubscription.unsubscribe()
      .then(function (removed) {
        pushSubscription = null;
        updateSubscriptionUI(pushSubscription);
      })
      .catch(function (error) {
        console.error(error);
        updateSubscriptionUI(pushSubscription);
      })
  )
}

// Updates the subscription on update
function updateSubscriptionUI(subscription) {
  updateSwitch(subscription);
  displayPushInfo(subscription);
  updateServerSubscription(subscription);
}

/**
 * Subscription storing logic
 * This function call also saves an id
 */
function updateServerSubscription(subscription) {
  return localForage.getItem('subscription')
    .then(function (savedSubscription) {
      // The previous subscription should be deleted here ideally,
      // so we can enjoy the new subscription
      serverSubscription.createSubscription(subscription)
        .then(function (response) {
          const subscriptionData = response.data;
          localForage.setItem('subscription', JSON.stringify(subscriptionData));
          displayPushInfo(subscription);
          displayServerResponse(subscriptionData);
        })
        .catch(function (error) {
          // TODO: At this point the operation should have been retried a fair number of 
          // times and the toggle should be disabled back, as they actually haven't been
          // enabled  
          displayServerError();
          console.error('Failed to update the status on the server');
          console.error(error);
        });
    });
}

/**
 * Removes the Subscription from the Client
 */
function removeSubscription(subscription) {
  return localForage.getItem('subscription')
    .then(function (subscription) {
      if (subscription) {
        console.log('Existing Subscription is going to be removed');
        return Promise.all([
          serverSubscription.deleteSubscription(subscription._id),
          localForage.setItem('subscriptionId', null)
        ]);
      }
    });
}

// Updates the Loading UI in order 
// to represent the loading state of the operations
// Disables the toggle for the duration of the task being performed
// in order to prevent from any other task to be executed
function showLoadingUI () {
  waitToggle();
}