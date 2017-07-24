/**
 * Module for handling the Card with PushSubscription information
 */
const subscriptionInfoCard = document.querySelector('.subscription-info');

const serverInfo = subscriptionInfoCard.querySelector('.code.server-subscription');
const subscriptionInfo = subscriptionInfoCard.querySelector('.code.info');
const serverId = subscriptionInfoCard.querySelector('.code.server-id');

/**
 * Displays the Push Info
 */
function displayPushInfo(pushSubscription) {
  if (!pushSubscription) {
    subscriptionInfoCard.style.display = 'none';
    return;
  }

  if (pushSubscription) {
    subscriptionInfoCard.style.display = '';
    subscriptionInfo.innerHTML = JSON.stringify(pushSubscription, null, 4);
  }
}

function displayServerId(id) {
  serverId.innerHTML = id;
}

function displayServerResponse(response) {
  serverId.innerHTML = response._id;
  serverInfo.innerHTML = JSON.stringify(response, null, 4);
}

function displayServerError() {
  serverId.innerHTML = 'Error occured';
  serverInfo.innerHTML = 'Error occured';
}

export { displayPushInfo, displayServerId, displayServerResponse, displayServerError };