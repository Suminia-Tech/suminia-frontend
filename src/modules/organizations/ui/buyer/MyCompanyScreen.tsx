'use client';

import type { CompanySection } from '../../lib/companySections';
import MyCompanyScreen from '../common/MyCompanyScreen';

export const BuyerCompanyScreen = ({ section }: { section: CompanySection }) => (
  <MyCompanyScreen kind='buyer' section={section} />
);

export default BuyerCompanyScreen;
