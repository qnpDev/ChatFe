import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@szhsin/react-menu/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import { UserProvider } from './components/contexts/UserContext'
import { IoProvider } from './components/contexts/IoContext'
import Home from './components/pages/home';
import Login from './components/pages/auth/Login';
import Signup from './components/pages/auth/Signup';
import About from './components/About';

function App() {
  return (
    <>
      <UserProvider>
        <IoProvider>
          <Router>
            <Routes>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/' element={<Home/>}/>
              <Route path='*' element={<Home/>}/>
            </Routes>
          </Router>
        </IoProvider>
      </UserProvider>
    </>
  );
}

export default App;
