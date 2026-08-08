export class AssetLoader {
  private readonly images: Map<string, HTMLImageElement> = new Map();
  private readonly audios: Map<string, HTMLAudioElement> = new Map();
  private readonly fonts: Map<string, FontFace> = new Map();

  public loadImage(name: string, url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        this.images.set(name, image);
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error(`Failed to load image "${name}" from ${url}.`));
      };
    });
  }

  public loadAudio(name: string, url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.addEventListener(
        "canplaythrough",
        () => {
          this.audios.set(name, audio);
          resolve(audio);
        },
        { once: true },
      );
      audio.addEventListener(
        "error",
        () => {
          reject(new Error(`Failed to load audio "${name}" from ${url}.`));
        },
        { once: true },
      );
    });
  }

  public loadFont(name: string, url: string): Promise<FontFace> {
    const font = new FontFace(name, `url(${url})`);
    return font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      this.fonts.set(name, loadedFont);
      return loadedFont;
    });
  }

  public getImage(name: string): HTMLImageElement | null {
    return this.images.get(name) ?? null;
  }

  public getAudio(name: string): HTMLAudioElement | null {
    return this.audios.get(name) ?? null;
  }

  public getFont(name: string): FontFace | null {
    return this.fonts.get(name) ?? null;
  }

  public hasImage(name: string): boolean {
    return this.images.has(name);
  }

  public hasAudio(name: string): boolean {
    return this.audios.has(name);
  }

  public hasFont(name: string): boolean {
    return this.fonts.has(name);
  }
}
