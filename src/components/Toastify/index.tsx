import { type JSX } from 'react';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

export default function Toastify(): JSX.Element {
    return (
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="colored"
            transition={Bounce}
        />
    );
}
