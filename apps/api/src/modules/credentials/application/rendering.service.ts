import { Injectable } from '@nestjs/common';
import { ICredentialRenderer } from '@eduverse/kernel';

@Injectable()
export class RenderingService {
  private renderers = new Map<string, ICredentialRenderer>();

  constructor() {
    // Register default renderers
    this.registerRenderer(new HtmlRenderer());
    this.registerRenderer(new PdfRenderer());
    this.registerRenderer(new SvgRenderer());
    this.registerRenderer(new PngRenderer());
  }

  registerRenderer(renderer: ICredentialRenderer) {
    this.renderers.set(renderer.supportedType(), renderer);
  }

  async render(
    template: string,
    variables: Record<string, any>,
    type: 'html' | 'pdf' | 'svg' | 'png' = 'pdf'
  ): Promise<Buffer> {
    const renderer = this.renderers.get(type);
    if (!renderer) {
      throw new Error(`Renderer type not supported: ${type}`);
    }
    return renderer.render(template, variables);
  }
}

class HtmlRenderer implements ICredentialRenderer {
  supportedType(): 'html' { return 'html'; }
  async render(template: string, variables: Record<string, any>): Promise<Buffer> {
    let output = template;
    for (const [key, val] of Object.entries(variables)) {
      output = output.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
    }
    if (variables.watermark) {
      output = output.replace('</body>', `<div class="watermark">${variables.watermark}</div></body>`);
    }
    return Buffer.from(output, 'utf-8');
  }
}

class PdfRenderer implements ICredentialRenderer {
  supportedType(): 'pdf' { return 'pdf'; }
  async render(template: string, variables: Record<string, any>): Promise<Buffer> {
    let output = template;
    for (const [key, val] of Object.entries(variables)) {
      output = output.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
    }
    if (variables.watermark) {
      output = output.replace('</body>', `<div class="watermark">${variables.watermark}</div></body>`);
    }
    return Buffer.from(`%PDF-1.4 simulated stream with html content: ${output}`, 'utf-8');
  }
}

class SvgRenderer implements ICredentialRenderer {
  supportedType(): 'svg' { return 'svg'; }
  async render(template: string, variables: Record<string, any>): Promise<Buffer> {
    return Buffer.from(`<svg><text>Simulated badge: ${variables.title || ''}</text></svg>`, 'utf-8');
  }
}

class PngRenderer implements ICredentialRenderer {
  supportedType(): 'png' { return 'png'; }
  async render(template: string, variables: Record<string, any>): Promise<Buffer> {
    return Buffer.from('simulated_png_bytes', 'utf-8');
  }
}
