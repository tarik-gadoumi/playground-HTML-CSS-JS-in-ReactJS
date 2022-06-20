// import parserBabel from 'https://unpkg.com/prettier@2.7.1/esm/parser-babel.mjs';
// import parserHtml from 'https://unpkg.com/prettier@2.7.1/esm/parser-html.mjs';
// import parserCss from 'https://unpkg.com/prettier@2.7.1/esm/parser-postcss.mjs';
import codeFormat from './utils/codeFormat';
import * as React from 'react';
import parserBabel from './parsers/parserBabel';
import parserHtml from './parsers/parserHtml';
import parserCss from './parsers/parserPostCss';
import { createPortal } from 'react-dom';

const CustomIframe = ({ children, ...props }) => {
  const [contentRef, setContentRef] = React.useState(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const elements = React.Children.map(children, (child) => {
    if (typeof child !== 'string') {
      return child;
    }
    return <div dangerouslySetInnerHTML={{ __html: child }} />;
  });
  return (
    <iframe
      id="iFrame"
      width={600}
      height={800}
      title="code mirror"
      {...props}
      ref={setContentRef}
    >
      {mountNode && createPortal(elements, mountNode)}
    </iframe>
  );
};

function App() {
  const [html, setHtml] = React.useState('');
  const [css, setCss] = React.useState('');
  const [js, setJs] = React.useState('');
  const [error, setError] = React.useState('');
  const [flag, setFlag] = React.useState(false);
  React.useEffect(() => {
    const iframe = document.getElementById('iFrame').contentWindow.document;
    const script = iframe.createElement('script');
    //! ultra mega giga important
    //* bcause each module has it's own scope
    //* so const a when set to globalThis
    //? a. saved in global env
    //? b. remove script const a still living inside global env
    //? c. that's why we setAttribute module bcause each module HAS IT'S OWNE SCOPE
    script.setAttribute('type', 'module');
    script.onload = function () {
      console.log('Success!');
    };
    script.onerror = function () {
      console.log('Error!');
    };
    if (flag) {
      script.textContent = js;
      script.onload();
    } else {
      script.onerror();
    }
    iframe.body.appendChild(script);
    return () => {
      iframe.body.removeChild(script);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flag]);

  function handleChangeHtml(e) {
    setHtml(e.target.value);
  }

  function handleChangeCss(e) {
    setCss(e.target.value);
  }
  function handleChangeJs(e) {
    setJs(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      setFlag(true);
      try {
        setHtml(codeFormat(html, 'html', [parserHtml]));
        setCss(codeFormat(css, 'css', [parserCss]));
        setJs(codeFormat(js, 'babel', [parserBabel]));
      } catch (e) {
        setError(e.message);
        setFlag(false);
      }
    }
  }
  function handleKeyPress() {
    if (!error) return;
    setError(null);
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100vh',
        }}
      >
        {' '}
        <h3>HTML/CSS/JS Playground</h3>
        <h3>Press Crtl+S to format your code !</h3>
        <ul>
          <li>
            <a href="#html"> HTML</a>
          </li>
          <li>
            <a href="#css">CSS</a>
          </li>
          <li>
            <a href="#js">JS</a>
          </li>
        </ul>
      </div>

      <div
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyPress}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <p style={{ margin: '0' }}>
              <textarea
                style={{ width: '500px', height: '250px' }}
                placeholder="Write your HTML here..."
                value={html}
                onChange={handleChangeHtml}
                id="htmlTextarea"
              ></textarea>
            </p>

            <p style={{ margin: '0' }}>
              <textarea
                style={{ width: '500px', height: '250px' }}
                placeholder="Write your CSS here..."
                value={css}
                onChange={handleChangeCss}
                id="cssTextarea"
              ></textarea>
            </p>

            <p style={{ margin: '0' }}>
              <textarea
                style={{ width: '500px', height: '250px' }}
                placeholder="Write your Javascript here..."
                value={js}
                onChange={handleChangeJs}
                id="jsTextarea"
              ></textarea>
            </p>
            <div style={{ color: 'red' }}> {error ? error : null}</div>
          </div>

          <div>
            <CustomIframe
              style={{
                border: '3px solid deeppink',
              }}
              title="A custom made iframe"
            >
              {html}
              <style>{css}</style>
            </CustomIframe>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
