import './App.css'
import SideNav from './Components/SideNav';
import { Routes, Route, NavLink } from 'react-router-dom';

import Home from './Pages/Home';
import Cameras from './Pages/Cameras';
import Map from './Pages/Map';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/cameras' element={<Cameras />}></Route>
        <Route path='/map' element={<Map />}></Route>
      </Routes>
      <SideNav />
    </div>
  )
}

export default App
