import React, { createContext, useState } from 'react';

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadState, setUploadState] = useState(0);

  return (
    <UploadContext.Provider value={{ uploadState, setUploadState }}>
      {children}
    </UploadContext.Provider>
  );
};