import { Route, Routes } from 'react-router-dom';

import Home from '@/pages/home/Home';
import ModeCreatePage from '@/pages/home/ModeCreatePage';
import ModeEditPage from '@/pages/home/ModeEditPage';
import NotificationPage from '@/pages/home/NotificationPage';
import Communication from '@/pages/communication/Communication';
import LiveSound from '@/pages/liveSound/LiveSound';
import Setting from '@/pages/setting/Setting';
import NotificationSettingPage from '@/pages/setting/NotificationSettingPage';
import ProfileEditPage from '@/pages/setting/ProfileEditPage';
import Login from '@/pages/login/Login';

import NicknamePage from '@/pages/onboarding/NicknamePage';
import DisabilityPage from '@/pages/onboarding/DisabilityPage';
import TermsPage from '@/pages/onboarding/TermsPage';
import HwConnectPage from '@/pages/onboarding/HwConnectPage';
import HwConnectingPage from '@/pages/onboarding/HwConnectingPage';
import HwCompletePage from '@/pages/onboarding/HwCompletePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/onboarding/nickname" element={<NicknamePage />} />
      <Route path="/onboarding/disability" element={<DisabilityPage />} />
      <Route path="/onboarding/terms" element={<TermsPage />} />
      <Route path="/onboarding/hardware" element={<HwConnectPage />} />
      <Route
        path="/onboarding/hardware/connecting"
        element={<HwConnectingPage />}
      />
      <Route
        path="/onboarding/hardware/complete"
        element={<HwCompletePage />}
      />

      <Route path="/modes/new" element={<ModeCreatePage />} />
      <Route path="/modes/:modeId/settings" element={<ModeEditPage />} />
      <Route path="/notifications" element={<NotificationPage />} />
      <Route path="/communication" element={<Communication />} />
      <Route path="/live-sound" element={<LiveSound />} />
      <Route path="/setting" element={<Setting />} />
      <Route
        path="/setting/notification"
        element={<NotificationSettingPage />}
      />
      <Route path="/setting/profile/edit" element={<ProfileEditPage />} />
    </Routes>
  );
};

export default AppRouter;
