import axios from 'axios';
/**
 * Server API contains the calls that are going to be made
 * to the application server in order to create push notifications
 */

const SERVER_API_HOST = 'http://localhost:3000/';

/**
 * Sends a Bitcoin Alert to the provided
 * targetSubscriber.
 * 
 * targetSubscriber can be of two values
 * - 'all'    - sends the push notification to all the users
 * - serverId - send the push notification to the given server id
 */
export function sendBitcoinAlert(targetSubscriber) {
  if (targetSubscriber === 'all') {
    return axios.get(SERVER_API_HOST + 'push_bitcoin');
  } else {
    return axios.get(SERVER_API_HOST + 'push_bitcoin', {
      params: {
        id: targetSubscriber,
      }
    })
  }
}


export default { sendBitcoinAlert };