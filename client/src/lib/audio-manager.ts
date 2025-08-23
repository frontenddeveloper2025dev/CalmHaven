export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private audioSources: Map<string, AudioBufferSourceNode> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initializeAudioContext(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async loadAudio(soundId: string, url: string): Promise<void> {
    if (this.audioBuffers.has(soundId)) {
      return; // Already loaded
    }

    try {
      await this.initializeAudioContext();
      
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(soundId, audioBuffer);
    } catch (error) {
      console.error(`Failed to load audio for ${soundId}:`, error);
      throw error;
    }
  }

  async playSound(soundId: string, volume: number = 1, loop: boolean = true): Promise<void> {
    await this.initializeAudioContext();
    
    const audioBuffer = this.audioBuffers.get(soundId);
    if (!audioBuffer) {
      throw new Error(`Audio buffer not found for ${soundId}`);
    }

    // Stop existing source if playing
    this.stopSound(soundId);

    // Create new source and gain node
    const source = this.audioContext!.createBufferSource();
    const gainNode = this.audioContext!.createGain();
    
    source.buffer = audioBuffer;
    source.loop = loop;
    gainNode.gain.value = volume;

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);

    // Store references
    this.audioSources.set(soundId, source);
    this.gainNodes.set(soundId, gainNode);

    // Start playing
    source.start();
  }

  stopSound(soundId: string): void {
    const source = this.audioSources.get(soundId);
    if (source) {
      try {
        source.stop();
      } catch (error) {
        // Source might already be stopped
      }
      this.audioSources.delete(soundId);
    }
    
    this.gainNodes.delete(soundId);
  }

  setVolume(soundId: string, volume: number): void {
    const gainNode = this.gainNodes.get(soundId);
    if (gainNode) {
      gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  isPlaying(soundId: string): boolean {
    return this.audioSources.has(soundId);
  }

  stopAll(): void {
    this.audioSources.forEach((_, soundId) => {
      this.stopSound(soundId);
    });
  }

  async playBell(volume: number = 0.6): Promise<void> {
    try {
      await this.loadAudio('bell', '/sounds/bell.mp3');
      
      // Create a one-shot audio source for bell sound
      await this.initializeAudioContext();
      
      const audioBuffer = this.audioBuffers.get('bell');
      if (!audioBuffer) return;

      const source = this.audioContext!.createBufferSource();
      const gainNode = this.audioContext!.createGain();
      
      source.buffer = audioBuffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      source.start();
    } catch (error) {
      console.error('Failed to play bell sound:', error);
    }
  }
}

export const audioManager = AudioManager.getInstance();
