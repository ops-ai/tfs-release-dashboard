VSS.init({                        
            explicitNotifyLoaded: true,
            usePlatformStyles: true
        });

        VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Contracts", "VSS/Controls", "VSS/Controls/Combos", "VSS/Controls/Grids"], 
            function (WidgetHelpers, TFS_Wit_WebApi, Contracts, Controls, Combos, Grids) {
                WidgetHelpers.IncludeWidgetStyles();
                VSS.register("ReleaseDashboardWidget", function () {
                    var projectId = VSS.getWebContext().project.id;

                    var getQueryInfo = function (widgetSettings) {
						
						var settings = JSON.parse(widgetSettings.customSettings.data);
						if (!settings || !settings.queryPath) {
						    var $container = $('#query-info-container');
						    $container.empty();
						    $container.text("Nothing to show yet, please configure the widget.");

						    return WidgetHelpers.WidgetStatusHelper.Success();
						}
						
                        // Get a WIT client to make REST calls to VSTS
                        return TFS_Wit_WebApi.getClient().getQuery(projectId, settings.queryPath)
                            .then(function (query) {
								
						        var $title = $('h2.title');
						        $title.text(widgetSettings.name);
									
								return TFS_Wit_WebApi.getClient().queryById(query.id, projectId)
                            			.then(function (queryResult) {
								
										console.log('results: ', queryResult);
										
											
											
										return TFS_Wit_WebApi.getClient().getWorkItems(queryResult.workItems.map(function(queryResultItem) { return queryResultItem.id; }), queryResult.columns.map(function(queryResultItem) { return queryResultItem.referenceName; }))
											.then(function (workItems) {
												
												console.log('wits', workItems);
												
				                                var $container = $('#query-info-container');
												
												var gridOptions = {
												    height: "100%",
												    width: "100%",
												    source: function () {
												      var result = [], i;
												      for (i = 0; i < 100; i++) {
												        result[result.length] = [i, "Column 2 text" + i, "Column 3 "];
												      }

												      return result;
												      } (),
												      columns: [
												        { text: "Column 1", index: 0, width: 50 },
												        { text: "Column 2", index: 1, width: 200, canSortBy: false },
												        { text: "Column 3", index: 2, width: 450 }]
												  };

												  Controls.create(Grids.Grid, $container, gridOptions);

				                                // Use the widget helper and return success as Widget Status
				                                return WidgetHelpers.WidgetStatusHelper.Success();
			                            }, function (error) {
			                                // Use the widget helper and return failure as Widget Status
			                                return WidgetHelpers.WidgetStatusHelper.Failure(error.message);
			                            });
								}, function (error) {
	                                // Use the widget helper and return failure as Widget Status
	                                return WidgetHelpers.WidgetStatusHelper.Failure(error.message);
	                            });
						},
						function (error) {
                            // Use the widget helper and return failure as Widget Status
                            return WidgetHelpers.WidgetStatusHelper.Failure(error.message);
                        });
                    }

                    return {
                        load: function (widgetSettings) {
                            // Set your title

                            return getQueryInfo(widgetSettings);
                        },
						reload: function (widgetSettings) {
					        return getQueryInfo(widgetSettings);
					    }
                    }
                });
            VSS.notifyLoadSucceeded();
        });
