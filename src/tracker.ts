import mixpanel from 'mixpanel-browser';

let isTrackingAllowed = false;

export function startTracking() {
    mixpanel.init('e25d2f8346d1c0731fbb322d6f4c9d94');
    isTrackingAllowed = true;
}

export function stopTracking() {
    mixpanel.reset();
    isTrackingAllowed = false;
}

export function trackEvent(eventName: string, data?: Record<string, any>) {
    if (!isTrackingAllowed) return console.warn(`Tracking is disabled. Event: ${eventName}`);
    mixpanel.track(eventName, data);
}