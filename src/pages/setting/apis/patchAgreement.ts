import type { UpdateAgreementRequestTypes } from '@/pages/setting/types/usersTypes';
import type { UserTypes } from '@/shared/types/userTypes';
import http from '@/shared/apis/axios';


export const patchAgreement = async (
  agreementData: UpdateAgreementRequestTypes,
): Promise<UserTypes> => {
  const response = await http.patch<UserTypes>(
    '/users/me/agreement',
    agreementData,
  );

  return response.data;
};
