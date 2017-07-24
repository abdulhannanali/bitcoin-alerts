import serverApi from './serverApi';
import Clipboard from 'clipboard';
import './adminStyles.css';

const subscribersCard = document.querySelector('.alert-card.subscribers-card');
const subscribersActions = subscribersCard.querySelectorAll('.mdl-card__actions');
const subscribersAlertAction = subscribersActions[0];

const clipboardButton = document.querySelector('.copy-response-button');
const snackbarContainer = document.querySelector('#snackbar-container');

subscribersAlertAction.addEventListener('click', function alertFunction(clickEvent) {
  clickEvent.preventDefault();
  serverApi.sendBitcoinAlert('all')
    .then(function (response) {
      alert('Success!');
      displayResponse(response.status, response.data);
    })
    .catch(function (error) {
      alert('Error occured in request. Check log for more details!')
      console.error('error occured');
      console.error(error);
    });
});


const subscriberCard = document.querySelector('.subscriber-card');
const serverIdInput = subscriberCard.querySelector('#server-id');
const subscriberActions = subscriberCard.querySelectorAll('.mdl-card__actions');
const subscriberAlertAction = subscriberActions[0];

subscriberAlertAction.addEventListener('click', function (clickEvent) {
  clickEvent.preventDefault();
  const serverId = serverIdInput.value;
  if (!serverId || !serverId.trim()) {
    alert('Server ID not entered');
    return;
  }

  serverApi.sendBitcoinAlert(serverId)
    .then(function (response) {
      alert('success!');
      console.log(response);
      displayResponse(response.status, response.data);
    })
    .catch(function (error) {
      alert('Error occured!');
      console.error(error);
    });
});

const responseCard = document.querySelector('.mdl-card.response-card .mdl-card__response');
const responseCardStatus = responseCard.querySelector('.response-status');
const response = responseCard.querySelector('.response');
const rawOpenButton = document.querySelector('a.raw-open-button');

/**
 * Displays the response with the `status` and `responseData`
 */
function displayResponse (status, responseData) {
  if (status) {
    responseCardStatus.innerHTML = status;
  }

  if (responseData) {
    const stringifiedResponse = JSON.stringify(responseData, null, 2);
    response.innerHTML = stringifiedResponse;
    rawOpenButton.href = 'data:application/javascript,' + encodeURIComponent(stringifiedResponse);
  }
}

function initClipboard () {
  const clipboard = new Clipboard(clipboardButton, {
    target: () => response
  });

  clipboard.on('success', () => showCopiedToast());
  clipboard.on('error', () => showErrorToast());
}

/**
 * Shows a Copied To Clipboard Toast with an icon,
 * along with a check icon.
 */
function showCopiedToast() {
  const data = {
    message: 'Copied response to clipboard! 🎉'
  };

  snackbarContainer.MaterialSnackbar.showSnackbar(data);
}


function showErrorToast() {
  snackbarContainer.MaterialSnackbar.showSnackbar({
    message: 'Failed to copy to clipboard!'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initClipboard();
});

