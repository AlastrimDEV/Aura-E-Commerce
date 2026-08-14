import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'

const App = () => {
  return (
    <div>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path='/product/:id' element={<ProductDetails/>}/>
        </Routes>
        <Footer/>
        
    </div>
  )
}

export default App