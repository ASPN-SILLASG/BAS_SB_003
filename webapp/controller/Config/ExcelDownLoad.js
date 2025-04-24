sap.ui.define(
    [
        "sap/ui/base/Object",
        "sap/ui/export/Spreadsheet"
    ],
    function (BaseObject, Spreadsheet) {

        var _cloums = [
            {
                property: "CallNum",
                label: "접수번호",
                width: 15
            },
            
            {
                property: "SalesCustomer",
                label: "판매처",
                width: 15
            },
            {
                property: "SalesCustomerName",
                label: "판매처명",
                width: 15
            },
            {
                property: "BPCustomer",
                label: "배송처",
                width: 15
            },
            {
                property: "BPCustomerName",
                label: "배송처명",
                width: 15
            },
            {
                property: "CallTypeText",
                label: "콜유형",
                width: 25
            },
            {
                property: "RecDate",
                label: "접수일",
                width: 15,
                type: sap.ui.export.EdmType.Date,
                inputFormat: "yyyymmdd"
            },
            {
                property: "ProcDate",
                label: "처리예정일",
                width: 15,
                type: sap.ui.export.EdmType.Date,
                inputFormat: "yyyymmdd"
            },
            {
                property: "CompDate",
                label: "완료일",
                width: 15,
                type: sap.ui.export.EdmType.Date,
                inputFormat: "yyyymmdd"
            },
            {
                property: "SalesOffice",
                label: "영업소",
                width: 15
            },

            {
                property: "SalesOfficeName",
                label: "영업소명",
                width: 15
            },

            {
                property: "Product",
                label: "자재",
                width: 15
            },

            {
                property: "ProductName",
                label: "자재명",
                width: 15
            },
            {
                property: ["ProductGroupName", "ProductGroup"],
                label: "자재구룹",
                width: 25,
                template: "{1} ({0})"
            },

            {
                property: ["Quantity", "BaseUnit"],
                label: "수량",
                width: 25,
                template: "{0} ({1})"
            },
            
            {
                property: "Lotno",
                label: "Lot No",
                width: 15
            },
            {
                property: "Rmano",
                label: "Rma No",
                width: 15
            },


           
        ];

        return BaseObject.extend("com.dine.qm.zqm0001.controller.VHDialog", {

            constructor: function (control) {
                this.control = control;

            },
            downLoad: function (oModel, path, filters, callBack, aColumns) {

                let excelTitle = path;
                let colums = [];
                if (aColumns){

                    for (let i = 0; i < aColumns.length; i++) {
                        col = aColumns[i];

                        var sProperty = col.getTemplate().getBindingPath("text");
                        if(!sProperty) {
                            sProperty = col.getTemplate().getBindingPath("title");
                        }

                        var sText;
                        if (col.getLabel().mProperties.text) {
                            sText = col.getLabel().mProperties.text;
                        } else {
                            sText = "no Header";
                        }
                        
                        var obj = {
                            label : sText,
                            property : sProperty
                        };
                        
                        var bVisible = col.getVisible();
                        if(bVisible){
                            colums.push(obj);
                        }
                    }

                    
                } else {
                    colums = _cloums;
                }
               
                oModel.read(path, {
                    filters: filters,
                    urlParameters : { $top : 1000000 }, 
                    success: function (oReturn) {
                        let data = oReturn["results"];

                        var oConfiguration = {
                            context: {
                              sheetName: 'Custom metadata'
                            },
                            workbook: {
                              columns: colums
                            },
                            dataSource: data ,
                            fileName: "월 수불부" + ".xlsx"
                          }

                        var oExportConfiguration, oExportPromise, oSpreadsheet;

                        oExportConfiguration = oConfiguration;
                        oSpreadsheet = new Spreadsheet(oExportConfiguration);

                        oExportPromise = oSpreadsheet.build();

                        oExportPromise.then(function () {
                            callBack("S");
                        });

                    },
                    error: function () {
                        callBack("E");
                    }

                });
            }

        })
    }
);
