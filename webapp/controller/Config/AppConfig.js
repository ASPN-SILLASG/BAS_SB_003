sap.ui.define(
  [],
  function () {
    //=============================Table Stander===========================
    const MainTableConfig = {
      Engine: {}
    }

    //==============================Excel DownLoad======================================




    //==============================F4=======================================
    const VHDialog = {
      "PlantVH": {
        "viewName": "com/dine/mm/zmm0002/view/fragment/PlantVH",
        "path" : "Plant",
        "label": "PlantName",
        "key": "Plant",
        "type": "string",
        "searchBar": false,
        "fields": [
          { "title": "플랜트", "value": "Plant" },
          { "title": "플랜트명", "value": "PlantName" },
        ],
        "defaultValue": []
      },
      "ProductVH": {
        "viewName": "com/dine/mm/zmm0002/view/fragment/ProductVH",
        "path" : "Product",
        "label": "ProductDescription",
        "key": "Product",
        "type": "string",
        "searchBar": true,
        "fields": [
          { "title": "자재", "value": "Product" },
          { "title": "자재 명", "value": "ProductDescription" }
        ],
        "defaultValue": []
      },
      "VClassVH": {
        "viewName": "com/dine/mm/zmm0002/view/fragment/VClass",
        "path" : "VClass",
        "label": "Description",
        "key": "ValuationClass",
        "type": "string",
        "searchBar": true,
        "fields": [
          { "title": "평가클래스", "value": "ValuationClass" },
          { "title": "평가클래스 명", "value": "Description" }
        ],
        "defaultValue": []
      }
    }


    return {
      VHDialog: VHDialog,
      TableConfig: MainTableConfig,

    }
  }
);
