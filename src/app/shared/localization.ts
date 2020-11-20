/* devextreme */
// devextreme globalize integration
import 'devextreme/localization/globalize/number';
import 'devextreme/localization/globalize/date';
import 'devextreme/localization/globalize/currency';
import 'devextreme/localization/globalize/message';

// devextreme messages (en messages already included)
import viMessages from 'devextreme/localization/messages/vi.json';

// cldr data
import viCldrData from 'devextreme-cldr-data/vi.json';
import supplementalCldrData from 'devextreme-cldr-data/supplemental.json';

import Globalize from 'globalize';

// set lại định dạng của number box vi
viCldrData.main.vi.numbers["symbols-numberSystem-latn"].decimal = ".";
viCldrData.main.vi.numbers["symbols-numberSystem-latn"].group = ",";

// thiết lập global
Globalize.load( viCldrData, supplementalCldrData );
Globalize.loadMessages(viMessages);
Globalize.locale('vi');

/* Stimulsoft Report */
declare var Stimulsoft: any;

Stimulsoft.Base.StiLicense.loadFromFile("assets/reports/license/license.key");
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("assets/reports/localization/vi.xml", true);

import { setTheme } from 'ngx-bootstrap/utils';
setTheme('bs4'); // 'bs3' or 'bs4'