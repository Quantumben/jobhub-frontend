import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'

import App from './App'
import { store } from './app/store'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)


//<StrictMode> Helps React detect certain development problems.
// <Provider> This comes from:react-redux -- Make our Redux store available to everything inside this application.
// <BrowserRouter> makes routing possible.
