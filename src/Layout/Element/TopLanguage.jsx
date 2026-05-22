import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Language } from '@/Constant';
import { useTranslation } from 'next-i18next';

const TopLanguage = () => {
  const router = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const langData = [
    { LanuageName: "English", lang: "en" },
    { LanuageName: "Franch", lang: "fr" },
    { LanuageName: "Spanish", lang: "es" },
  ];
  const changeLanguage = (lng) => i18n.changeLanguage(lng.lang);
  return (
    <li>
      <Dropdown isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} color='primary' className='top-header-dropdown'>
        <DropdownToggle>
          <span>{Language} </span>
          <i className='fas fa-chevron-down'></i>
        </DropdownToggle>
        <DropdownMenu className='dropdown-menu-end' aria-labelledby='dropdownMenuLink'>
          {langData.map((data, i) => (
            <DropdownItem key={i}>
              <Link href={router} locale={data.lang} className='d-block' onClick={() => changeLanguage(data)}>
                {data.LanuageName}
              </Link>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </li>
  );
};

export default TopLanguage;
