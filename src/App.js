import './App.css';
import RegisterForm from './components/registerForm/RegisterForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import CloudHomePage from './components/cloudHomePage/CloudHomePage';
import CloudHeader from './components/cloudHeader/CloudHeader';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <CloudHeader></CloudHeader>
      <Routes>
        <Route path={'/'} element={<HomePage />} />
          <Route path='/singup' element={<RegisterForm />} />
          <Route path='/store' element={<CloudHomePage />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
