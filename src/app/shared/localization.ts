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

Globalize.load( viCldrData, supplementalCldrData );
Globalize.loadMessages(viMessages);
Globalize.locale('vi');