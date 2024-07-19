import configs from '../configs';

import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Contacts from '../pages/Contacts';
import Home from '../pages/Home';

const routing = [
	{
		path: configs.routes.home,
		component: Home,
		requireAuth: true,
		layout: true,
	},
	{
		path: configs.routes.login,
		component: Login,
		requireAuth: false,
		layout: false,
	},
	{
		path: configs.routes.register,
		component: Register,
		requireAuth: false,
		layout: false,
	},
	{
		path: configs.routes.profile,
		component: Profile,
		requireAuth: true,
		layout: true,
	},
	{
		path: configs.routes.contacts,
		component: Contacts,
		requireAuth: true,
		layout: true,
	},
];

export default routing;
