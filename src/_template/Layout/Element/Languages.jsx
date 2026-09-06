import { useTranslation } from "next-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "react-feather";

const SelectLanguages = () => {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const langData = [
    { LanuageName: "English", lang: "en" },
    { LanuageName: "Franch", lang: "fr" },
    { LanuageName: "Spanish", lang: "es" },
  ];
  const changeLanguage = (lng) => i18n.changeLanguage(lng.lang);

  return (
    <>
      <li className="onhover-dropdown small-dropdown">
        <div className="cart-media">
          <a href="#javascript">
            <Globe />
          </a>
        </div>
        <div className="onhover-div profile-dropdown">
          <ul>
            {langData.map((data, i) => (
              <li key={i}>
                <Link href={pathname} locale={data.lang} className="d-block" onClick={() => changeLanguage(data)}>
                  {data.LanuageName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </>
  );
};

export default SelectLanguages;
