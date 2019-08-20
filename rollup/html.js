/* eslint-env node */
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

function getInputValues(input) {
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') return [input];
  return Object.values(input);
}

export default function htmlPlugin({
  template,
  fileName = 'index.html',
  position = 'body',
  onerror = ''
} = {}) {
  const templatePath = path.resolve(template);
  let inputs;

  return {
    name: 'html',
    buildStart({ input }) {
      // only user-defined entry points
      inputs = getInputValues(input).map(p => path.resolve(p));

      this.addWatchFile(templatePath);
    },
    async generateBundle(_, bundle) {
      const files = Object.values(bundle);
      const html = await readFile(templatePath, { encoding: 'utf8' });

      const css = files.filter(({ fileName }) => fileName.endsWith('.css'));
      const js = files.filter(({ isEntry, facadeModuleId }) => {
        return isEntry && inputs.includes(facadeModuleId);
      });

      const newHTML = html.replace(`</${position}>`, [
        ...css.map(({ fileName: name }) => (
          `<link rel="stylesheet" href="/${name}" onerror="${onerror}">`
        )),
        ...js.map(({ fileName: name }) => (
          `<script type="module" src="/${name}" onerror="${onerror}"></script>`
        )),
        `</${position}>`
      ].join('\n'));

      this.emitFile({
        type: 'asset',
        fileName,
        source: newHTML
      });
    }
  }
}
