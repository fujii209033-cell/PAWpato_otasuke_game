// Voice Guidance and Narration (Silent subtitle support only)

class SpeechManager {
  private timeoutId: any = null;
  private onStartCallback: ((text: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  public setSoundEnabled(enabled: boolean) {
    // Sound settings ignored as speech is entirely silent now
  }

  public registerCallbacks(onStart: (text: string) => void, onEnd: () => void) {
    this.onStartCallback = onStart;
    this.onEndCallback = onEnd;
  }

  public speak(text: string, subtitleText?: string) {
    this.cancel();

    const displayMessage = subtitleText || text;
    if (this.onStartCallback) {
      this.onStartCallback(displayMessage);
    }

    // Keep bubble on screen for an appropriate reading time
    const duration = Math.max(2000, displayMessage.length * 150);
    this.timeoutId = setTimeout(() => {
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    }, duration);
  }

  public cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }
}

export const speech = new SpeechManager();

