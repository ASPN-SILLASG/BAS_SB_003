sap.ui.define([
    "com/dine/mm/zmm0002/controller/BaseController",
    "sap/ui/model/odata/v2/ODataModel",
    'com/dine/mm/zmm0002/controller/Config/VHDialog',
    "sap/ui/model/Filter",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/date/UI5Date",
],
    function (BaseController, ODataModel, VHDialog, Filter, MessageToast, Sorter, FilterOperator, JSONModel, UI5Date) {
        "use strict";

        var _i18n;
        var _oModelMain;

        return BaseController.extend("com.dine.mm.zmm0002.controller.Main", {

            onInit: function () {
                this.setInitPage();
            },

            setInitPage: function () {

                //Text속성 
                _i18n = this.getOwnerComponent().getModel('i18n').getResourceBundle();


                //메인 Model
                _oModelMain = new ODataModel("/sap/opu/odata/sap/ZUI_ASSB_0000_O2", {
                    defaultOperationMode: "Server"
                });
                this.getOwnerComponent().setModel(_oModelMain, "MainModel");

                //F4
                this.comDialog = new VHDialog(this);
            },

            //==========================F4================================
            onValueHelpCancelPress: function () {
                this.comDialog.close();
            },

            onValueHelpAfterClose: function () {
                this.comDialog.destroy();
            },
            onVHPlant: function (oEvent) {
                this.comDialog.open("PlantVH", this.getView().getModel("MainModel"), "MainModel", true);
            },

            onVHProduct: function (oEvent) {
                this.comDialog.open("ProductVH", this.getView().getModel("MainModel"), "MainModel", true);
            },

            onVHVClass: function (oEvent) {
                this.comDialog.open("VClassVH", this.getView().getModel("MainModel"), "MainModel", true);
            },
            //F4=====확인 리턴
            onValueHelpOkReturn: function (oEvent, vReturnKey) {
                var aTokens = oEvent.getParameter("tokens");
                var key = aTokens[0].getProperty("key");

                if (vReturnKey == "PLANT") {
                    this.getView().byId("idPlant").setValue(key);
                } else if (vReturnKey == "PRODUCT") {
                    this.getView().byId("idProduct").setValue(key);
                } else if (vReturnKey == "VCLASS") {
                    this.getView().byId("idVClass").setValue(key);
                }

                this.comDialog.close();;
            },

              //================F4 화면에서 필드 검색들 
              onFilterBarSearch: function (oEvent) {

                // var sSearchQuery = this._oBasicSearchField.getValue();
                var sSearchQuery = this.comDialog.getSearchValue();
                var aSelectionSet = oEvent.getParameter("selectionSet");

                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }
                    return aResult;
                }, []);

                var sPath1, sPath2;
                if (this.comDialog.getKey() === "ValuationClass") {
                    sPath1 = "ValuationClass";
                    sPath2 = "Description";
                } else if (this.comDialog.getKey() === "Product") {
                    sPath1 = "Product";
                    sPath2 = "ProductDescription";
                }

                if (sSearchQuery != '') {
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: sPath1, operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: sPath2, operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }

                this.comDialog.filter(new Filter({
                    filters: aFilters,
                    and: true
                }));


            },

            checkInputFileds:function() {

                if (!this.getView().byId("idSeleteDate").getValue()) {
                    MessageToast.show("연월을 입력해주세요")
                    return false;
                }

                if (!this.getView().byId("idPlant").getValue()) {
                    MessageToast.show("플랜트를 입력해주세요")
                    return false;
                }

                if (!this.getView().byId("idVClass").getValue()) {
                    MessageToast.show("평가클래스를 입력해주세요")
                    return false;
                }

                return true;

            },

            onUpdate:function(oEvent){
                if(!this.checkInputFileds()) return;
            
                let vSpmons = this.getView().byId("idSeleteDate").getValue();
                let vPlant = this.getView().byId("idPlant").getValue();
                let vClass = this.getView().byId("idVClass").getValue();
                let vProduct = this.getView().byId("idProduct").getValue();
               
                let date = UI5Date.getInstance(vSpmons);
        
                let yyyy = String(date.getFullYear());
                let mm = String(date.getMonth() + 1).padStart(2, '0')

                this.openLoading();
                _oModelMain.callFunction("/calc_value",
                    {
                        method: "POST",
                        urlParameters: { 
                            Spmons: yyyy+mm,
                            Werks: vPlant,
                            Bklas: vClass,
                            Matnr: vProduct
                         },
                        success: function (odata, response) {
                            this.closeLoading();
                            this._showMessage("수불 업데이트가 완료되었습니다", function(){

                            });
                     
                        }.bind(this),
                        error: function (oError) {
                            this.closeLoading();
                            try {
                                var oResponseTextData = JSON.parse(oError.responseText);
                                this._showConfirm("수불 업데이트가 실패했습니다.",function(){

                                });
                            } catch (e) {
                               
                            }
                        }.bind(this)
                    })

            }


        });
    });
