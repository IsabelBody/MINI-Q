import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Routes.tsx';
import { AuthProvider } from './context/AuthContext'; 
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
<AuthProvider> 
        <RouterProvider router={router} />
    </AuthProvider>
);
