sap.ui.define(
    [
        "sap/ui/base/Object",
        "sap/ui/model/json/JSONModel",
        "com/dine/mm/zmm0002/controller/Config/AppConfig",
        "sap/ui/model/Filter",

    ],
    function (BaseObject, JSONModel, AppConfig, Filter) {

        var _diaLog;
        var _isOpen;

        return BaseObject.extend("com.dine.mm.zmm0002.controller.Config.VHDialog", {

            constructor: function (control) {
                this.control = control;
                _isOpen = false;
            },

            open: function (viewName, model, modelName, single) {
                if (_isOpen) return;
                _isOpen = true;

                let viewData = AppConfig.VHDialog[viewName]

                if (viewData.searchBar) {
                    this._oBasicSearchField = new sap.m.SearchField();
                }

                this.control.loadFragment({
                    name: viewData["viewName"],
                }).then(function (oDialog) {

                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHD = oDialog;

                    if (viewData.searchBar) {
                        oFilterBar.setBasicSearch(this._oBasicSearchField);
                        this._oBasicSearchField.attachSearch(function () {
                            oFilterBar.search();
                        });
                    }

                    // Set key fields for filtering in the Define Conditions Tab
                    oDialog.setRangeKeyFields([{
                        label: viewData["label"],
                        key: viewData["key"],
                        type: viewData["type"]
                    }]);

                    this.control.getView().addDependent(oDialog);
                    //var oVHModel = this.getOwnerComponent().getModel("oGSalesOffice");

                    oFilterBar.setFilterBarExpanded(true);

                    oDialog.getTableAsync().then(function (oTable) {

                        if (single) {
                            oTable.setSelectionMode("Single");
                            oTable.setSelectionBehavior("Row");
                        }

                        oTable.setModel(model);
                        oTable.setEnableSelectAll(false);
                        // For Desktop and tabled the default table is sap.ui.table.Table
                        if (oTable.bindRows) {
                            let path;

                            if (viewData["path"] == "") {
                                path = "/"
                            } else {
                                path = modelName + ">/" + viewData["path"];
                            }

                            let defualts = viewData["defaultValue"];
                            let aResult = [];
                            if (defualts.length != 0) {

                                for (let i = 0; i < aResult.length; i++) {
                                    aResult.push(new Filter(
                                        {
                                            path: aResult[i].title,
                                            operator: "Contains",
                                            value1: aResult[i].value,

                                        }));
                                }

                            }

                            // Bind rows to the ODataModel and add columns
                            oTable.bindAggregation("rows", {
                                path: path,
                                filter : aResult,
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });

                            let fileds = viewData["fields"];
                            for (let i = 0; i < fileds.length; i++) {

                                if (viewData["path"] == "") {
                                    oTable.addColumn(new sap.ui.table.Column({ label: new sap.m.Label({ text: fileds[i].title }), template: new sap.m.Text({ wrapping: false, text: "{" + fileds[i].value + "}" }) }));
                                } else {
                                    oTable.addColumn(new sap.ui.table.Column({ label: new sap.m.Label({ text: fileds[i].title }), template: new sap.m.Text({ wrapping: false, text: "{" + modelName + ">" + fileds[i].value + "}" }) }));
                                }

                            }

                        }
                    }.bind(this));

                    oDialog.open();
                }.bind(this));

            },

            getSearchValue: function () {
                return this._oBasicSearchField.getValue();
            },

            close: function () {
                _isOpen = false;
                this._oVHD.close();
            },
            destroy: function () {
                _isOpen = false;
                this._oVHD.destroy();
            },

            getKey: function () {
                return this._oVHD.getKey();
            },

            filter: function (oFilter) {
                var oVHD = this._oVHD;
                oVHD.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }
                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }
                    // This method must be called after binding update of the table.
                    oVHD.update();
                });
            },





        })
    }
);
