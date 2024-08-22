// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import LeadsPage from './pages/LeadsPage';
import { LeadProvider } from './context/LeadContext';

const App = () => {
    return (
        <LeadProvider>
            <div>
                <h1>CRM App</h1>
                <LeadsPage />
            </div>
        </LeadProvider>
    );
};

export default App;
