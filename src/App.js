import './App.css';
import './components/cloudHeader/CloudHeader.css';
import './components/cloudBody/CloudBody.css';
import './components/headerMenu/HeaderMenu.css';
import './components/uploadFileForm/UploadFileForm.css';
import './components/shareWindow/ShareWindow.css';
import './components/adminPanel/AdminPanel.css';
import RegisterForm from './components/registerForm/RegisterForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/homepage/HomePage';
import CloudHeader from './components/cloudHeader/CloudHeader';
import CloudBody from './components/cloudBody/CloudBody';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <CloudHeader></CloudHeader>
      <Routes>
        <Route path={'/'} element={<HomePage />} />
          <Route path='/singup' element={<RegisterForm />} />
          <Route path='/store' element={<CloudBody />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
