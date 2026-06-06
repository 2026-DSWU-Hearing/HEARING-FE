import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/home/Home';
import Login from '@/pages/auth/Login';
import ModeCreatePage from '@/pages/home/ModeCreatePage';
import ModeEditPage from '@/pages/home/ModeEditPage';
import Communication from '@/pages/communication/Communication';
import LiveSound from '@/pages/liveSound/LiveSound';
import Setting from '@/pages/setting/Setting';
import NotFound from '@/pages/notFound/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/modes/new" element={<ModeCreatePage />} />
      <Route path="/modes/:modeId/settings" element={<ModeEditPage />} />
      <Route path="/communication" element={<Communication />} />
      <Route path="/live-sound" element={<LiveSound />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
