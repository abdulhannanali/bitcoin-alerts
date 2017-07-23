/**
 * Asking important questions that needs answer
 * - What is the design pattern we can use, that let's us make reuse of the elements 
 *   in the applications so we can keep our memory footprint low and save time that's spent
 *   in looking up for dom elements each time?
 */

export const notSupportedCard = document.querySelector('.not-supported');
const supportStatus = notSupportedCard.querySelector('.support-status');
const swSupport = supportStatus.querySelector('.service-worker .value');
const pushSupport = supportStatus.querySelector('.push-api .value');

export default function updateSupportCard(serviceWorker, pushManager) {
  if (serviceWorker && pushManager) {
    notSupportedCard.style.display = 'none';
  } else {
    swSupport.textContent = serviceWorker ? 'Supported' : 'Not Supported';
    pushSupport.textContent = pushManager ? 'Supported' : 'Not Supported';
    notSupportedCard.style.display = 'block';
  }
}
