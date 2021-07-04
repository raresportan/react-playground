import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import {javascript} from "@codemirror/lang-javascript"

const jscode=`
// Note:
// 1. Use React.something instead of importing something
// 2. Container id is 'app'


function Counter({initialCount}) {
  const [count, setCount] = React.useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}

ReactDOM.render(
  <Counter initialCount={1} />,
  document.getElementById('app')
);
`;
const myTheme = EditorView.baseTheme({
  "&.cm-editor": {
    fontSize: '16px',
  },
  ".cm-scroller": {
    fontFamily:'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace'
  },
})

let timer;

const evaluateCode = (code) => {
  console.clear();
  try{
    const sandbox = document.getElementById('sandbox');
    sandbox.contentWindow.postMessage({ code }, '*');
  }
  catch(err) {
    console.error(err);
  }
}

let index = 0;

const editor = new EditorView({
  state: EditorState.create({
    extensions: [
      basicSetup, 
      javascript(),
      myTheme,
      EditorView.updateListener.of((v)=> {
        if(v.docChanged) {
          if(timer) clearTimeout(timer);
          timer = setTimeout(() => {
            evaluateCode(editor.state.doc.toString())
          }, 500 );
        }
      })
    ],    
    doc: jscode
  }),
  parent: document.getElementById('editor')
})

// first time evaluation
window.addEventListener('DOMContentLoaded', (event) => {
  setTimeout( () => {
   evaluateCode(editor.state.doc.toString())
  }, 1000);
})