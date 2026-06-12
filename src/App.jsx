import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import SignIn from './pages/SignIn/SignIn';
import Browse from './pages/Browse/Browse';
import Detail from './pages/Detail/Detail';
import Search from './pages/Search/Search';
import MyList from './pages/MyList/MyList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route 
        path="/browse" 
        element={
          <ProtectedRoute>
            <Browse />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/movie/:id" 
        element={
          <ProtectedRoute>
            <Detail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tv/:id" 
        element={
          <ProtectedRoute>
            <Detail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mylist" 
        element={
          <ProtectedRoute>
            <MyList />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
