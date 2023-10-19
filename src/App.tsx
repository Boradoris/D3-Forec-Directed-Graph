import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Search from './Components/Search/Search';

export default function App() {

  return (
    <div className='App'>
      <BrowserRouter>
        <Search/>
      </BrowserRouter>
      </div>
  );
}
