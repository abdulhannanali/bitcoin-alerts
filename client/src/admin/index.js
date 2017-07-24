import serverApi from './serverApi';

import './adminStyles.css';

const subscribersCard = document.querySelector('.alert-card.subscribers-card');
const subscribersActions = subscribersCard.querySelectorAll('.mdl-card__actions');
const subscribersAlertAction = subscribersActions[0];

subscribersAlertAction.addEventListener('click', function alertFunction(clickEvent) {
  clickEvent.preventDefault();
  serverApi.sendBitcoinAlert('all')
    .then(function (response) {
      alert('Success!');
      console.log(response);
    })
    .catch(function (error) {
      alert('Error occured in request. Check log for more details!')
      console.error('error occured');
      console.error(error);
    });
});