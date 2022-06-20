import prettier from 'https://unpkg.com/prettier@2.7.1/esm/standalone.mjs';
//import prettier from '../parsers/prettier';
const codeFormat = (valeur, parser, plugins) => {
  let result = prettier.format(valeur, {
    parser: parser,
    plugins: plugins,
    tabWidth: 2,
    htmlWhitespaceSensitivity: 'ignore',
  });
  return result;
};
export default codeFormat;
