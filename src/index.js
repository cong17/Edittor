import React from 'react';
import ReactDOM from 'react-dom/client';

import { createStore } from 'polotno/model/store';
import { unstable_setAnimationsEnabled } from 'polotno/config';
import { Auth0Provider } from '@auth0/auth0-react';
import { createProject, ProjectContext } from './project';
import { SubscriptionProvider } from './subscription-context';

import './index.css';
import App from './App';
// import './logger';
console.clear();
console.log(
  `%c Công! `,
  'background: rgba(54, 213, 67, 1); color: white; padding: 5px;'
);


unstable_setAnimationsEnabled(true);

// const store = createStore({ key: 'nFA5H9elEytDyPyvKL7T' });
const store = createStore();
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <ProjectContext.Provider value={project}>


    <SubscriptionProvider>
      <App store={store} />
    </SubscriptionProvider>

  </ProjectContext.Provider>



);
