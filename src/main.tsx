import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { handleGoogleRedirect } from './lib/googleAuth';
import { initializeCleanJourneyWorkflow } from './lib/data/adapters/local/localStore';
import { initializeSqliteDatabase } from './lib/sqliteDb';

async function bootstrap() {
  await initializeSqliteDatabase();
  // SQLite hydrates old localStorage asynchronously. Clean journeys only AFTER hydration, before mounting React.
  initializeCleanJourneyWorkflow();
  handleGoogleRedirect();

  const container = document.getElementById('root');
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
