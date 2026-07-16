import { Route, Routes } from 'react-router-dom';

import Communication from '@/pages/communication/Communication';
import Home from '@/pages/home/Home';
import ModeCreatePage from '@/pages/home/ModeCreatePage';
import ModeEditPage from '@/pages/home/ModeEditPage';
import NotificationPage from '@/pages/home/NotificationPage';
import LiveSound from '@/pages/liveSound/LiveSound';

import Login from '@/pages/login/Login';
import DisabilityPage from '@/pages/onboarding/DisabilityPage';
import HwCompletePage from '@/pages/onboarding/HwCompletePage';
import HwConnectPage from '@/pages/onboarding/HwConnectPage';
import HwConnectingPage from '@/pages/onboarding/HwConnectingPage';
import NicknamePage from '@/pages/onboarding/NicknamePage';
import TermsPage from '@/pages/onboarding/TermsPage';
import TermsDetailPage from '@/pages/onboarding/TermsDetailPage';

import NotificationSettingPage from '@/pages/setting/NotificationSettingPage';
import ProfileEditPage from '@/pages/setting/ProfileEditPage';
import Setting from '@/pages/setting/Setting';

import ProtectedRoute from '@/routes/ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* 로그인(액세스 토큰) 없이는 아래 라우트에 접근할 수 없다. */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />

        <Route path="/onboarding/nickname" element={<NicknamePage />} />
        <Route path="/onboarding/disability" element={<DisabilityPage />} />
        <Route path="/onboarding/terms" element={<TermsPage />} />
        <Route
          path="/onboarding/terms/:agreementId"
          element={<TermsDetailPage />}
        />
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
      </Route>
    </Routes>
  );
};

export default AppRouter;
