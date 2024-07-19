import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
// import './output.css'


import 'react-toastify/dist/ReactToastify.css';
import AuthProvide from './context/AuthToken';
import GlobalStyle from './components/GlobalStyle';
import { SocketProvider } from './context/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<AuthProvide>
		<SocketProvider>
			<GlobalStyle />
			<App />
		</SocketProvider>
	</AuthProvide>
);
