import React, { useState } from 'react';
import './BuggyComponent.css';

const BuggyComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    // This will cause a rendering error that ErrorBoundary can catch
    throw new Error('Intentional error for testing! Nothing to see here, move along...');
  }

  return (
    <div className="buggy-component">
      <h2>Error Testing Component</h2>
      <p>
        Click the button below to trigger an intentional error.
        The ErrorBoundary will catch it and display a fallback UI.
      </p>
      <button
        onClick={() => setShouldThrow(true)}
        className="trigger-error-button"
      >
        Trigger Error
      </button>
    </div>
  );
};

export default BuggyComponent;
