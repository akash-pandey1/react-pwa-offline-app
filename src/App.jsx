import { useState } from 'react'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/header/header';
import Blogs from './pages/blogs/Blogs';
import PostForm from './pages/blogs/Addblog';
import Users from './pages/users/Users';
import AddUser from './pages/users/Adduser';

function App() {

  return (
       <Router>
     
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/add-blog" element={<PostForm/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/add-user" element={<AddUser/>} />
      </Routes>
    </Router> 
  )
}

export default App
