import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CalendarView from './pages/CalendarView';
import AnalyticsView from './pages/AnalyticsView';
import UploadView from './pages/UploadView';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CalendarView />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="upload" element={<UploadView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;