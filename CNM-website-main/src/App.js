// App.js
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import routing from './routes';
import PrivateRoute from './routes/PrivateRoute';
import DefaultLayout from './layout/DefaultLayout';
import useListenFriend from './hooks/useListenFriend';

function App() {
	useListenFriend()
	return (
		<div className="App">
			<Router>
				<Routes>
					{routing.map((route, index) => {
						const Page = route.component;
						const Layout = route.layout ? DefaultLayout : Fragment;

						return route.requireAuth ? (
							<Route
								key={index}
								path={route.path}
								element={
									<PrivateRoute key={index}>
										<Layout>
											<Page />
										</Layout>
									</PrivateRoute>
								}
							/>
						) : (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						);
					})}
				</Routes>
			</Router>
		</div>
	);
}

export default App;
