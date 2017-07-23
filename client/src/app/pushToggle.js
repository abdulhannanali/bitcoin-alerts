/**
 * pushToggle.js
 * 
 * Deals with the toggle used to Toggle Subscription from On and Off
 * It also Disables the toggle in case it's not supported with appropriate error messages
 * 
 * Displaying the status text within this card, also makes sure that this 
 * card is calibrated enough with the application state, which we want to make sure
 * is always the case.
 * 
 * This card is going to rely on running from the beginning and thus makes 
 * no assumption of having subscription state, being stored anywhere
 */

const card = document.querySelector('.subscription-toggle');
const subscriptionStatus = card.querySelector('.subscription-status');
const subscriptionSwitch = card.querySelector('input');
const subscriptionLabel = subscriptionSwitch.parentNode;

const NOT_SUPPORTED_TEXT = 'Relevant APIs are not supported';
const ENABLED_ON_TEXT = 'On';
const ENABLED_OFF_TEXT = 'Off';

function changeSwitch(on) {
  on = !!on;
  updateStatus(on ? ENABLED_ON_TEXT : ENABLED_OFF_TEXT);
  subscriptionSwitch.checked = on;
  on ? subscriptionLabel.classList.add('is-checked')
    : subscriptionLabel.classList.remove('is-checked');
}

/**
 * Enable or disable the Material Design Switch based on the
 * enable parameter passed
 */
function enableSwitch(enable) {
  // Explicit conversion to type Boolean
  const enabledBool = !!enable;
  subscriptionSwitch.disabled = !enabledBool;
  
  if (!enabledBool) {
    subscriptionLabel.classList.remove('is-checked');
    subscriptionLabel.classList.add('is-disabled');
    updateStatus(NOT_SUPPORTED_TEXT);
    subscriptionSwitch.checked = false;
  } else {
    updateStatus(subscriptionSwitch.checked ? ENABLED_ON_TEXT : ENABLED_OFF_TEXT);
    subscriptionLabel.classList.remove('is-disabled');
  }
}

/**
 * In order to wait for the operation to complete
 * before anyother operation is started
 * `waitToggle` disables the toggle so it can't be used
 */
function waitToggle() {
  subscriptionSwitch.disabled = true;
  subscriptionLabel.classList.add('is-disabled');
}

/**
 * Updates the Statu of the text in the card
 */
function updateStatus(status) {
  subscriptionStatus.textContent = status;
}

/**
 * Updates the Switch Status and enables or disabled according
 * to the parameters
 */
function updateSwitch(pushSubscription) {
  enableSwitch(true);
  changeSwitch(!!pushSubscription);
}

export { updateSwitch, enableSwitch, subscriptionSwitch, waitToggle };