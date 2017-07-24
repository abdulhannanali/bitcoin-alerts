/**
 * serverSubscriptoin.js
 * Library to perform CRUD operations on the subscriptions on server
 */
import axios from 'axios';

const SERVER_BASE_URL = 'http://localhost:3000/'
const subscriberURL = SERVER_BASE_URL + 'subscriber';
/**
 * Creates the Subscription on the Server 
 * `subscription` is passed as body
 */
function createSubscription (subscription) {
  return axios.post(subscriberURL, {
    subscription: JSON.parse(JSON.stringify(subscription))
  });
}

function deleteSubscription (subscriptionId) {
  return axios.delete(subscriberURL, {
    data: {
      id: subscriptionId
    },
    responseType: 'json',
  });
}

function getSubscription (subscriptionId) {
  return axios.get(subscriberURL, { params: { id: subscriptionId }});
}

export default  { createSubscription, getSubscription, deleteSubscription };