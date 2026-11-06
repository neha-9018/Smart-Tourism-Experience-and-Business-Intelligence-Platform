import React from 'react';

export default function PageLayout({ title, children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {title && (
        <h1 className="text-3xl font-bold text-center text-primary mb-8 tracking-tight">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
