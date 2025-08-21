export type AliasMap = Record<string, string[]>;
export type TableAliasMap = Record<string, AliasMap>;

// Add/adjust as needed. All keys should be LOWERCASE canonical column names.
export const TABLE_ALIASES: TableAliasMap = {
  crm_contacts: {
    company_name: ['company','companyname','org','organization','account','account name','employer','consignee company','shipper company','us consignee','us shipper','consignee_name','shipper_name'],
    full_name: ['name','fullname','contact','contact name','person','first and last name','contact_name'],
    title: ['job title','role','position','title'],
    email: ['e-mail','mail','email address','contact_email','shipper_email','consignee_email'],
    phone: ['telephone','tel','mobile','cell','phone number','contact_phone','shipper_phone','consignee_phone'],
    linkedin: ['linkedin url','linkedin profile','li','linkedin_profile'],
    country: ['country name','nation','shipper_country','consignee_country'],
    city: ['town','municipality','shipper_city','consignee_city'],
    tags: ['labels','segments','groups'],
    panjiva_id: ['panjiva id','id','record id','unique id']
  },
  companies: {
    name: ['company','company_name','legal name','registered name'],
    country: ['country','country name'],
    city: ['city','town'],
    website: ['url','domain','site']
  },
  unified_shipments: {
    // Core company identifiers - PANJIVA SPECIFIC MAPPINGS ADDED
    unified_company_name: ['company','shipper','consignee','buyer','seller','importer','exporter','company_name','shipper_name','consignee_name','us_consignee_name','consignee company','shipper company','us shipper','us consignee','shipper/consignee','company / shipper','company / consignee'],
    shipper_name: ['shipper','shipper name','us shipper','export shipper','exporter name','shipper_name','us_shipper_name','exp shipper','exporter'],
    consignee_name: ['consignee','consignee name','cnee','bl consignee','us consignee','consignee_name','us_consignee_name','receiver','importer name','importer'],
    shipper: ['shipper','exp shipper','exporter','seller','vendor','supplier'],
    consignee: ['consignee','cnee','receiver','importer','buyer','purchaser'],
    
    // Transport modes
    mode: ['transport mode','shipment mode','air/ocean','mode of transport','transportation mode','shipping mode','freight mode'],
    shipment_type: ['shipment type','type','freight type','cargo type','transport type'],
    transport_mode: ['transport mode','mode of transport','shipping method','freight mode'],
    shipment_mode: ['shipment mode','mode','shipping mode'],
    transport_method: ['transport method','method','shipping method','freight method'],
    
    // PANJIVA SPECIFIC MAPPINGS - Critical for correct data import
    trade_direction: ['trade direction','direction','export','import','trade type','flow direction'],
    
    // Commodity codes and descriptions - ENHANCED FOR PANJIVA
    hs_code: ['hs','hscode','hs code','tariff code','harmonized code','hs_codes','hs6','hs2','hs4','hs8','hs10','commodity code','schedule b','harmonized system code','tariff number','commodity classification'],
    description: ['description','commodity description','product description','goods description','cargo description','item description','shipment description','merchandise description','product name','goods shipped'],
    hs_description: ['hs description','commodity name','product category','item category','goods category'],
    commodity_description: ['commodity description','product description','goods description','cargo description','shipment description','merchandise description','commodity','product','goods','cargo','item','goods shipped'],
    
    // Geographic information - PANJIVA COUNTRY MAPPINGS
    origin_country: ['origin','country of origin','from country','shipper country','export country','origin_country_name','shipper_country','departure country','source country'],
    destination_country: ['destination','dest','to country','consignee country','import country','destination_country_name','consignee_country','country of unlading','arrival country','target country','country of destination'],
    destination_city: ['dest city','city of arrival','arrival city','consignee city','port of unlading','destination_city_name','consignee_city','delivery city','final destination'],
    destination_state: ['dest state','destination state','consignee state','arrival state','delivery state','state of delivery'],
    shipment_origin: ['shipment origin','origin','departure point','source location','pickup location'],
    shipment_destination: ['shipment destination','destination','delivery point','final destination','drop-off location'],
    shipment_destination_region: ['destination region','dest region','delivery region','target region'],
    
    // Port information
    port_of_loading: ['port of loading','pol','loading port','departure port','origin port','embarkation port','pickup port'],
    port_of_discharge: ['port of discharge','pod','discharge port','arrival port','destination port','unloading port','delivery port'],
    port_of_unlading: ['port of unlading','unlading port','unloading port','discharge port','arrival port'],
    port_of_lading: ['port of lading','lading port','loading port','departure port','embarkation port'],
    port_of_lading_country: ['pol country','loading port country','departure port country'],
    port_of_lading_region: ['pol region','loading port region','departure region'],
    port_of_unlading_region: ['pod region','discharge port region','arrival region'],
    
    // Carrier and vessel information
    unified_carrier: ['carrier','shipping line','steamship line','vessel operator','carrier name','airline','shipping company','freight carrier','transport company'],
    carrier_name: ['carrier name','carrier','shipping line','steamship line','airline name','transport provider'],
    vessel_name: ['vessel','ship name','vessel name','carrier vessel','ship','aircraft','flight','truck','rail car'],
    vessel: ['vessel','ship','aircraft','flight number','truck id','rail car'],
    vessel_voyage_id: ['voyage','voyage number','flight number','trip number','journey id'],
    
    // BOL and documentation
    bol_number: ['bl','bill of lading','bol','bl number','b/l','house bl','master bl','bill_of_lading','bol no','bl no','lading number'],
    bill_of_lading_number: ['bill of lading number','bol number','bl number','lading number','shipping document'],
    
    // Dates
    unified_date: ['date','shipment date','arrival date','departure date','export date','import date','arrival_date','departure_date','bl_date','shipment_date','shipping date','freight date'],
    shipment_date: ['shipment date','shipping date','dispatch date','send date','freight date'],
    arrival_date: ['arrival date','delivery date','receipt date','discharge date','unloading date'],
    departure_date: ['departure date','loading date','pickup date','embarkation date','dispatch date'],
    
    // Values and measurements - PANJIVA WEIGHT MAPPINGS CRITICAL
    unified_value: ['value','total value','cargo value','shipment value','freight value'],
    unified_weight: ['weight','total weight','cargo weight','shipment weight','freight weight','weight (kg)'],
    value_usd: ['value','declared value','cargo value','shipment value','customs value','fob value','merchandise value','commercial value','invoice value'],
    gross_weight_kg: ['weight','gross weight','weight kg','total weight','cargo weight','shipment weight','freight weight','net weight','weight (kg)'],
    weight_kg: ['weight kg','weight','cargo weight','net weight','total weight','weight (kg)'],
    container_count: ['containers','container qty','teu','number of containers','container quantity','boxes','container units','ctn count'],
    quantity: ['quantity','qty','units','pieces','count','number of items'],
    
    // Address information
    shipper_address: ['shipper address','exp address','exporter address','sender address','pickup address'],
    shipper_city: ['shipper city','exp city','exporter city','sender city','pickup city'],
    shipper_state_region: ['shipper state','exp state','exporter state','sender state','pickup state','shipper region'],
    shipper_postal_code: ['shipper zip','exp zip','exporter zip','sender zip','pickup zip','shipper postal code'],
    shipper_full_address: ['shipper full address','complete shipper address','full sender address'],
    consignee_address: ['consignee address','receiver address','delivery address','importer address'],
    consignee_city: ['consignee city','receiver city','delivery city','importer city'],
    consignee_state_region: ['consignee state','receiver state','delivery state','importer state','consignee region'],
    consignee_postal_code: ['consignee zip','receiver zip','delivery zip','importer zip','consignee postal code'],
    consignee_full_address: ['consignee full address','complete consignee address','full receiver address'],
    
    // Contact information
    shipper_email_1: ['shipper email','exp email','exporter email','sender email','shipper contact email'],
    shipper_phone_1: ['shipper phone','exp phone','exporter phone','sender phone','shipper contact phone','shipper tel'],
    consignee_email_1: ['consignee email','receiver email','importer email','delivery email','consignee contact email'],
    consignee_phone_1: ['consignee phone','receiver phone','importer phone','delivery phone','consignee contact phone','consignee tel'],
    consignee_website_1: ['consignee website','receiver website','importer website','consignee url','receiver url'],
    
    // Company metadata
    shipper_industry: ['shipper industry','exp industry','exporter industry','sender industry','shipper sector'],
    shipper_revenue: ['shipper revenue','exp revenue','exporter revenue','sender revenue','shipper sales'],
    shipper_employees: ['shipper employees','exp employees','exporter employees','sender employees','shipper staff'],
    shipper_trade_roles: ['shipper roles','exp roles','exporter roles','sender roles'],
    consignee_industry: ['consignee industry','receiver industry','importer industry','delivery industry','consignee sector'],
    consignee_revenue: ['consignee revenue','receiver revenue','importer revenue','consignee sales'],
    consignee_employees: ['consignee employees','receiver employees','importer employees','consignee staff'],
    consignee_trade_roles: ['consignee roles','receiver roles','importer roles'],
    
    // Additional fields
    matching_fields: ['matching fields','match fields','correlation fields'],
    is_likely_air_shipper: ['air shipper','likely air','air freight'],
    air_confidence_score: ['air confidence','air score','air probability']
  }
};