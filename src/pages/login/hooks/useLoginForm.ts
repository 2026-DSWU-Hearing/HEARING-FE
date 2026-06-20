import { useState } from 'react';

import { INITIAL_LOGIN_FORM } from '../constants/loginConstants';
import type { LoginFormTypes } from '../types/loginTypes';

export const useLoginForm = () => {
  const [loginForm, setLoginForm] =
    useState<LoginFormTypes>(INITIAL_LOGIN_FORM);

  const isLoginButtonDisabled =
    loginForm.email.trim() === '' || loginForm.password.trim() === '';

  const handleLoginFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setLoginForm((previousLoginForm) => ({
      ...previousLoginForm,
      [name]: value,
    }));
  };

  return {
    loginForm,
    isLoginButtonDisabled,
    handleLoginFormChange,
  };
};
