import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'

// Set the viewport meta tag
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0';
document.head.appendChild(meta);

createRoot(document.getElementById('root')).render(<App />)
