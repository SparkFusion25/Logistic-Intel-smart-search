export type AliasMap = Record<string, string[]>;
export type TableAliasMap = Record<string, AliasMap>;

// Add/adjust as needed. All keys should be LOWERCASE canonical column names.
export const TABLE_ALIASES: TableAliasMap = {
  crm_contacts: {
    company_name: ['company','companyname','org','organization','account','account name','employer'],
    full_name: ['name','fullname','contact','contact name','person','first and last name'],
    title: ['job title','role','position'],
    email: ['e-mail','mail','email address'],
    phone: ['telephone','tel','mobile','cell','phone number'],
    linkedin: ['linkedin url','linkedin profile','li','linkedin_profile'],
    country: ['country name','nation'],
    city: ['town','municipality'],
    tags: ['labels','segments','groups']
  },
  companies: {
    name: ['company','company_name','legal name','registered name'],
    country: ['country','country name'],
    city: ['city','town'],
    website: ['url','domain','site']
  },
  unified_shipments: {
    unified_company_name: ['company','shipper','consignee','buyer','seller','importer','exporter','company_name'],
    mode: ['transport mode','shipment mode','air/ocean','mode of transport'],
    hs_code: ['hs','hscode','hs code','tariff code'],
    origin_country: ['origin','country of origin','from country'],
    destination_country: ['destination','dest','to country'],
    destination_city: ['dest city','city of arrival','arrival city'],
    unified_date: ['date','shipment date','arrival date','departure date']
  }
};