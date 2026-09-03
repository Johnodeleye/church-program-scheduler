// Run this to clear all service workers
console.log('🧹 Clearing all service workers...');

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('✅ Unregistered service worker:', registration);
    }
  });
}