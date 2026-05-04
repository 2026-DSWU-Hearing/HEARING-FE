import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/home/Home';
import Communication from '@/pages/communication/Communication';
import LiveSound from '@/pages/liveSound/LiveSound';
import Setting from '@/pages/setting/Setting';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/communication" element={<Communication />} />
      <Route path="/live-sound" element={<LiveSound />} />
      <Route path="/setting" element={<Setting />} />
    </Routes>
  );
};

export default AppRouter;
