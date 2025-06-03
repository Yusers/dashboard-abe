import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../../core/layouts';
import { NotFoundPage } from '../../pages/NotFoundPage';
import Members from '../../pages/Dashboard/components/Members/Members';
import Dashboard from '../../pages/Dashboard';
import Home from '../../pages/Home';

const AppRouting: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='dashboard' element={<Dashboard />}>
            <Route path='members' element={<Members />} />
          </Route>
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouting;
