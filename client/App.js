import './App.css';
import Login from './MyComponents/login'
import Header from './MyComponents/header'
import Nav from './MyComponents/nav'
import About from './MyComponents/about'
import Dashboard from './MyComponents/dashboard'
import Copyright from './MyComponents/copyright';
import View from './MyComponents/view';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route path='/' element={<Header />} />
          <Route path='/about' element={<About />} />
          <Route path='/view' element={<View />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard/:officerName' element={<Dashboard />} />
        </Routes>
        <Copyright />
      </Router>
    </>
  );
}
export default App;
