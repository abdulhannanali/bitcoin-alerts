import { sendBitcoinAlert } from './serverApi'

const subscriberCard = document.querySelectorAll('.alert-card')[0];
const subscriberInput = subscriberCard.querySelector('#server-id');
const mdlActions = document.querySelectorAll('.mdl-card__actions');

const alertAction = mdlActions[0];

alertAction.addEventListener('click', function (clickEvent) {
  console.log('click initiated')
  clickEvent.preventDefault();
  const serverId = subscriberInput.value;
  sendBitcoinAlert(serverId)
    .then(function (response) {
      console.log('Success!');
      console.log(response);
    })
    .catch(function (error) {
      console.log('Error occured in bitcoin request');
      console.error(error);
    });
});