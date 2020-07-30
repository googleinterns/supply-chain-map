export const constants = {
    bigQuery: {
        scope: [
            // View and manage your data in Google BigQuery
            'https://www.googleapis.com/auth/bigquery',

            // Insert data into Google BigQuery
            'https://www.googleapis.com/auth/bigquery.insertdata',

            // View and manage your data across Google Cloud Platform services
            'https://www.googleapis.com/auth/cloud-platform',

            // View your data across Google Cloud Platform services
            'https://www.googleapis.com/auth/cloud-platform.read-only',

            // View your data in Google Cloud Storage
            'https://www.googleapis.com/auth/devstorage.read_only',

            // See and download all your Google Drive files
            'https://www.googleapis.com/auth/drive.readonly'
        ].join(' '),
        apiUrl: 'https://bigquery.googleapis.com',
        discoveryDocument: 'https://bigquery.googleapis.com/discovery/v1/apis/bigquery/v2/rest',
        datasets: {
            route: {
                dataset: 'scm_mock',
                tables: {
                    UPSTREAM: {
                        tableName: 'upstream',
                        columns: {
                            PRODUCT: 'Product',
                            PARENT_SKU: 'Parent',
                            PART_NUMBER: 'Part_Number',
                            DESCRIPTION: 'Description',
                            CATEGORY: 'Category',
                            SUPPLIER_NAME: 'Supplier_Name',
                            MPN: 'MPN',
                            LEAD_TIME: 'Lead_Time',
                            TOTAL_QTY: 'Total_Qty',
                            UNIT_COST: 'Unit_Cost____',
                            MFG_COUNTRY: 'Mfg_Country',
                            MFG_STATE: 'Mfg_State',
                            MFG_CITY: 'Mfg_City',
                            MFG_LAT: 'Mfg_LAT',
                            MFG_LONG: 'Mfg_LONG'
                        }
                    },
                    CM: {
                        tableName: 'cm',
                        columns: {
                            PRODUCT: 'Product',
                            SKU: 'SKU',
                            DESCRIPTION: 'Description',
                            CM_NAME: 'CM_NAME',
                            LEAD_TIME: 'Production_Lead_Time',
                            CM_COUNTRY: 'CM_Location___Country',
                            CM_STATE: 'CM_Location___State',
                            CM_CITY: 'CM_Location___City',
                            CM_LAT: 'CM_Location_LAT',
                            CM_LONG: 'CM_Location_LONG'
                        }
                    },
                    DOWNSTREAM: {
                        tableName: 'downstream',
                        columns: {
                            PRODUCT: 'Product',
                            SKU: 'SKU',
                            DESCRIPTION: 'SKU_Description',
                            GDC_CODE: 'GDC_Code',
                            LEAD_TIME: 'Average_Logistic_LT___Air__Ocean__CM____GDC',
                            GDC_COUNTRY: 'GDC_Country',
                            GDC_STATE: 'GDC_State',
                            GDC_CITY: 'GDC_City',
                            GDC_LAT: 'GDC_Location_LAT',
                            GDC_LONG: 'GDC_Location_LONG'
                        }
                    }
                },
            },
            heatmap: {
                dataset: 'heatmap_layers',
                columns: [
                    'latitude',
                    'longitude',
                    'magnitude',
                    'data'
                ]
            },
            shape: {
                dataset: 'shape_layers',
                columns: [
                    'shape',
                    'magnitude',
                    'data'
                ]
            },
            risk: {
                dataset: 'scm_mock',
                table: 'risk',
                columns: {
                    SUPPLIER_NAME: 'Supplier',
                    FRISK_SCORE: 'Frisk_Score',
                    DRI: 'DRI',
                    COMMODITY: 'Commodity',
                    SPEND_IN_MIL: '_2019_spend_in_mil',
                    SPEND_IN_PERCENTAGE: '_2019_spend_percentage',
                    OVERALL_RISK: 'Overall_Risk',
                    SEGMENTATION: 'Segmentation',
                    CONCENTRATION: 'Concentration',
                    DEPENDENCE: 'Dependence',
                    PRICE: 'Price',
                    FINANCIAL_HEALTH: 'Financial_Health',
                    CONTRACTUAL: 'Contractual',
                    COMPLIANCE_WITH_SUSTAINABILITY: 'Compliance_with_Sustainability',
                    GEOPOLITICAL: 'Geopolitical',
                    CONFIDENTIALITY: 'Confidentiality',
                    QUALITY: 'Quality',
                    RISK_LEVEL: 'Risk_Level',
                    IMPACT_LEVEL: 'Impact_level',
                    TOTAL_SCORE: 'Total_Score',
                    PRIORITY: 'Priority'
                }
            }
        }
    }
};
