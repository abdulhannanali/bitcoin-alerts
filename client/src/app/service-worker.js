/**
 * ServiceWorker File to be used in the application
 */
const SERVICE_WORKER_VERSION = '1.0.0';

// Global Constants related to notifications
const NOTIFICATION_BADGE = 'https://i.imgur.com/3HjDHrq.png';
const NOTIFICATION_ICON = 'https://i.imgur.com/GTQ2rGe.png';
const NOTIFICATION_IMAGE = 'https://i.imgur.com/NR4D7aS.png';
const DEFAULT_NOTIFICATION_LANG = 'en-US';

const urlLinks = {
  homepage: '/',
  admin: '/admin',
  live: 'https://www.coindesk.com/price/',
  api: 'https://www.coindesk.com/api/'
};

const POWERED_BY_COINDESK = {
    action: 'goto_api',
    title: 'Bitcoin Alerts powered by CoinDesk',
    icon: 'https://i.imgur.com/jQpadil.png'
};

self.addEventListener('install', function (installEvent) {
    console.log('[ServiceWorker] Install');
    console.log('[ServiceWorker] Nothing to install here move on');
});

self.addEventListener('activate', function (activateEvent) {
    console.log('[ServiceWorker] Activated!');
});

/**
 * Triggered when a Push Message is sent to the client
 * Notifications here are explicit along with their types
 */
self.addEventListener('push', function (pushEvent) {
    console.log('PushEvent');
    console.log('Notification is going to be shown here');
    let promiseChain = Promise.resolve();
        
    const dataJSON = pushEvent.data.json();
    const pushType = dataJSON.type;
    switch (pushType) {
        case 'welcome':
            // Show a Welcome notification to make user aware!
            promiseChain = self.registration.showNotification('Subscribed to Bitcoin Alerts 🎉', {
                icon: NOTIFICATION_ICON,
                badge: NOTIFICATION_BADGE,
                body: 'This is how you are going to receive notifications from us in future',
                tag: pushType,
                vibrate: true,
                actions: [
                    {
                        title: 'Yayy! Subscription successful!',
                        action: 'goto_homepage',
                        icon: 'https://www.emojibase.com/resources/img/emojis/hangouts/1f389.png'
                    },
                    POWERED_BY_COINDESK,
                ],
            });
            break;
        case 'bitcoin_rate':
            const bitcoinData = dataJSON.price;

            promiseChain = self.registration.showNotification('Bitcoin Rate Alert', {
                body: (
                    '1 BTC ⇄ ' + '$' + bitcoinData.rate + '\n'
                ),
                lang: DEFAULT_NOTIFICATION_LANG,
                icon: NOTIFICATION_ICON,
                badge: NOTIFICATION_BADGE,
                tag: pushType,
                actions: [
                    { 
                      title: 'Live CoinDesk Bitcoin Prices',
                      icon: POWERED_BY_COINDESK.icon,
                      action: 'goto_live'
                    },
                    POWERED_BY_COINDESK
                ]
            });
            break;
        default:
            break;
    }

    pushEvent.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function (notificationClickEvent) {
  const notification = notificationClickEvent.notification;
  const action = notificationClickEvent.action;
  let promiseChain = Promise.resolve();

  // No point, in keeping the notification open anymore!
  notification.close();
  
  // Perform operations based on action
  if (action) {
    switch (action) {
      case 'goto_homepage':
        promiseChain = self.clients.openWindow('/');
        break;
      case 'goto_live':
        promiseChain = self.clients.openWindow(urlLinks['live']);
        break;
      case 'goto_api':
        promiseChain = self.clients.openWindow(urlLinks['api']);
        break;
      default:
        break;
    }
  }
  else if (!action && notification.tag) {
    switch (notification.tag) {
      case 'welcome':
        // Symbolic representation do nothing in case of welcome
        break;
      case 'bitcoin_rate':
        self.clients.openWindow(urlLinks['live']);
      default:
        break;
    }
  }

  notificationClickEvent.waitUntil(promiseChain);
});

self.addEventListener('pushsubscriptionchange', function (subscriptionEvent) {
  // Perform some logic to resubscribe to the pushManager 
  // for notifications
  console.log('Push Subscription has invalidated');
  console.log('No more push events will be file untill it is revalidated');
});
