import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import SignUp_In from './Layout/SignUp_In';
import SlideDownUp from "./SlideDownUp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import LaTeXEditor from './Components/LaTeXEditor';

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={SlideDownUp}
      />

      <Routes>
        <Route path="/" element={<SignUp_In />} />
        <Route path="/home" element={<LaTeXEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
