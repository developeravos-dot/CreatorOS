import { useLocalization } from "../localization/LocalizationProvider";

export function useTranslation() {

    const localization = useLocalization();

    return {

        t: localization.t,

        locale: localization.locale,

        changeLanguage: localization.changeLanguage,

    };

}
