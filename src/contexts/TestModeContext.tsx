import React from "react";

// Test Mode — a demo/QA switch that lives in the GLOBAL header (beside Refresh) and is
// consumed deep in the job detail view (Fill/Clear links + cascade demo + source-ref badges).
// Default OFF on every load, NOT persisted — a real job opened later always starts OFF so the
// test links can't accidentally clobber real data.

interface TestModeContextValue {
  testMode: boolean;
  setTestMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const TestModeContext = React.createContext<TestModeContextValue>({
  testMode: false,
  setTestMode: () => {},
});

export const TestModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testMode, setTestMode] = React.useState(false); // default OFF, not persisted
  return (
    <TestModeContext.Provider value={{ testMode, setTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => React.useContext(TestModeContext);
