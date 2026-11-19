import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SchedulePage from './modules/schedule/SchedulePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SchedulePage />} />
      </Routes>
    </BrowserRouter>
  );
}
