import md5 from 'md5';
import * as ProviderTypes from '../constants';

export const filterExchangeUser = (jsonObj) => {
    return {
      personId: md5(jsonObj.username),
      originalId: jsonObj.username,
      email: jsonObj.username,
      providerType: ProviderTypes.EXCHANGE,
      password: jsonObj.password,
    };
  };
  