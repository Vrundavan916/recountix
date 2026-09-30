(function () {
  "use strict";

  const STORE = "rx_lang";
  const LANGS = { en: "EN", hi: "हिं", gu: "ગુજ" };
  const dict = {
  "hi": {
    "Dashboard": "डैशबोर्ड",
    "Customers": "ग्राहक",
    "Recovery": "रिकवरी",
    "Reports": "रिपोर्ट्स",
    "Settings": "सेटिंग्स",
    "Offline Backup": "ऑफलाइन बैकअप",
    "Super Dashboard": "सुपर डैशबोर्ड",
    "Company Management": "कंपनी मैनेजमेंट",
    "Subscription": "सब्सक्रिप्शन",
    "Ad Manager": "ऐड मैनेजर",
    "Activity Log": "गतिविधि लॉग",
    "Field Tracking": "फील्ड ट्रैकिंग",
    "Promise to Pay": "भुगतान वादा",
    "Escalations": "एस्केलेशन",
    "Login": "लॉगिन",
    "Logout": "लॉगआउट",
    "Super Admin": "सुपर एडमिन",
    "Admin": "एडमिन",
    "Staff": "स्टाफ",
    "Customer Portal": "ग्राहक पोर्टल",
    "Welcome back": "वापसी पर स्वागत है",
    "Sign in to continue to your recovery workspace.": "रिकवरी वर्कस्पेस में जाने के लिए साइन इन करें।",
    "Username": "यूजरनेम",
    "Password": "पासवर्ड",
    "Remember me": "मुझे याद रखें",
    "Forgot password?": "पासवर्ड भूल गए?",
    "Sign In": "साइन इन",
    "Back to sign in": "साइन इन पर वापस",
    "Reset password": "पासवर्ड रीसेट",
    "Recovery Email": "रिकवरी ईमेल",
    "New Password": "नया पासवर्ड",
    "Confirm Password": "पासवर्ड पुष्टि",
    "Business Code": "बिजनेस कोड",
    "Registered Mobile Number": "रजिस्टर्ड मोबाइल नंबर",
    "Portal PIN": "पोर्टल PIN",
    "Check Status": "स्टेटस देखें",
    "Secure encrypted access": "सुरक्षित एन्क्रिप्टेड एक्सेस",
    "Bill Amount": "बिल राशि",
    "Paid Amount": "भुगतान राशि",
    "Pending Amount": "बाकी राशि",
    "Last Payment": "आखिरी भुगतान",
    "Recent Payments": "हाल के भुगतान",
    "Status": "स्थिति",
    "Customer Name": "ग्राहक नाम",
    "Mobile": "मोबाइल",
    "Date": "तारीख",
    "Amount": "राशि",
    "Receipt No": "रसीद नंबर",
    "Payment Mode": "भुगतान तरीका",
    "Today's Recovery": "आज की रिकवरी",
    "Today’s Recovery": "आज की रिकवरी",
    "Today's Collection": "आज का कलेक्शन",
    "Today’s Collection": "आज का कलेक्शन",
    "Total Recovery": "कुल रिकवरी",
    "Overall Collection": "कुल कलेक्शन",
    "Total Outstanding": "कुल बाकी",
    "Total Transactions": "कुल लेनदेन",
    "Recovery Entries": "रिकवरी एंट्री",
    "Total Businesses": "कुल बिजनेस",
    "Active Businesses": "एक्टिव बिजनेस",
    "Inactive Businesses": "इनएक्टिव बिजनेस",
    "Total Customers": "कुल ग्राहक",
    "Registered Businesses": "रजिस्टर्ड बिजनेस",
    "Currently Active": "अभी एक्टिव",
    "Disabled / Suspended": "बंद / सस्पेंड",
    "License needs renewal": "लाइसेंस रिन्यू चाहिए",
    "Across all business": "सभी बिजनेस में",
    "Across all business records": "सभी बिजनेस रिकॉर्ड में",
    "Add Customer": "ग्राहक जोड़ें",
    "New Customer": "नया ग्राहक",
    "Father Name": "पिता का नाम",
    "Product Name": "प्रोडक्ट नाम",
    "Alternate Mobile": "वैकल्पिक मोबाइल",
    "Village": "गांव",
    "Taluka": "तालुका",
    "District": "जिला",
    "Address": "पता",
    "Aadhaar": "आधार",
    "PAN": "PAN",
    "Down Payment": "डाउन पेमेंट",
    "Outstanding": "बाकी",
    "Executive": "एक्जीक्यूटिव",
    "Follow-up Date": "फॉलो-अप तारीख",
    "Payment Due Date": "भुगतान देय तारीख",
    "Priority": "प्राथमिकता",
    "Remarks": "टिप्पणी",
    "Auto Reminder": "ऑटो रिमाइंडर",
    "Reminder Interval": "रिमाइंडर अंतराल",
    "Save Customer": "ग्राहक सेव करें",
    "Update Customer": "ग्राहक अपडेट करें",
    "Search": "खोजें",
    "Filter": "फिल्टर",
    "Aging": "एजिंग",
    "Due / Follow-up": "देय / फॉलो-अप",
    "Action / WhatsApp": "एक्शन / WhatsApp",
    "View": "देखें",
    "Edit": "एडिट",
    "Delete": "डिलीट",
    "WhatsApp Due": "WhatsApp बकाया",
    "UPI / Payment link": "UPI / पेमेंट लिंक",
    "Legal / reminder letter": "लीगल / रिमाइंडर पत्र",
    "Set Customer Portal PIN": "ग्राहक पोर्टल PIN सेट करें",
    "Add Recovery Entry": "रिकवरी एंट्री जोड़ें",
    "Record Customer Payment": "ग्राहक भुगतान रिकॉर्ड करें",
    "Select Customer": "ग्राहक चुनें",
    "Select customer": "ग्राहक चुनें",
    "Recovery Date": "रिकवरी तारीख",
    "Collected By": "कलेक्ट किया",
    "Cash": "कैश",
    "UPI": "UPI",
    "Bank Transfer": "बैंक ट्रांसफर",
    "Cheque": "चेक",
    "Recovery History": "रिकवरी इतिहास",
    "Recovery Summary": "रिकवरी सारांश",
    "Monthly Collection": "मासिक कलेक्शन",
    "Pending dues — recover up to this amount": "बाकी देय — इस राशि तक रिकवर करें",
    "Select a customer to see pending amount.": "बाकी राशि देखने के लिए ग्राहक चुनें।",
    "Report": "रिपोर्ट",
    "Export CSV": "CSV एक्सपोर्ट",
    "Print": "प्रिंट",
    "From Date": "शुरुआत तारीख",
    "To Date": "अंत तारीख",
    "Generate Report": "रिपोर्ट बनाएं",
    "Total Collection": "कुल कलेक्शन",
    "Customer Report": "ग्राहक रिपोर्ट",
    "Recovery Report": "रिकवरी रिपोर्ट",
    "Manage Login Credentials": "लॉगिन क्रेडेंशियल मैनेज करें",
    "Current Password": "वर्तमान पासवर्ड",
    "System Role": "सिस्टम रोल",
    "Role": "रोल",
    "User Management": "यूजर मैनेजमेंट",
    "Add, remove or reset staff login passwords.": "स्टाफ लॉगिन पासवर्ड जोड़ें, हटाएं या रीसेट करें।",
    "New Username": "नया यूजरनेम",
    "Add User": "यूजर जोड़ें",
    "Modify / Rights": "बदलाव / अधिकार",
    "Remove": "हटाएं",
    "Sales / Recovery Executives": "सेल्स / रिकवरी एक्जीक्यूटिव",
    "Executive name": "एक्जीक्यूटिव नाम",
    "Add Executive": "एक्जीक्यूटिव जोड़ें",
    "Data Management": "डेटा मैनेजमेंट",
    "Backup & Restore Project Data": "प्रोजेक्ट डेटा बैकअप और रिस्टोर",
    "Save Settings": "सेटिंग्स सेव करें",
    "Reset Page": "पेज रीसेट",
    "Support Information": "सपोर्ट जानकारी",
    "Version": "वर्जन",
    "Active": "एक्टिव",
    "Running Successfully": "सफलतापूर्वक चल रहा है",
    "Licensed Copy": "लाइसेंस्ड कॉपी",
    "Create backup": "बैकअप बनाएं",
    "Restore backup": "बैकअप रिस्टोर",
    "Download password": "डाउनलोड पासवर्ड",
    "Backup password": "बैकअप पासवर्ड",
    "Sync Backup Now": "अभी बैकअप सिंक करें",
    "Validate & Restore": "जांचें और रिस्टोर करें",
    "Encrypted backup file": "एन्क्रिप्टेड बैकअप फाइल",
    "Offline backups are encrypted and stored only on this device.": "ऑफलाइन बैकअप एन्क्रिप्ट होकर सिर्फ इस डिवाइस पर सेव रहता है।",
    "Website Maintenance Mode": "वेबसाइट मेंटेनेंस मोड",
    "Website ON": "वेबसाइट चालू",
    "Save Message": "मैसेज सेव करें",
    "Business-wise Overview": "बिजनेस अनुसार ओवरव्यू",
    "Manage Companies": "कंपनी मैनेज करें",
    "Campaign title": "कैंपेन शीर्षक",
    "Create Campaign": "कैंपेन बनाएं",
    "Campaigns": "कैंपेन",
    "Target": "टारगेट",
    "Schedule": "शेड्यूल",
    "Clicks": "क्लिक्स",
    "Renew": "रिन्यू",
    "Plan": "प्लान",
    "License Expiry": "लाइसेंस समाप्ति",
    "Inactive": "इनएक्टिव",
    "Save": "सेव",
    "Cancel": "रद्द",
    "Back": "वापस",
    "Submit": "सबमिट",
    "Close": "बंद",
    "Add": "जोड़ें",
    "Update": "अपडेट",
    "Create": "बनाएं",
    "Select": "चुनें",
    "Loading": "लोड हो रहा है",
    "No data": "डेटा नहीं",
    "No customers": "ग्राहक नहीं",
    "Access Denied": "एक्सेस अस्वीकार",
    "Full administrator access": "पूर्ण एडमिन एक्सेस",
    "Account active": "खाता एक्टिव",
    "View details": "विवरण देखें",
    "Save failed:": "सेव फेल:",
    "Failed:": "फेल:",
    "Delete failed:": "डिलीट फेल:"
  },
  "gu": {
    "Dashboard": "ડેશબોર્ડ",
    "Customers": "ગ્રાહકો",
    "Recovery": "રિકવરી",
    "Reports": "રિપોર્ટ્સ",
    "Settings": "સેટિંગ્સ",
    "Offline Backup": "ઓફલાઇન બેકઅપ",
    "Super Dashboard": "સુપર ડેશબોર્ડ",
    "Company Management": "કંપની મેનેજમેન્ટ",
    "Subscription": "સબ્સ્ક્રિપ્શન",
    "Ad Manager": "એડ મેનેજર",
    "Activity Log": "એક્ટિવિટી લોગ",
    "Field Tracking": "ફિલ્ડ ટ્રેકિંગ",
    "Promise to Pay": "ચુકવણી વચન",
    "Escalations": "એસ્કેલેશન",
    "Login": "લોગિન",
    "Logout": "લોગઆઉટ",
    "Super Admin": "સુપર એડમિન",
    "Admin": "એડમિન",
    "Staff": "સ્ટાફ",
    "Customer Portal": "ગ્રાહક પોર્ટલ",
    "Welcome back": "ફરી સ્વાગત છે",
    "Sign in to continue to your recovery workspace.": "રિકવરી વર્કસ્પેસમાં જવા માટે સાઇન ઇન કરો.",
    "Username": "યૂઝરનેમ",
    "Password": "પાસવર્ડ",
    "Remember me": "મને યાદ રાખો",
    "Forgot password?": "પાસવર્ડ ભૂલી ગયા?",
    "Sign In": "સાઇન ઇન",
    "Back to sign in": "સાઇન ઇન પર પાછા",
    "Reset password": "પાસવર્ડ રીસેટ",
    "Recovery Email": "રિકવરી ઇમેઇલ",
    "New Password": "નવો પાસવર્ડ",
    "Confirm Password": "પાસવર્ડ કન્ફર્મ",
    "Business Code": "બિઝનેસ કોડ",
    "Registered Mobile Number": "રજિસ્ટર્ડ મોબાઇલ નંબર",
    "Portal PIN": "પોર્ટલ PIN",
    "Check Status": "સ્ટેટસ જુઓ",
    "Secure encrypted access": "સુરક્ષિત એન્ક્રિપ્ટેડ ઍક્સેસ",
    "Bill Amount": "બિલ રકમ",
    "Paid Amount": "ચુકવેલી રકમ",
    "Pending Amount": "બાકી રકમ",
    "Last Payment": "છેલ્લી ચુકવણી",
    "Recent Payments": "તાજેતરની ચુકવણીઓ",
    "Status": "સ્થિતિ",
    "Customer Name": "ગ્રાહક નામ",
    "Mobile": "મોબાઇલ",
    "Date": "તારીખ",
    "Amount": "રકમ",
    "Receipt No": "રસીદ નંબર",
    "Payment Mode": "ચુકવણી રીત",
    "Today's Recovery": "આજની રિકવરી",
    "Today’s Recovery": "આજની રિકવરી",
    "Today's Collection": "આજનું કલેક્શન",
    "Today’s Collection": "આજનું કલેક્શન",
    "Total Recovery": "કુલ રિકવરી",
    "Overall Collection": "કુલ કલેક્શન",
    "Total Outstanding": "કુલ બાકી",
    "Total Transactions": "કુલ ટ્રાન્ઝેક્શન",
    "Recovery Entries": "રિકવરી એન્ટ્રી",
    "Total Businesses": "કુલ બિઝનેસ",
    "Active Businesses": "એક્ટિવ બિઝનેસ",
    "Inactive Businesses": "ઇનએક્ટિવ બિઝનેસ",
    "Total Customers": "કુલ ગ્રાહકો",
    "Registered Businesses": "રજિસ્ટર્ડ બિઝનેસ",
    "Currently Active": "હાલ એક્ટિવ",
    "Disabled / Suspended": "બંધ / સસ્પેન્ડ",
    "License needs renewal": "લાઇસન્સ રિન્યુ જરૂરી",
    "Across all business": "બધા બિઝનેસમાં",
    "Across all business records": "બધા બિઝનેસ રેકોર્ડમાં",
    "Add Customer": "ગ્રાહક ઉમેરો",
    "New Customer": "નવો ગ્રાહક",
    "Father Name": "પિતાનું નામ",
    "Product Name": "પ્રોડક્ટ નામ",
    "Alternate Mobile": "વૈકલ્પિક મોબાઇલ",
    "Village": "ગામ",
    "Taluka": "તાલુકો",
    "District": "જિલ્લો",
    "Address": "સરનામું",
    "Aadhaar": "આધાર",
    "PAN": "PAN",
    "Down Payment": "ડાઉન પેમેન્ટ",
    "Outstanding": "બાકી",
    "Executive": "એક્ઝિક્યુટિવ",
    "Follow-up Date": "ફોલો-અપ તારીખ",
    "Payment Due Date": "ચુકવણી તારીખ",
    "Priority": "પ્રાથમિકતા",
    "Remarks": "નોંધ",
    "Auto Reminder": "ઓટો રીમાઇન્ડર",
    "Reminder Interval": "રીમાઇન્ડર અંતરાલ",
    "Save Customer": "ગ્રાહક સેવ કરો",
    "Update Customer": "ગ્રાહક અપડેટ કરો",
    "Search": "શોધો",
    "Filter": "ફિલ્ટર",
    "Aging": "એજિંગ",
    "Due / Follow-up": "બાકી / ફોલો-અપ",
    "Action / WhatsApp": "એક્શન / WhatsApp",
    "View": "જુઓ",
    "Edit": "એડિટ",
    "Delete": "ડિલીટ",
    "WhatsApp Due": "WhatsApp બાકી",
    "UPI / Payment link": "UPI / પેમેન્ટ લિંક",
    "Legal / reminder letter": "લીગલ / રીમાઇન્ડર પત્ર",
    "Set Customer Portal PIN": "ગ્રાહક પોર્ટલ PIN સેટ કરો",
    "Add Recovery Entry": "રિકવરી એન્ટ્રી ઉમેરો",
    "Record Customer Payment": "ગ્રાહક ચુકવણી નોંધો",
    "Select Customer": "ગ્રાહક પસંદ કરો",
    "Select customer": "ગ્રાહક પસંદ કરો",
    "Recovery Date": "રિકવરી તારીખ",
    "Collected By": "કલેક્શન કરનાર",
    "Cash": "કેશ",
    "UPI": "UPI",
    "Bank Transfer": "બેંક ટ્રાન્સફર",
    "Cheque": "ચેક",
    "Recovery History": "રિકવરી ઇતિહાસ",
    "Recovery Summary": "રિકવરી સારાંશ",
    "Monthly Collection": "માસિક કલેક્શન",
    "Pending dues — recover up to this amount": "બાકી રકમ — આટલી રકમ સુધી રિકવર કરો",
    "Select a customer to see pending amount.": "બાકી રકમ જોવા ગ્રાહક પસંદ કરો.",
    "Report": "રિપોર્ટ",
    "Export CSV": "CSV એક્સપોર્ટ",
    "Print": "પ્રિન્ટ",
    "From Date": "શરૂઆત તારીખ",
    "To Date": "અંત તારીખ",
    "Generate Report": "રિપોર્ટ બનાવો",
    "Total Collection": "કુલ કલેક્શન",
    "Customer Report": "ગ્રાહક રિપોર્ટ",
    "Recovery Report": "રિકવરી રિપોર્ટ",
    "Manage Login Credentials": "લોગિન માહિતી મેનેજ કરો",
    "Current Password": "હાલનો પાસવર્ડ",
    "System Role": "સિસ્ટમ રોલ",
    "Role": "રોલ",
    "User Management": "યૂઝર મેનેજમેન્ટ",
    "Add, remove or reset staff login passwords.": "સ્ટાફ લોગિન પાસવર્ડ ઉમેરો, કાઢો અથવા રીસેટ કરો.",
    "New Username": "નવું યૂઝરનેમ",
    "Add User": "યૂઝર ઉમેરો",
    "Modify / Rights": "બદલાવ / અધિકાર",
    "Remove": "કાઢો",
    "Sales / Recovery Executives": "સેલ્સ / રિકવરી એક્ઝિક્યુટિવ",
    "Executive name": "એક્ઝિક્યુટિવ નામ",
    "Add Executive": "એક્ઝિક્યુટિવ ઉમેરો",
    "Data Management": "ડેટા મેનેજમેન્ટ",
    "Backup & Restore Project Data": "પ્રોજેક્ટ ડેટા બેકઅપ અને રીસ્ટોર",
    "Save Settings": "સેટિંગ્સ સેવ કરો",
    "Reset Page": "પેજ રીસેટ",
    "Support Information": "સપોર્ટ માહિતી",
    "Version": "વર્ઝન",
    "Active": "એક્ટિવ",
    "Running Successfully": "સફળતાપૂર્વક ચાલુ છે",
    "Licensed Copy": "લાઇસન્સ્ડ કોપી",
    "Create backup": "બેકઅપ બનાવો",
    "Restore backup": "બેકઅપ રીસ્ટોર",
    "Download password": "ડાઉનલોડ પાસવર્ડ",
    "Backup password": "બેકઅપ પાસવર્ડ",
    "Sync Backup Now": "હમણાં બેકઅપ સિંક કરો",
    "Validate & Restore": "ચેક કરીને રીસ્ટોર કરો",
    "Encrypted backup file": "એન્ક્રિપ્ટેડ બેકઅપ ફાઇલ",
    "Offline backups are encrypted and stored only on this device.": "ઓફલાઇન બેકઅપ એન્ક્રિપ્ટ થઈને માત્ર આ ડિવાઇસમાં જ સેવ રહે છે.",
    "Website Maintenance Mode": "વેબસાઇટ મેન્ટેનન્સ મોડ",
    "Website ON": "વેબસાઇટ ચાલુ",
    "Save Message": "મેસેજ સેવ કરો",
    "Business-wise Overview": "બિઝનેસ મુજબ ઓવરવ્યુ",
    "Manage Companies": "કંપની મેનેજ કરો",
    "Campaign title": "કેમ્પેઇન શીર્ષક",
    "Create Campaign": "કેમ્પેઇન બનાવો",
    "Campaigns": "કેમ્પેઇન",
    "Target": "ટાર્ગેટ",
    "Schedule": "શેડ્યૂલ",
    "Clicks": "ક્લિક્સ",
    "Renew": "રિન્યુ",
    "Plan": "પ્લાન",
    "License Expiry": "લાઇસન્સ સમાપ્તિ",
    "Inactive": "ઇનએક્ટિવ",
    "Save": "સેવ",
    "Cancel": "રદ",
    "Back": "પાછા",
    "Submit": "સબમિટ",
    "Close": "બંધ",
    "Add": "ઉમેરો",
    "Update": "અપડેટ",
    "Create": "બનાવો",
    "Select": "પસંદ કરો",
    "Loading": "લોડ થઈ રહ્યું છે",
    "No data": "ડેટા નથી",
    "No customers": "ગ્રાહક નથી",
    "Access Denied": "ઍક્સેસ નથી",
    "Full administrator access": "પૂર્ણ એડમિન ઍક્સેસ",
    "Account active": "ખાતું એક્ટિવ",
    "View details": "વિગતો જુઓ",
    "Save failed:": "સેવ નિષ્ફળ:",
    "Failed:": "નિષ્ફળ:",
    "Delete failed:": "ડિલીટ નિષ્ફળ:"
  }
};

  const originalText = new WeakMap();
  const originalAttr = new WeakMap();
  let lang = localStorage.getItem(STORE) || "en";
  let applying = false;

  function normalize(value) {
    return String(value || "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  function preserveCase(source, translated) {
    if (!translated) return translated;
    if (source === source.toUpperCase() && /[A-Z]/.test(source)) return translated.toUpperCase();
    return translated;
  }

  function lookup(value) {
    const table = dict[lang];
    if (!table || lang === "en") return value;
    const raw = normalize(value);
    if (!raw) return value;

    const punct = raw.match(/^(.+?)([:：])$/);
    const core = punct ? punct[1].trim() : raw;
    const suffix = punct ? punct[2] : "";

    let translated = table[raw] || table[core];
    if (!translated) {
      const lowerKey = Object.keys(table).find(k => k.toLowerCase() === core.toLowerCase());
      translated = lowerKey ? table[lowerKey] : "";
    }

    if (!translated) return value;
    return preserveCase(core, translated) + suffix;
  }

  function translateTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return;
    if (parent.closest(".rx-lang-switch, script, style, noscript, iframe, code, pre")) return;

    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const base = originalText.get(node);
    const translated = lookup(base);
    node.nodeValue = base.replace(/\S[\s\S]*\S|\S/, translated);
  }

  function translateAttrs(el) {
    if (!el || el.closest(".rx-lang-switch, script, style, noscript, iframe, code, pre")) return;
    ["placeholder", "title", "aria-label", "value"].forEach(attr => {
      if (!el.hasAttribute(attr)) return;
      if (attr === "value" && !["button", "submit", "reset"].includes((el.getAttribute("type") || "").toLowerCase())) return;

      let map = originalAttr.get(el);
      if (!map) {
        map = {};
        originalAttr.set(el, map);
      }
      if (!(attr in map)) map[attr] = el.getAttribute(attr);
      el.setAttribute(attr, lookup(map[attr]));
    });
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.ELEMENT_NODE) translateAttrs(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateAttrs(node);
    }
  }

  function refreshSwitch() {
    document.querySelectorAll(".rx-lang-switch button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function addSwitch() {
    if (document.querySelector(".rx-lang-switch")) return;
    const wrap = document.createElement("div");
    wrap.className = "rx-lang-switch";
    wrap.innerHTML = Object.entries(LANGS)
      .map(([code, label]) => '<button type="button" data-lang="' + code + '">' + label + '</button>')
      .join("");
    document.body.appendChild(wrap);

    const style = document.createElement("style");
    style.textContent = `
      .rx-lang-switch{position:fixed;right:14px;bottom:14px;z-index:99999;display:flex;gap:4px;padding:5px;background:rgba(255,255,255,.94);border:1px solid rgba(15,23,42,.12);border-radius:999px;box-shadow:0 12px 28px rgba(2,6,23,.16);backdrop-filter:blur(12px)}
      .rx-lang-switch button{border:0;background:transparent;color:#1A3D63;font-weight:800;font-size:11px;line-height:1;padding:8px 9px;border-radius:999px;cursor:pointer}
      .rx-lang-switch button.active{background:#1A3D63;color:#fff}
      @media (max-width:640px){.rx-lang-switch{right:10px;bottom:10px}.rx-lang-switch button{font-size:10px;padding:7px 8px}}
    `;
    document.head.appendChild(style);

    wrap.addEventListener("click", event => {
      const btn = event.target.closest("button[data-lang]");
      if (btn) setLang(btn.dataset.lang);
    });
    refreshSwitch();
  }

  function applyLanguage() {
    if (applying) return;
    applying = true;
    walk(document.body);
    refreshSwitch();
    applying = false;
  }

  function setLang(next) {
    lang = next || "en";
    localStorage.setItem(STORE, lang);
    applyLanguage();
  }

  window.RecountixI18n = { setLang, applyLanguage, lookup };

  document.addEventListener("DOMContentLoaded", () => {
    addSwitch();
    applyLanguage();
    const observer = new MutationObserver(records => {
      if (applying || lang === "en") return;
      records.forEach(record => {
        record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) walk(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();