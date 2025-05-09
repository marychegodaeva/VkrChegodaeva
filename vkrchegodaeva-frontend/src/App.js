import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import { MainPage } from "./components/MainPage";
import { Authorization } from "./components/Authorization";
import { Registration } from "./components/Registration";
import { Category } from "./components/Category";
import { Lk } from "./components/Lk";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/lk" element={<Lk />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
