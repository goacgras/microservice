import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import axios from 'axios';
import Register from './pages/Register';
import { Home } from './pages/Home';
import { useAuthState } from './context/auth';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function App() {
    const { authenticated } = useAuthState();

    let routes = (
        <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Redirect to="/login" />
        </Switch>
    );

    if (authenticated) {
        routes = (
            <Switch>
                <Route path="/" exact component={Home} />
                <Redirect to="/" />
            </Switch>
        );
    }

    return <BrowserRouter>{routes}</BrowserRouter>;
}

export default App;
