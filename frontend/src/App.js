import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import UserList from './components/UserList';
import RandomData from './components/RandomData';
import BuggyComponent from './components/BuggyComponent';
import FancyWidget from './components/FancyWidget';
import './App.css';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';

function App({ flags, ldClient /*, ...otherProps */ }) {
  return (
    <div className="app">
      

      <header className="app-header">
        <h1>React Flask Sample Application</h1>
        <p>Demonstrating Error Boundaries in React</p>
      </header>

      <main className="app-main">
        {/* Each component is wrapped in its own ErrorBoundary */}
        {flags.fancyWidget && (
        <ErrorBoundary fallbackMessage="Failed to load the fancy widget component.">
          <FancyWidget />
        </ErrorBoundary>
        )}

        <ErrorBoundary fallbackMessage="Failed to load the user list component.">
          <UserList />
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Failed to load the random data component.">
          <RandomData />
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="This component encountered an error. This is expected behavior for testing.">
          <BuggyComponent />
        </ErrorBoundary>
        
      </main>

      <footer className="app-footer">
        <p>Backend API running on http://localhost:5001</p>
      </footer>
      <LaunchDarklyToolbar devServerUrl="http://localhost:8765" />
    </div>
  );
}

export default withLDConsumer()(App);