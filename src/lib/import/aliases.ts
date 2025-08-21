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
    unified_company_name: ['company','shipper','consignee','buyer','seller','importer','exporter','company_name','shipper_name','consignee_name','us_consignee_name','consignee company','shipper company','us shipper','us consignee'],
    mode: ['transport mode','shipment mode','air/ocean','mode of transport','transportation mode'],
    hs_code: ['hs','hscode','hs code','tariff code','harmonized code','hs_codes','hs6','hs2','commodity code','schedule b'],
    origin_country: ['origin','country of origin','from country','shipper country','export country','origin_country_name','shipper_country'],
    destination_country: ['destination','dest','to country','consignee country','import country','destination_country_name','consignee_country','country of unlading'],
    destination_city: ['dest city','city of arrival','arrival city','consignee city','port of unlading','destination_city_name','consignee_city'],
    unified_date: ['date','shipment date','arrival date','departure date','export date','import date','arrival_date','departure_date','bl_date','shipment_date'],
    trade_direction_explicit: ['trade direction','direction','import/export','i/e','shipment type'],
    shipper_name: ['shipper','shipper name','us shipper','export shipper','exporter name','shipper_name','us_shipper_name'],
    exporter_name: ['exporter','exporter name','us exporter','seller (export)'],
    importer_name: ['importer','importer name','importer of record','ior','us importer'],
    consignee_name: ['consignee','consignee name','cnee','bl consignee','us consignee','consignee_name','us_consignee_name'],
    receiver_name: ['receiver','ship to','deliver to','deliver-to','receiving dc','warehouse'],
    commodity_description: ['description','goods description','product description','commodity','product','goods','cargo description','shipment description','merchandise description'],
    vessel_name: ['vessel','ship name','vessel name','carrier vessel','ship'],
    bol_number: ['bl','bill of lading','bol','bl number','b/l','house bl','master bl','bill_of_lading'],
    unified_carrier: ['carrier','shipping line','steamship line','vessel operator','carrier name','airline','shipping company'],
    gross_weight_kg: ['weight','gross weight','weight kg','total weight','cargo weight','shipment weight'],
    value_usd: ['value','declared value','cargo value','shipment value','customs value','fob value','merchandise value'],
    container_count: ['containers','container qty','teu','number of containers','container quantity','boxes']
  }
};