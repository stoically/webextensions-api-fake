import { promises as fs } from 'fs';
import path from 'path';
import webExtensionsSchema from 'webextensions-schema';

const OUT_PREFIX = `
/* eslint-disable @typescript-eslint/class-name-casing */
/// <reference types="sinon"/>
/// <reference types="firefox-webext-browser"/>

export interface SinonEventStub {
  addListener: sinon.SinonStub;
  removeListener: sinon.SinonStub;
  hasListener: sinon.SinonStub;
}
`;

const FAKES = [
  'alarms',
  'contextualIdentities',
  'cookies',
  'i18n',
  'tabs',
  'storage.local',
];

declare global {
  interface String {
    capitalize: () => string;
  }
}

String.prototype.capitalize = function(): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

class TypesGenerator {
  private out: string[] = [OUT_PREFIX];

  async initialize(): Promise<void> {
    const schema = await webExtensionsSchema();
    const namespaces = schema.getNamespaces();

    namespaces.forEach(namespace => {
      const fake = FAKES.includes(namespace.namespace);
      const interfaceName = namespace.namespace
        .split('.')
        .map(part => part.capitalize())
        .join('');

      if (namespace.$import) {
        const importNamespace = namespaces.get(namespace.$import);
        if (!importNamespace) {
          return;
        }
        namespace = importNamespace;
      }

      // if (fake) {
      //   this.out.push(`
      //     interface ${fn.name} extends sinon.SinonStub {
      //       (): typeof browser.${namespace.namespace}.${fn.name};
      //     }
      //   `);
      // }

      this.out.push(`export interface ${interfaceName} {`);

      if (namespace.events) {
        namespace.events.forEach(event => {
          if (!event.name || event.type !== 'function') {
            return;
          }
          this.out.push(`${event.name}: SinonEventStub;`);
        });
      }

      if (namespace.functions) {
        namespace.functions.forEach(fn => {
          if (!fn.name || fn.type !== 'function') {
            return;
          }
          this.out.push(`${fn.name}: sinon.SinonStub`);
        });
      }

      this.out.push('}');
    });

    this.browserFake(namespaces);

    await fs.writeFile(path.join(__dirname, 'types.ts'), this.out.join('\n'));
  }

  browserFake(namespaces: any) {
    const browserFake: any = {};
    namespaces.forEach((namespace: any) => {
      const split = namespace.namespace.split('.');
      const name = split.map((part: string) => part.capitalize()).join('');
      const obj = { name, namespace };

      if (!browserFake[split[0]]) {
        browserFake[split[0]] = obj;
      }

      if (split[1]) {
        if (!browserFake[split[0]].nested) {
          browserFake[split[0]].nested = {};
        }
        browserFake[split[0]].nested[split[1]] = obj;
      }
    });

    this.out.push('export interface BrowserFake {');
    this.browserFakeOut(browserFake);
    this.out.push('}');
  }

  browserFakeOut(namespaces: any) {
    Object.keys(namespaces).forEach(id => {
      const obj = namespaces[id];
      if (!obj.nested) {
        this.out.push(`${id}: ${obj.name}`);
      } else {
        this.out.push(`${id}: {`);
        this.browserFakeOut(obj.nested);
        this.out.push('}');
      }
    });
  }
}

new TypesGenerator().initialize();
