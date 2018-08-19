VSS.init({                        
            explicitNotifyLoaded: true,
            usePlatformStyles: true
        });

        VSS.require(["TFS/Dashboards/WidgetHelpers", "TFS/WorkItemTracking/RestClient"], 
            function (WidgetHelpers, TFS_Wit_WebApi) {
                WidgetHelpers.IncludeWidgetStyles();
                VSS.register("ReleaseDashboardWidget", function () {                
                    var projectId = VSS.getWebContext().project.id;

                    var getQueryInfo = function (widgetSettings) {
                        // Get a WIT client to make REST calls to VSTS
                        return TFS_Wit_WebApi.getClient().getQuery(projectId, "Shared Queries/Next Release")
                            .then(function (query) {
								
	                            var $title = $('h2.title');
	                            $title.text(query.name);
									
                                // Create a list with query details                                
                                var $list = $('<ul>');
                                $list.append($('<li>').text("Query ID: " + query.id));
                                $list.append($('<li>').text("Query Name: " + query.name));
                                $list.append($('<li>').text("Created By: " + (query.createdBy ? query.createdBy.displayName: "<unknown>") ));

                                // Append the list to the query-info-container
                                var $container = $('#query-info-container');
                                $container.empty();
                                $container.append($list);

                                // Use the widget helper and return success as Widget Status
                                return WidgetHelpers.WidgetStatusHelper.Success();
                            }, function (error) {
                                // Use the widget helper and return failure as Widget Status
                                return WidgetHelpers.WidgetStatusHelper.Failure(error.message);
                            });
                    }

                    return {
                        load: function (widgetSettings) {
                            // Set your title
                            var $title = $('h2.title');
                            $title.text('Hello World');

                            return getQueryInfo(widgetSettings);
                        }
                    }
                });
            VSS.notifyLoadSucceeded();
        });
