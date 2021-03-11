import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Login from './pages/Login';
import axios from 'axios';
import Register from './pages/Register';
import Home from './pages/Home';
import { useAuthState } from './context/auth';
import { SWRConfig } from 'swr';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        throw err.response.data;
    }
};

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

    return (
        <SWRConfig value={{ fetcher, dedupingInterval: 10000 }}>
            <BrowserRouter>{routes}</BrowserRouter>
        </SWRConfig>
    );
}

export default App;
