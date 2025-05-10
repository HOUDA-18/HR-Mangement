import '../src/assets/sounds/Whatsapp Message Ringtone Download.mp3'
 export function playSound(relativePath = '/sounds/Whatsapp Message Ringtone Download.mp3') {
    const audio = new Audio(`../src/assets/sounds/Whatsapp Message Ringtone Download.mp3`);
    audio.preload = 'auto';
  
    audio.play().catch((err) => {
      console.warn('🔇 Sound play failed:', err.message);
    });
  }