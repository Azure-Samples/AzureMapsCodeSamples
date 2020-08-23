var sampleList = [
{
	category:'Animations',
	desc:'Learn how to animate data on the map. Many of these samples leverage the open source <a href="https://github.com/Azure-Samples/azure-maps-animations" target="_blank">Azure Maps Animation module</a>',
	samples: [
		{
			title:'Animate a Choropleth Map',
			desc:'This sample shows how to create a choropleth map and animate it over time.',
			path:'Animations/Animate%20a%20choropleth%20map.html',
			sourcePath:'Animations/Animate%20a%20choropleth%20map.html',
			screenshot:'Animate-a-choropleth-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, thematic, choropleth, heatmap, heat map, animation, animate, animations, county, population, data-driven, data driven styling',
			created:'10/8/2018'
		},
		{
			title:'Animate a GPS trace',
			desc:'This sample shows how to smoothly animate a symbol along a route path taking into consideration timestamps for each point in the route path.',
			path:'Animations/Animate%20a%20GPS%20trace.html',
			sourcePath:'Animations/Animate%20a%20GPS%20trace.html',
			screenshot:'Animate-a-GPS-trace.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbols, pushpins, markers, pins, line, linestring, polyline',
			created:'8/21/2020'
		},
		{
			title:'Animate a Line',
			desc:'This sample shows how to animate the position of a line on the map by updating its coordinates and layer.',
			path:'Animations/Animate%20a%20Line.html',
			sourcePath:'Animations/Animate%20a%20Line.html',
			screenshot:'Animate-a-Line.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, line, linestring, polyline',
			created:'6/8/2018'
		},
		{
			title:'Animate a snakeline',
			desc:'This sample shows how to animate a LineString such that its path is drawn out smoothly over time on top of the map using what is called a snakeline animation.',
			path:'Animations/Animate%20a%20snakeline.html',
			sourcePath:'Animations/Animate%20a%20snakeline.html',
			screenshot:'Animate-a-snakeline.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, line, linestring',
			created:'8/21/2020'
		},
		{
			title:'Animate along a path',
			desc:'This sample shows how to animate a symbol along a path on the map smoothly. This sample also includes controls and options for the animation.',
			path:'Animations/Animate%20along%20a%20path.html',
			sourcePath:'Animations/Animate%20along%20a%20path.html',
			screenshot:'Animate-along-a-path.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbols, pushpins, markers, pins, line, linestring, polyline',
			created:'10/10/2018'
		},
		{
			title:'Animate along a route path',
			desc:'This sample shows how to smoothly animate a symbol along a route path taking into consideration timestamps for each point in the route path. This sample also includes controls and options for the animation.',
			path:'Animations/Animate%20along%20a%20route%20path.html',
			sourcePath:'Animations/Animate%20along%20a%20route%20path.html',
			screenshot:'Animate-along-a-route-path.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbols, pushpins, markers, pins, line, linestring, polyline',
			created:'8/21/2020'
		},
		{
			title:'Animate marker along path',
			desc:'This sample shows how to easily animate a HTML marker along a path on the map.',
			path:'Animations/Animate%20marker%20along%20path.html',
			sourcePath:'Animations/Animate%20marker%20along%20path.html',
			screenshot:'Animate-marker-along-path.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Animate multiple points',
			desc:'This sample shows how to animate multiple points on the map.',
			path:'Animations/Animate%20multiple%20points.html',
			sourcePath:'Animations/Animate%20multiple%20points.html',
			screenshot:'Animate-multiple-points.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Animate point along path',
			desc:'This sample shows how to easily animate a point along a path on the map.',
			path:'Animations/Animate%20point%20along%20path.html',
			sourcePath:'Animations/Animate%20point%20along%20path.html',
			screenshot:'Animate-point-along-path.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Animate to new position of marker',
			desc:'This sample shows how to animate a marker on the map to a new coordinate.',
			path:'Animations/Animate%20to%20new%20position%20of%20marker.html',
			sourcePath:'Animations/Animate%20to%20new%20position%20of%20marker.html',
			screenshot:'Animate-to-new-position-of-marker.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Animate to new position of point',
			desc:'This sample shows how to animate a point on the map to a new coordinate.',
			path:'Animations/Animate%20to%20new%20position%20of%20point.html',
			sourcePath:'Animations/Animate%20to%20new%20position%20of%20point.html',
			screenshot:'Animate-to-new-position-of-point.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Animated tile layer',
			desc:'This sample shows how to animate an sequence of tile layers smoothly.',
			path:'Animations/Animated%20tile%20layer.html',
			sourcePath:'Animations/Animated%20tile%20layer.html',
			screenshot:'Animated-tile-layer.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, tiles',
			created:'8/21/2020'
		},
		{
			title:'Animated traffic flow',
			desc:'This sample shows how to animate the flow of traffic relative to the congestion level using the flowing dashed line animation.',
			path:'Animations/Animated%20traffic%20flow.html',
			sourcePath:'Animations/Animated%20traffic%20flow.html',
			screenshot:'Animated-traffic-flow.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, traffic flow, traffic, flow, dashed',
			created:'8/23/2020'
		},
		{
			title:'Animation easings',
			desc:'This sample demonstrates the different built in easing functions in the azure-maps-animation library.',
			path:'Animations/Animation%20easings.html',
			sourcePath:'Animations/Animation%20easings.html',
			screenshot:'Animation-easings.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin, easing',
			created:'8/21/2020'
		},
		{
			title:'Bouncing marker animation',
			desc:'This sample shows how to animate an HTML marker to make it appear to be bouncing on the map.',
			path:'Animations/Bouncing%20marker%20animation.html',
			sourcePath:'Animations/Bouncing%20marker%20animation.html',
			screenshot:'Bouncing-marker-animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Drop markers on interval',
			desc:'This sample shows how to animate the dropping of multiple HTML markers on an interval to the map.',
			path:'Animations/Drop%20markers%20on%20interval.html',
			sourcePath:'Animations/Drop%20markers%20on%20interval.html',
			screenshot:'Drop-markers-on-interval.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Drop multiple markers animation',
			desc:'This sample shows how to animate the dropping of multiple HTML markers on the map.',
			path:'Animations/Drop%20multiple%20markers%20animation.html',
			sourcePath:'Animations/Drop%20multiple%20markers%20animation.html',
			screenshot:'Drop-multiple-markers-animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Drop multiple symbols animation',
			desc:'This sample shows how to animate multiple points on the map as dropping symbols.',
			path:'Animations/Drop%20multiple%20symbols%20animation.html',
			sourcePath:'Animations/Drop%20multiple%20symbols%20animation.html',
			screenshot:'Drop-multiple-symbols-animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Drop symbol animation',
			desc:'This sample shows how to animate a point on the map as a dropping symbol.',
			path:'Animations/Drop%20symbol%20animation.html',
			sourcePath:'Animations/Drop%20symbol%20animation.html',
			screenshot:'Drop-symbol-animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Drop multiple symbols on interval',
			desc:'This sample shows how to animate the dropping of multiple points on an interval to the map using a symbol layer.',
			path:'Animations/Drop%20symbols%20on%20interval.html',
			sourcePath:'Animations/Drop%20symbols%20on%20interval.html',
			screenshot:'Drop-symbols-on-interval.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'HTML Marker Pulse Animation',
			desc:'This sample shows how to pulse animate the position of a HTML marker on the map using CSS.',
			path:'Animations/HTML%20Marker%20Pulse%20Animation.html',
			sourcePath:'Animations/HTML%20Marker%20Pulse%20Animation.html',
			screenshot:'HTML-Marker-Pulse-Animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbol, pushpin, marker, pin',
			created:'10/11/2018'
		},
		{
			title:'Morph shape animation',
			desc:'This sample shows how to animate the morphing of a shape from one geometry to another.',
			path:'Animations/Morph%20shape%20animation.html',
			sourcePath:'Animations/Morph%20shape%20animation.html',
			screenshot:'Morph-shape-animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, line, linestring, polygon, geometries, morph',
			created:'8/21/2020'
		},
		{
			title:'Animate marker along path',
			desc:'This sample shows how to easily animate a HTML marker along a path on the map.',
			path:'Animations/Moving%20dashed%20line.html',
			sourcePath:'Animations/Moving%20dashed%20line.html',
			screenshot:'Animate-marker-along-path.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animation, animate, animations, point, symbol, pushpin, marker, pin',
			created:'8/21/2020'
		},
		{
			title:'Pulse animation with bubble layer',
			desc:'This sample shows how to create a pulse animation using a bubble layer as a pulse.',
			path:'Animations/Pulse%20animation%20with%20bubble%20layer.html',
			sourcePath:'Animations/Pulse%20animation%20with%20bubble%20layer.html',
			screenshot:'Pulse-animation-with-bubble-layer.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbol, bubble',
			created:'4/14/2020'
		},
		{
			title:'Simple HTML Marker Animation',
			desc:'This sample shows how to animate the position of a HTML marker on the map by updating the coordinates.',
			path:'Animations/Simple%20HTML%20Marker%20Animation.html',
			sourcePath:'Animations/Simple%20HTML%20Marker%20Animation.html',
			screenshot:'Simple-HTML-Marker-Animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbol, pushpin, marker, pin',
			created:'9/23/2018'
		},
		{
			title:'Simple Symbol Animation',
			desc:'This sample shows how to animate the position of a symbol on the map by updating the coordinates.',
			path:'Animations/Simple%20Symbol%20Animation.html',
			sourcePath:'Animations/Simple%20Symbol%20Animation.html',
			screenshot:'Simple-Symbol-Animation.gif',
			keywords:'microsoft maps, map, gis, api, sdk, animate, animation, symbols, pushpins, markers, pins',
			created:'9/23/2018'
		},
	]
},
{
	category:'Bubble Layer',
	desc:'These samples demonstrate different ways to implement the bubble layer to render point based data.',
	samples: [
		{
			title:'Bubble Layer Options',
			desc:'This sample shows how the different options of the bubble layer affect rendering.',
			path:'Bubble%20Layer/Bubble%20Layer%20Options.html',
			sourcePath:'Bubble%20Layer/Bubble%20Layer%20Options.html',
			screenshot:'Bubble-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, circle, bubble, layer, data-driven, bubblelayer',
			created:'11/28/2018'
		},
		{
			title:'Cluster aggregates',
			desc:'This sample shows how to define custom properties on clusters that are defined using data-driven style expresison calculation. These calculations aggregate values across all points contained within the cluster.',
			path:'Bubble%20Layer/Cluster%20aggregates.html',
			sourcePath:'Bubble%20Layer/Cluster%20aggregates.html',
			screenshot:'Cluster-aggregates.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, bubbles, clustering, superclusterer, cluster aggregate',
			created:'8/5/2019'
		},
		{
			title:'Data-Driven Bubble Layer Styling',
			desc:'This sample shows how to use data-driven styles on a BubbleLayer to define the radius and color of each circle based on the magnitude of each data point.',
			path:'Bubble%20Layer/Data-Driven%20Bubble%20Layer%20Styling.html',
			sourcePath:'Bubble%20Layer/Data-Driven%20Bubble%20Layer%20Styling.html',
			screenshot:'Data-Driven-Bubble-Layer-Styling.png',
			keywords:'microsoft maps, map, gis, api, sdk, circle, bubble, layer, data-driven, bubblelayer, geojson, data driven styling, weather, earthquakes, usgs',
			created:'11/28/2018'
		},
		{
			title:'Point Clusters in Bubble Layer',
			desc:'This sample shows how to enable point based clustering on a data source and render them differently from individual points on the map.',
			path:'Bubble%20Layer/Point%20Clusters%20in%20Bubble%20Layer.html',
			sourcePath:'Bubble%20Layer/Point%20Clusters%20in%20Bubble%20Layer.html',
			screenshot:'Point-Clusters-in-Bubble-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, bubbles, clustering, superclusterer',
			created:'11/28/2018'
		},
	]
},
{
	category:'Controls',
	desc:'Add UI controls to the map to create an enhanced user experience.',
	samples: [
		{
			title:'Map Navigation Control Options',
			desc:'This sample shows all the map navigation controls on the map and how they react with different option settings.',
			path:'Controls/Map%20Navigation%20Control%20Options.html',
			sourcePath:'Controls/Map%20Navigation%20Control%20Options.html',
			screenshot:'Map-Navigation-Control-Options.gif',
			keywords:'microsoft maps, maps, map, api, sdk, gis, navigation controls, pan, zoom, pitch, tilt, rotate, satellite, aerial, imagery',
			created:'9/7/2018'
		},
		{
			title:'Map Style Picker',
			desc:'This sample shows how to add the map style picker control to the map.',
			path:'Controls/Map%20Style%20Picker.html',
			sourcePath:'Controls/Map%20Style%20Picker.html',
			screenshot:'Map-Style-Picker.png',
			keywords:'microsoft maps, map, gis, api, sdk,  navigation controls, map style, style picker, map type, satellite, aerial, imagery',
			created:'3/6/2019'
		},
	]
},
{
	category:'Custom Modules',
	desc:'Use custom modules to extend the functionality of the Azure Maps Web SDK.',
	samples: [
		{
			title:'Bring Data Into View Control',
			desc:'This sample shows how to create a simple custom control that centers and zooms the map to fit any data that is loaded on the map.',
			path:'Custom%20Modules/Bring%20Data%20Into%20View%20Control/Bring%20Data%20Into%20View%20Control.html',
			sourcePath:'Custom%20Modules/Bring%20Data%20Into%20View%20Control',
			screenshot:'Bring-Data-Into-View-Control.png',
			keywords:'microsoft maps, map, gis, api, sdk, ',
			created:'3/8/2019'
		},
		{
			title:'Draw Line',
			desc:'This sample shows how to create a custom drawing tool for lines.',
			path:'Custom%20Modules/Custom%20Drawing%20Tools/Draw%20Line.html',
			sourcePath:'Custom%20Modules/Custom%20Drawing%20Tools',
			screenshot:'Draw-Line.gif',
			keywords:'microsoft maps, map, gis, api, sdk, line, linestring, polyline, drawing, draw',
			created:'10/9/2018'
		},
		{
			title:'Draw Polygon',
			desc:'This sample shows how to create a custom drawing tool for polygons.',
			path:'Custom%20Modules/Custom%20Drawing%20Tools/Draw%20Polygon.html',
			sourcePath:'Custom%20Modules/Custom%20Drawing%20Tools',
			screenshot:'Draw-Polygon.gif',
			keywords:'microsoft maps, map, gis, api, sdk, polygon, drawing, draw',
			created:'9/23/2018'
		},
		{
			title:'Create a Fullscreen Control',
			desc:'This sample shows how to create a custom fullscreen control that can be added to the map. In this case a control for toggling the map between its specified size in the page and fullscreen mode.',
			path:'Custom%20Modules/Fullscreen%20Control/Fullscreen%20Control.html',
			sourcePath:'Custom%20Modules/Fullscreen%20Control',
			screenshot:'Fullscreen-Control.png',
			keywords:'microsoft maps, maps, map, api, sdk, gis, custom, control, custom control, fullscreen, full screen',
			created:'3/6/2019'
		},
		{
			title:'Geolocation Control Options',
			desc:'This sample shows all the options of the geolocation control.',
			path:'Custom%20Modules/Geolocation%20Control/Geolocation%20control%20options.html',
			sourcePath:'Custom%20Modules/Geolocation%20Control',
			screenshot:'Geolocation-Control-Options.png',
			keywords:'microsoft maps, maps, map, api, sdk, gis, custom, control, custom control, geolocation, user, location, position, tracking, gps, gps tracking',
			created:'9/19/2019'
		},
		{
			title:'Create a Geolocation Control',
			desc:'',
			path:'Custom%20Modules/Geolocation%20Control/Geolocation%20Control.html',
			sourcePath:'Custom%20Modules/Geolocation%20Control',
			screenshot:'Geolocation-Control.png',
			keywords:'microsoft maps, maps, map, api, sdk, gis, custom, control, custom control, geolocation, user, location, position, tracking, gps, gps tracking',
			created:'9/19/2019'
		},
		{
			title:'Synchronize map views',
			desc:'This sample shows how to synchronize the views of two or more maps.',
			path:'Custom%20Modules/Map%20Synchronizer%20Module/Synchronize%20map%20views.html',
			sourcePath:'Custom%20Modules/Map%20Synchronizer%20Module',
			screenshot:'Synchronize-map-views.png',
			keywords:'microsoft maps, map, gis, api, sdk, synchronized maps',
			created:'4/15/2019'
		},
		{
			title:'Simple Scale Bar Control',
			desc:'This sample shows how to create a custom scale bar control that can be added to the map.',
			path:'Custom%20Modules/Simple%20Scale%20Bar%20Control/Simple%20Scale%20Bar%20Control.html',
			sourcePath:'Custom%20Modules/Simple%20Scale%20Bar%20Control',
			screenshot:'Simple-Scale-Bar-Control.png',
			keywords:'microsoft maps, maps, map, api, sdk, gis, custom, control, custom control, scale bar, scalebar',
			created:'3/6/2019'
		},
		{
			title:'Expanding Spider Clusters',
			desc:'This sample shows how to visualize the contents of a cluster as a expanded spider cluster layout.',
			path:'Custom%20Modules/Spider%20Clusters/Expanding%20Spider%20Clusters.html',
			sourcePath:'Custom%20Modules/Spider%20Clusters',
			screenshot:'Expanding-Spider-Clusters.gif',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, bubbles, clustering, superclusterer, spider',
			created:'2/28/2019'
		},
		{
			title:'Spyglass map visualization',
			desc:'This sample shows how to add a spyglass data viewer to the map.',
			path:'Custom%20Modules/Spyglass%20module/Spyglass%20map%20visualization.html',
			sourcePath:'Custom%20Modules/Spyglass%20module',
			screenshot:'Spyglass-map-visualization.png',
			keywords:'microsoft maps, map, gis, api, sdk, spyglass, synchronized maps, magnifying glass',
			created:'4/16/2019'
		},
		{
			title:'Spyglass module options',
			desc:'This sample shows how all the options of the spyglass module can be used to customize the user experience.',
			path:'Custom%20Modules/Spyglass%20module/Spyglass%20module%20options.html',
			sourcePath:'Custom%20Modules/Spyglass%20module',
			screenshot:'Spyglass-module-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, spyglass, synchronized maps, magnifying glass',
			created:'4/16/2019'
		},
		{
			title:'Swipe between two maps',
			desc:'This sample shows how to swipe between two overlapping synchronized maps to view different data sets.',
			path:'Custom%20Modules/Swipe%20map%20module/Swipe%20between%20two%20maps.html',
			sourcePath:'Custom%20Modules/Swipe%20map%20module',
			screenshot:'Swipe-between-two-maps.png',
			keywords:'microsoft maps, map, gis, api, sdk, synchronized maps, swipe map',
			created:'4/15/2019'
		},
		{
			title:'Swipe map module options',
			desc:'This sample shows how to swipe between two overlapping synchronized maps to view different data sets.',
			path:'Custom%20Modules/Swipe%20map%20module/Swipe%20map%20module%20options.html',
			sourcePath:'Custom%20Modules/Swipe%20map%20module',
			screenshot:'Swipe-map-module-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, synchronized maps, swipe map',
			created:'4/15/2019'
		},
		{
			title:'Create a Traffic Control',
			desc:'This sample shows how to create a custom traffic control that can be added to the map.',
			path:'Custom%20Modules/Traffic%20Control/Traffic%20Control.html',
			sourcePath:'Custom%20Modules/Traffic%20Control',
			screenshot:'Traffic-Control.png',
			keywords:'microsoft maps, maps, map, api, sdk, gis, custom, control, custom control, traffic',
			created:'9/18/2019'
		},
	]
},
{
	category:'Demos',
	desc:'These samples demonstrate real-life scenarios or highlight key topics.',
	samples: [
		{
			title:'Car vs Truck Route',
			desc:'This sample compares the route a truck has to take to the route a car can take.',
			path:'Demos/Car%20vs%20Truck%20Route.html',
			sourcePath:'Demos/Car%20vs%20Truck%20Route.html',
			screenshot:'Car-vs-Truck-Route.png',
			keywords:'microsoft maps, map, gis, api, sdk, truck, car, routing, route, directions',
			created:'9/23/2018'
		},
		{
			title:'Create a Choropleth Map',
			desc:'This sample shows how to create a choropleth map. A choropleth map is a thematic map in which areas are shaded or patterned in proportion to the measurement of the statistical variable being displayed on the map.',
			path:'Demos/Create%20a%20Choropleth%20Map.html',
			sourcePath:'Demos/Create%20a%20Choropleth%20Map.html',
			screenshot:'Create-a-Choropleth-Map.png',
			keywords:'microsoft maps, map, gis, api, sdk, thematic, choropleth, heatmap, heat map',
			created:'10/8/2018'
		},
		{
			title:'Data-Driven Styling',
			desc:'This sample shows some basics around data-driven styling of layers in Azure Maps.',
			path:'Demos/Data-Driven%20Styling.html',
			sourcePath:'Demos/Data-Driven%20Styling.html',
			screenshot:'Data-Driven-Styling.png',
			keywords:'microsoft maps, map, gis, api, sdk, circle, bubble, layers, data-driven, bubblelayer, geojson, data driven styling',
			created:'1/25/2019'
		},
		{
			title:'Large GeoJSON Files',
			desc:'This sample demonstrates loading large GeoJSON files into the Azure Maps web control.',
			path:'Demos/Large%20GeoJSON%20Files.html',
			sourcePath:'Demos/Large%20GeoJSON%20Files.html',
			screenshot:'Large-GeoJSON-Files.png',
			keywords:'microsoft maps, map, gis, api, sdk, symbol, pushpin, marker, pin, line, linestring, polygon, parcels',
			created:'9/23/2018'
		},
	]
},
{
	category:'Device Sensors',
	desc:'See how to access sensors from a devices browser and use them with Azure Maps.',
	samples: [
		{
			title:'Continuous User Position Tracking',
			desc:'This sample shows how to continuously get the users position information from the browser by using the HTML5 geolocation API and update it on a map.',
			path:'Device%20Sensors/Continuous%20User%20Position%20Tracking.html',
			sourcePath:'Device%20Sensors/Continuous%20User%20Position%20Tracking.html',
			screenshot:'',
			keywords:'microsoft maps, map, gis, api, sdk, geolocation, user, location, position, tracking, gps, gps tracking',
			created:'9/30/2018'
		},
		{
			title:'Show a Users Position',
			desc:'This sample shows how to get the users position information from the browser by using the HTML5 geolocation API and show it on a map.',
			path:'Device%20Sensors/Show%20a%20Users%20Position.html',
			sourcePath:'Device%20Sensors/Show%20a%20Users%20Position.html',
			screenshot:'',
			keywords:'microsoft maps, map, gis, api, sdk, geolocation, user, location, position, gps',
			created:'9/30/2018'
		},
		{
			title:'User Location Accuracy Circle',
			desc:'This sample shows how to display the users position on the map with an accuracy circle.',
			path:'Device%20Sensors/User%20Position%20Accuracy%20Circle.html',
			sourcePath:'Device%20Sensors/User%20Position%20Accuracy%20Circle.html',
			screenshot:'User-Position-Accuracy-Circle.png',
			keywords:'microsoft maps, map, gis, api, sdk, accuracy, circle, geolocation, user, location, position, gps',
			created:'9/30/2018'
		},
	]
},
{
	category:'Drawing Tools Module',
	desc:'Add mouse and touch based drawing capabilities to the map.',
	samples: [
		{
			title:'Add drawing toolbar to map',
			desc:'This sample shows how to use the Drawing Tools module and display the drawing toolbar on the map.',
			path:'Drawing%20Tools%20Module/Add%20drawing%20toolbar%20to%20map.html',
			sourcePath:'Drawing%20Tools%20Module/Add%20drawing%20toolbar%20to%20map.html',
			screenshot:'Add-drawing-toolbar-to-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, circle, rectangle, polygon, linestring, point, marker, paint',
			created:'5/4/2019'
		},
		{
			title:'Change drawing rendering style',
			desc:'This sample shows how to customize the rendering of the drawing shapes in the drawing manager by accessing the rendering layers using the drawingManager.getLayers() function.',
			path:'Drawing%20Tools%20Module/Change%20drawing%20rendering%20style.html',
			sourcePath:'Drawing%20Tools%20Module/Change%20drawing%20rendering%20style.html',
			screenshot:'Change-drawing-rendering-style.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, drawing manager, paint, customize',
			created:'5/4/2019'
		},
		{
			title:'Create a measuring tool',
			desc:'This sample shows how to use the drawing tools to measure distances and areas. ',
			path:'Drawing%20Tools%20Module/Create%20a%20measuring%20tool.html',
			sourcePath:'Drawing%20Tools%20Module/Create%20a%20measuring%20tool.html',
			screenshot:'Create-a-measuring-tool.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, circle, rectangle, polygon, paint, events, measuring tape, measure',
			created:'12/10/2019'
		},
		{
			title:'Draw and search polygon area',
			desc:'This sample shows how to use the drawing tools to search for points of interests within drawn areas.',
			path:'Drawing%20Tools%20Module/Draw%20and%20search%20polygon%20area.html',
			sourcePath:'Drawing%20Tools%20Module/Draw%20and%20search%20polygon%20area.html',
			screenshot:'Draw-and-search-polygon-area.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, circle, rectangle, polygon, paint, events, services, module, search, points of interest, poi, within, intersects, intersection',
			created:'12/10/2019'
		},
		{
			title:'Draw gridded polygon',
			desc:'This sample shows how to calculate a gridded pattern within a drawn polygon based on a physical distances. ',
			path:'Drawing%20Tools%20Module/Draw%20gridded%20polygon.html',
			sourcePath:'Drawing%20Tools%20Module/Draw%20gridded%20polygon.html',
			screenshot:'Draw-gridded-polygon.png',
			keywords:'map, gis, api, sdk, drawing tools, circle, rectangle, polygon, paint, events',
			created:'1/2/2020'
		},
		{
			title:'Drawing manager options',
			desc:'This sample shows how the different options of the drawing manager change the user experience.',
			path:'Drawing%20Tools%20Module/Drawing%20manager%20options.html',
			sourcePath:'Drawing%20Tools%20Module/Drawing%20manager%20options.html',
			screenshot:'Drawing-manager-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, drawing manager, drawing mode, interaction type, freehand interval',
			created:'5/4/2019'
		},
		{
			title:'Drawing toolbar options',
			desc:'This sample shows how the different options of the drawing toolbar change the user experience.',
			path:'Drawing%20Tools%20Module/Drawing%20toolbar%20options.html',
			sourcePath:'Drawing%20Tools%20Module/Drawing%20toolbar%20options.html',
			screenshot:'Drawing-toolbar-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, drawing manager, toolbar, drawing toolbar',
			created:'12/10/2019'
		},
		{
			title:'Drawing tools events',
			desc:'This sample shows how the events in the Drawing Tools module work.',
			path:'Drawing%20Tools%20Module/Drawing%20tools%20events.html',
			sourcePath:'Drawing%20Tools%20Module/Drawing%20tools%20events.html',
			screenshot:'Drawing-tools-events.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, paint, events',
			created:'12/10/2019'
		},
		{
			title:'Get drawn shapes from drawing manager',
			desc:'This sample shows how to get the shapes that have been drawn on the map using the drawing managers drawingManager.getSource() function.',
			path:'Drawing%20Tools%20Module/Get%20drawn%20shapes%20from%20drawing%20manager.html',
			sourcePath:'Drawing%20Tools%20Module/Get%20drawn%20shapes%20from%20drawing%20manager.html',
			screenshot:'Get-drawn-shapes-from-drawing-manager.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, drawing manager, paint, shapes',
			created:'5/4/2019'
		},
		{
			title:'Select data in drawn polygon area',
			desc:'This sample shows how to use the drawing tools to draw polygon areas on the map and select points that are within them. ',
			path:'Drawing%20Tools%20Module/Select%20data%20in%20drawn%20polygon%20area.html',
			sourcePath:'Drawing%20Tools%20Module/Select%20data%20in%20drawn%20polygon%20area.html',
			screenshot:'Select-data-in-drawn-polygon-area.png',
			keywords:'microsoft maps, map, gis, api, sdk, drawing tools, circle, rectangle, polygon, paint, events, within, intersects, intersection',
			created:'12/10/2019'
		},
		{
			title:'Snap drawn line to roads',
			desc:'This sample shows how to snap a line drawn using the draiwng tools to the road network. ',
			path:'Drawing%20Tools%20Module/Snap%20drawn%20line%20to%20roads.html',
			sourcePath:'Drawing%20Tools%20Module/Snap%20drawn%20line%20to%20roads.html',
			screenshot:'Snap-drawn-line-to-roads.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, route, directions, snap to roads, snapping, gps traces, gps trace, snap to road',
			created:'1/31/2020'
		},
	]
},
{
	category:'Geospatial Files',
	desc:'Examples of how to import and export common geospatial file formats with Azure Maps. See also the <a href="#Spatial-IO-Module">Spatial IO module samples</a>.',
	samples: [
		{
			title:'Add TopoJSON data to the map',
			desc:'This sample shows how to add TopoJSON data to the map, by converting it into GeoJSON in a Web Worker so that map can easily render it.',
			path:'Geospatial%20Files/Add%20TopoJSON%20data%20to%20the%20map.html',
			sourcePath:'Geospatial%20Files/Add%20TopoJSON%20data%20to%20the%20map.html',
			screenshot:'Add-TopoJSON-data-to-the-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, topojson',
			created:'3/18/2019'
		},
		{
			title:'Drag and Drop GeoJSON File onto Map',
			desc:'This sample shows how load add support for dragging and dropping GeoJSON files on to the map and having them render.',
			path:'Geospatial%20Files/Drag%20and%20Drop%20GeoJSON%20File%20onto%20Map.html',
			sourcePath:'Geospatial%20Files/Drag%20and%20Drop%20GeoJSON%20File%20onto%20Map.html',
			screenshot:'Drag-and-Drop-GeoJSON-File-onto-Map.gif',
			keywords:'microsoft maps, map, gis, api, sdk, geojson, drag, drop, dropover, filereader',
			created:'10/7/2018'
		},
		{
			title:'Drag and Drop Shapefiles onto the Map',
			desc:'This sample shows how to load zipped shapefile (.shp, .dbf, .prj) files onto the map by  dragging and dropping from a local file.',
			path:'Geospatial%20Files/Drag%20and%20Drop%20Shapefiles%20onto%20the%20Map.html',
			sourcePath:'Geospatial%20Files/Drag%20and%20Drop%20Shapefiles%20onto%20the%20Map.html',
			screenshot:'Drag-and-Drop-Shapefiles-onto-the-Map.gif',
			keywords:'microsoft maps, map, gis, api, sdk, esri shapefiles, shapefiles, shp, dbf, ogc, web worker, drag, drop, dropover, filereader',
			created:'2/20/2019'
		},
		{
			title:'Extract and display photo location',
			desc:'This sample shows how to extract location information from images from a URL or by dragging and dropping them onto the map, and display them on the map. ',
			path:'Geospatial%20Files/Extract%20and%20display%20photo%20location.html',
			sourcePath:'Geospatial%20Files/Extract%20and%20display%20photo%20location.html',
			screenshot:'Extract-and-display-photo-location.png',
			keywords:'microsoft maps, map, gis, api, sdk, exif, gps, location, jpg, jpeg, tiff, image, photo',
			created:'1/22/2019'
		},
		{
			title:'Load large Shapefiles using a Web Worker',
			desc:'This sample shows how to load large shapefiles (.shp, .dbf, .prj) onto the map using a web worker so that it doesn\'t freeze the UI.',
			path:'Geospatial%20Files/Load%20large%20Shapefiles%20using%20a%20Web%20Worker.html',
			sourcePath:'Geospatial%20Files/Load%20large%20Shapefiles%20using%20a%20Web%20Worker.html',
			screenshot:'Load-large-Shapefiles-using-a-Web-Worker.png',
			keywords:'microsoft maps, map, gis, api, sdk, esri shapefiles, shapefiles, shp, dbf, ogc, web worker',
			created:'2/20/2019'
		},
		{
			title:'Load Shapefiles onto the Map',
			desc:'This sample shows how to easily load shapefiles (.shp, .dbf, .prj) onto the map.',
			path:'Geospatial%20Files/Load%20Shapefiles%20onto%20the%20Map.html',
			sourcePath:'Geospatial%20Files/Load%20Shapefiles%20onto%20the%20Map.html',
			screenshot:'Load-Shapefiles-onto-the-Map.png',
			keywords:'microsoft maps, map, gis, api, sdk, esri shapefiles, shapefiles, shp, dbf, ogc',
			created:'2/20/2019'
		},
	]
},
{
	category:'Heat Map Layer',
	desc:'Heat maps are a type of data visualization used to represent the density of data using a range of colors. They\'re often used to show the data "hot spots" on a map and are a great way to render large point data sets.',
	samples: [
		{
			title:'Cluster weighted Heat Map',
			desc:'This sample shows how to create a heat map that uses clustering on the data source to improve performance for large data sets. ',
			path:'Heat%20Map%20Layer/Cluster%20weighted%20Heat%20Map.html',
			sourcePath:'Heat%20Map%20Layer/Cluster%20weighted%20Heat%20Map.html',
			screenshot:'Cluster-weighted-Heat-Map.png',
			keywords:'microsoft maps, map, gis, api, sdk, heatmap, heat map, heatmaps, heat maps, density, layer, thermatic, clustering, superclusterer',
			created:'3/27/2019'
		},
		{
			title:'Consistent zoomable Heat Map',
			desc:'This sample shows how to create a heat map where the radius of each data point covers the same physical area on the ground and creates a more consistent user experience when zooming the map.',
			path:'Heat%20Map%20Layer/Consistent%20zoomable%20Heat%20Map.html',
			sourcePath:'Heat%20Map%20Layer/Consistent%20zoomable%20Heat%20Map.html',
			screenshot:'Consistent-zoomable-Heat-Map.gif',
			keywords:'microsoft maps, map, gis, api, sdk, heatmap, heat map, heatmaps, heat maps, density, layer, thermatic',
			created:'4/1/2019'
		},
		{
			title:'Heat Map Layer Options',
			desc:'This sample shows how the different options of the heat map affect rendering.',
			path:'Heat%20Map%20Layer/Heat%20Map%20Layer%20Options.html',
			sourcePath:'Heat%20Map%20Layer/Heat%20Map%20Layer%20Options.html',
			screenshot:'Heat-Map-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, heatmap, heat map, heatmaps, heat maps, density, thermatic, layer',
			created:'11/28/2018'
		},
		{
			title:'Simple Heat Map Layer',
			desc:'This sample shows how to create a simple heat map from a data set of point features.',
			path:'Heat%20Map%20Layer/Simple%20Heat%20Map%20Layer.html',
			sourcePath:'Heat%20Map%20Layer/Simple%20Heat%20Map%20Layer.html',
			screenshot:'Simple-Heat-Map-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, heatmap, heat map, heatmaps, heat maps, density, layer, thermatic',
			created:'11/28/2018'
		},
		{
			title:'Weighted Heat Map Layer',
			desc:'This sample shows how to create a heat map which defines the intensity of each data point based on a property.',
			path:'Heat%20Map%20Layer/Weighted%20Heat%20Map%20Layer.html',
			sourcePath:'Heat%20Map%20Layer/Weighted%20Heat%20Map%20Layer.html',
			screenshot:'Weighted-Heat-Map-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, heatmap, heat map, heatmaps, heat maps, density, layer, thermatic',
			created:'4/10/2019'
		},
	]
},
{
	category:'HTML Markers',
	desc:'Use traditional HTML and CSS to represent point based data on the map as markers.',
	samples: [
		{
			title:'All built-in icon templates as HTML markers',
			desc:'This sample shows all the built-in icon templates rendered as HTML markers.',
			path:'HTML%20Markers/All%20built-in%20icon%20templates%20as%20HTML%20markers.html',
			sourcePath:'HTML%20Markers/All%20built-in%20icon%20templates%20as%20HTML%20markers.html',
			screenshot:'All-built-in-icon-templates-as-HTML-markers.png',
			keywords:'microsoft maps, map, gis, api, sdk, html markers, markers, pins, pushpins, symbols, style, svg, template, svg template, image template',
			created:'7/5/2019'
		},
		{
			title:'CSS Styled HTML Marker',
			desc:'This sample shows how to use CSS and HTML to create a marker on the map.',
			path:'HTML%20Markers/CSS%20Styled%20HTML%20Marker.html',
			sourcePath:'HTML%20Markers/CSS%20Styled%20HTML%20Marker.html',
			screenshot:'CSS-Styled-HTML-Marker.gif',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, style, css, animate, animation, animations',
			created:'11/28/2018'
		},
		{
			title:'Draggable HTML Marker',
			desc:'This sample shows how to make an HTML marker draggable.',
			path:'HTML%20Markers/Draggable%20HTML%20Marker.html',
			sourcePath:'HTML%20Markers/Draggable%20HTML%20Marker.html',
			screenshot:'Draggable-HTML-Marker.gif',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, drag, draggable, mouse',
			created:'11/28/2018'
		},
		{
			title:'HTML Marker events',
			desc:'This sample shows how to add events to an HTML marker.',
			path:'HTML%20Markers/HTML%20Marker%20events.html',
			sourcePath:'HTML%20Markers/HTML%20Marker%20events.html',
			screenshot:'HTML-Marker-events.gif',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, events, mouse',
			created:'11/28/2018'
		},
		{
			title:'HTML Marker with built-in icon template',
			desc:'This sample shows how use image templates with an HTML marker.',
			path:'HTML%20Markers/HTML%20Marker%20with%20built-in%20icon%20template.html',
			sourcePath:'HTML%20Markers/HTML%20Marker%20with%20built-in%20icon%20template.html',
			screenshot:'HTML-Marker-with-built-in-icon-template.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, symbols, markers, pins, pushpins, styling, style, layer, icons, image template',
			created:'7/5/2019'
		},
		{
			title:'HTML Marker with Custom SVG Template',
			desc:'This sample shows how to create a custom SVG template and use it with the HtmlMarker class. ',
			path:'HTML%20Markers/HTML%20Marker%20with%20Custom%20SVG%20Template.html',
			sourcePath:'HTML%20Markers/HTML%20Marker%20with%20Custom%20SVG%20Template.html',
			screenshot:'HTML-Marker-with-Custom-SVG-Template.gif',
			keywords:'microsoft maps, map, gis, api, sdk, html markers, markers, pins, pushpins, symbols, style, svg, template, svg template',
			created:'11/28/2018'
		},
		{
			title:'Simple HTML Marker',
			desc:'This sample shows how create a simple HtmlMarker and add it to the map.',
			path:'HTML%20Markers/Simple%20HTML%20Marker.html',
			sourcePath:'HTML%20Markers/Simple%20HTML%20Marker.html',
			screenshot:'Simple-HTML-Marker.png',
			keywords:'microsoft maps, map, gis, api, sdk, html markers, markers, pins, pushpins, symbols, style, svg, template, svg template',
			created:'11/28/2018'
		},
		{
			title:'Clustered Pie Chart HTML Markers',
			desc:'This sample combines the HtmlMarkerLayer class with the PieChartMarker class to create pie charts for clustered markers on the map.',
			path:'HTML%20Markers/HtmlMarkerLayer/Clustered%20Pie%20Chart%20HTML%20Markers.html',
			sourcePath:'HTML%20Markers/HtmlMarkerLayer',
			screenshot:'Clustered-Pie-Chart-HTML-Markers.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, bubbles, clustering, superclusterer, html marker layer, svg template, chart, pie chart',
			created:'7/5/2019'
		},
		{
			title:'HTML Marker Layer',
			desc:'This sample provides a layer which renders point data from a data source as HTML markers on the map.',
			path:'HTML%20Markers/HtmlMarkerLayer/HTML%20Marker%20Layer.html',
			sourcePath:'HTML%20Markers/HtmlMarkerLayer',
			screenshot:'HTML-Marker-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, clustering, superclusterer, html marker layer',
			created:'7/5/2019'
		},
		{
			title:'Pie Chart HTML Markers',
			desc:'This sample shows how to create HtmlMarkers that look like scaled pie charts using inline SVG\'s. Click on a marker to view the data for each piece of a pie in a chart.',
			path:'HTML%20Markers/Pie%20Chart%20HTML%20Marker/Pie%20Chart%20HTML%20Markers.html',
			sourcePath:'HTML%20Markers/Pie%20Chart%20HTML%20Marker',
			screenshot:'Pie-Chart-HTML-Markers.png',
			keywords:'microsoft maps, map, gis, api, sdk, html markers, markers, pins, pushpins, symbols, style, svg, template, svg template, chart, pie chart',
			created:'11/28/2018'
		},
	]
},
{
	category:'Image Layer',
	desc:'See how to overlay images on the map as a layer.',
	samples: [
		{
			title:'Cross reference pixels in image layer',
			desc:'This sample shows how to cross reference pixel positions on a source image with the position of an image overlay on a map.',
			path:'Image%20Layer/Cross%20reference%20pixels%20in%20image%20layer.html',
			sourcePath:'Image%20Layer/Cross%20reference%20pixels%20in%20image%20layer.html',
			screenshot:'Cross-reference-pixels-in-image-layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, image, raster, layer, ground overlay, groundoverlay',
			created:'7/5/2019'
		},
		{
			title:'Image Layer Options',
			desc:'This sample shows how the different options of the image layer affect rendering.',
			path:'Image%20Layer/Image%20Layer%20Options.html',
			sourcePath:'Image%20Layer/Image%20Layer%20Options.html',
			screenshot:'Image-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, image, raster, layer, ground overlay, groundoverlay',
			created:'11/28/2018'
		},
		{
			title:'KML Ground Overlay as Image Layer',
			desc:'This sample shows how to overlay KML Ground Overlay information as an image layer on the map.',
			path:'Image%20Layer/KML%20Ground%20Overlay%20as%20Image%20Layer.html',
			sourcePath:'Image%20Layer/KML%20Ground%20Overlay%20as%20Image%20Layer.html',
			screenshot:'KML-Ground-Overlay-as-Image-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, image, raster, kml, layer, ground overlay, groundoverlay',
			created:'11/28/2018'
		},
		{
			title:'Simple Image Layer',
			desc:'This sample shows how to overlay an image on the map as an Image layer.',
			path:'Image%20Layer/Simple%20Image%20Layer.html',
			sourcePath:'Image%20Layer/Simple%20Image%20Layer.html',
			screenshot:'Simple-Image-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, image, raster, layer, ground overlay, groundoverlay',
			created:'11/28/2018'
		},
	]
},
{
	category:'Line Layer',
	desc:'Learn how to visualize line and path data on the map using the line layer.',
	samples: [
		{
			title:'Add Arrow along a Path',
			desc:'This sample shows how to add arrow icons along a line on the map. ',
			path:'Line%20Layer/Add%20Arrows%20along%20a%20Path.html',
			sourcePath:'Line%20Layer/Add%20Arrows%20along%20a%20Path.html',
			screenshot:'Add-Arrows-along-a-Path.png',
			keywords:'microsoft maps, map, gis, api, sdk, linestring, arrows, path, symbols, linelayer',
			created:'11/22/2019'
		},
		{
			title:'Add arrows to end of paths',
			desc:'This sample shows how to add arrow icons along a line on the map. ',
			path:'Line%20Layer/Add%20arrows%20to%20end%20of%20paths.html',
			sourcePath:'Line%20Layer/Add%20arrows%20to%20end%20of%20paths.html',
			screenshot:'Add-arrows-to-end-of-paths.png',
			keywords:'microsoft maps, map, gis, api, sdk, linestring, arrows, path, symbols, linelayer',
			created:'11/22/2019'
		},
		{
			title:'Data-driven stroke gradient',
			desc:'This sample shows how to create a path between a set of data points can apply a stroke gradient based on properties in each data point.',
			path:'Line%20Layer/Data-driven%20stroke%20gradient.html',
			sourcePath:'Line%20Layer/Data-driven%20stroke%20gradient.html',
			screenshot:'Data-driven-stroke-gradient.png',
			keywords:'microsoft maps, map, gis, api, sdk, line, linestring, polyline, layer, stroke gradient, gradient, linelayer, data-driven, data driven styling',
			created:'11/22/2019'
		},
		{
			title:'Line Layer Options',
			desc:'This sample shows how the different options of the line layer affect rendering.',
			path:'Line%20Layer/Line%20Layer%20Options.html',
			sourcePath:'Line%20Layer/Line%20Layer%20Options.html',
			screenshot:'Line-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, line, linestring, polyline, layer, linelayer',
			created:'11/22/2019'
		},
		{
			title:'Line layer with built-in icon template',
			desc:'This sample shows how to use a built-in icon templates with a line layer.',
			path:'Line%20Layer/Line%20layer%20with%20built-in%20icon%20template.html',
			sourcePath:'Line%20Layer/Line%20layer%20with%20built-in%20icon%20template.html',
			screenshot:'Line-layer-with-built-in-icon-template.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, linestring, arrows, path, symbols, linelayer, image template',
			created:'11/22/2019'
		},
		{
			title:'Line with Stroke Gradient',
			desc:'This sample shows how to apply a stroke gradient to a line on the map.',
			path:'Line%20Layer/Line%20with%20Stroke%20Gradient.html',
			sourcePath:'Line%20Layer/Line%20with%20Stroke%20Gradient.html',
			screenshot:'Line-with-Stroke-Gradient.png',
			keywords:'microsoft maps, map, gis, api, sdk, line, linestring, polyline, layer, stroke gradient, gradient, linelayer',
			created:'11/22/2019'
		},
	]
},
{
	category:'Map',
	desc:'These samples show how to use the many different features of the map.',
	samples: [
		{
			title:'Add a Context Menu to the Map',
			desc:'This sample shows how to display a context menu when the user right clicks the map.',
			path:'Map/Add%20a%20Context%20Menu%20to%20the%20Map.html',
			sourcePath:'Map/Add%20a%20Context%20Menu%20to%20the%20Map.html',
			screenshot:'Add-a-Context-Menu-to-the-Map.png',
			keywords:'microsoft maps, map, gis, api, sdk, context menu, popup, right click, mouse',
			created:'10/8/2018'
		},
		{
			title:'Add custom icon template to atlas namespace',
			desc:'This sample shows how to add more image templates to the atlas namespace.',
			path:'Map/Add%20custom%20icon%20template%20to%20atlas%20namespace.html',
			sourcePath:'Map/Add%20custom%20icon%20template%20to%20atlas%20namespace.html',
			screenshot:'Add-custom-icon-template-to-atlas-namespace.png',
			keywords:'microsoft maps, map, gis, api, sdk, image template, symbology, symbols',
			created:'7/5/2019'
		},
		{
			title:'DataSource and Shape events',
			desc:'This sample shows how to the DataSource and Shape events work.',
			path:'Map/DataSource%20and%20Shape%20events.html',
			sourcePath:'Map/DataSource%20and%20Shape%20events.html',
			screenshot:'DataSource-and-Shape-events.png',
			keywords:'microsoft maps, map, gis, api, sdk, events, data source, datasource, shapes',
			created:'12/6/2019'
		},
		{
			title:'Detect if browser is supported',
			desc:'This sample shows how to detect if the browser is supported by the Azure Maps Web SDK. If it is, load the map, otherwise fallback gracefully.',
			path:'Map/Detect%20if%20browser%20is%20supported.html',
			sourcePath:'Map/Detect%20if%20browser%20is%20supported.html',
			screenshot:'Detect-if-browser-is-supported.png',
			keywords:'microsoft maps, map, gis, api, sdk, browser support, supported browsers',
			created:'6/14/2019'
		},
		{
			title:'Full Screen Map',
			desc:'This sample shows how to toggle between displaying the standard page layout, and a full screen map view.',
			path:'Map/Full%20Screen%20Map.html',
			sourcePath:'Map/Full%20Screen%20Map.html',
			screenshot:'Full-Screen-Map.png',
			keywords:'microsoft maps, map, gis, api, sdk, full, screen',
			created:'5/4/2018'
		},
		{
			title:'Icon template options',
			desc:'This sample shows how the icon template options effect the rendering of built-in icon templates.',
			path:'Map/Icon%20template%20options.html',
			sourcePath:'Map/Icon%20template%20options.html',
			screenshot:'Icon-template-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, icon templates, symbols, fill patterns, image template',
			created:'7/5/2019'
		},
		{
			title:'Inspect features under the mouse',
			desc:'This sample shows how to access any rendered feature on the map, whether it came from a vector tile source, a GeoJSON file, or is part of the base map.',
			path:'Map/Inspect%20features%20under%20the%20mouse.html',
			sourcePath:'Map/Inspect%20features%20under%20the%20mouse.html',
			screenshot:'Inspect-features-under-the-mouse.png',
			keywords:'microsoft maps, map, gis, api, sdk, vector tiles, inspect features, base map, basemap, access roads',
			created:'4/9/2020'
		},
		{
			title:'Lazy Load the Map',
			desc:'This sample shows how to delay the loading of the map SDK until it is needed.',
			path:'Map/Lazy%20Load%20the%20Map.html',
			sourcePath:'Map/Lazy%20Load%20the%20Map.html',
			screenshot:'',
			keywords:'microsoft maps, map, gis, api, sdk, lazy load, reduce cost, tabs',
			created:'5/4/2018'
		},
		{
			title:'Limit Map to Two Finger Panning',
			desc:'This sample shows how to limit the map drag functionality such that the user is only able to drag the map when using two fingers. This is useful when using the map API inside of mobile apps where the user is likely to scroll the page using a single finger.',
			path:'Map/Limit%20Map%20to%20Two%20Finger%20Panning.html',
			sourcePath:'Map/Limit%20Map%20to%20Two%20Finger%20Panning.html',
			screenshot:'Limit-Map-to-Two-Finger-Panning.png',
			keywords:'microsoft maps, map, gis, api, sdk, two finger panning, dragging, panning, map, user interaction, dragpaninteraction',
			created:'3/8/2019'
		},
		{
			title:'Limit Scroll Wheel Zoom',
			desc:'This sample shows how to limit the scroll zooming functionality of the map such that the map will only be zoomed when the CTRL key is pressed. When the CTRL key is not pressed, the scroll wheel will scroll the page when over the map.',
			path:'Map/Limit%20Scroll%20Wheel%20Zoom.html',
			sourcePath:'Map/Limit%20Scroll%20Wheel%20Zoom.html',
			screenshot:'Limit-Scroll-Wheel-Zoom.png',
			keywords:'microsoft maps, map, gis, api, sdk, mouse wheel, mousewheel, scroll page, map, user interaction, scrollzoominteraction',
			created:'3/8/2019'
		},
		{
			title:'Load Map with Options',
			desc:'This sample shows how to load the map and specify options at the same time.',
			path:'Map/Load%20Map%20with%20Options.html',
			sourcePath:'Map/Load%20Map%20with%20Options.html',
			screenshot:'Load-Map-with-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, multiple',
			created:'5/4/2018'
		},
		{
			title:'Map Events',
			desc:'This sample will highlight the name of the events that are firing as you interact with the map.',
			path:'Map/Map%20Events.html',
			sourcePath:'Map/Map%20Events.html',
			screenshot:'Map-Events.gif',
			keywords:'microsoft maps, map, gis, api, sdk, events, click, mouse, touch, context menu, wheel, zoomed, panned, dragged, pitched, moved',
			created:'5/4/2018'
		},
		{
			title:'Map Localization',
			desc:'This sample lets you switch the map between all its supported languages.',
			path:'Map/Map%20Localization.html',
			sourcePath:'Map/Map%20Localization.html',
			screenshot:'Map-Localization.png',
			keywords:'microsoft maps, map, gis, api, sdk, language, culture, localization, user region, map options',
			created:'5/4/2018'
		},
		{
			title:'Map style options',
			desc:'This sample shows how the different style options of the map affect rendering.',
			path:'Map/Map%20style%20options.html',
			sourcePath:'Map/Map%20style%20options.html',
			screenshot:'Map-style-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, style, logo, lighting, map options',
			created:'11/26/2019'
		},
		{
			title:'Map user interaction options',
			desc:'This sample shows how the different user interaction options of the map to modify how the map reacts when the user interacts with it.',
			path:'Map/Map%20user%20interaction%20options.html',
			sourcePath:'Map/Map%20user%20interaction%20options.html',
			screenshot:'Map-user-interaction-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, interact, map options, keyboard, mouse, pan, zoom',
			created:'3/13/2020'
		},
		{
			title:'Mini Overview Map',
			desc:'This sample shows how to create a second mini overview map which shows the main maps area of focus.',
			path:'Map/Mini%20Overview%20Map.html',
			sourcePath:'Map/Mini%20Overview%20Map.html',
			screenshot:'Mini-Overview-Map.png',
			keywords:'microsoft maps, map, gis, api, sdk, events, overview map, overview, mini map, minimap',
			created:'10/11/2018'
		},
		{
			title:'Mouse events with keys pressed',
			desc:'This sample shows how to monitor keys that are pressed when mouse events on the map. This same approach can be used with layers as well.',
			path:'Map/Mouse%20events%20with%20keys%20pressed.html',
			sourcePath:'Map/Mouse%20events%20with%20keys%20pressed.html',
			screenshot:'Mouse-events-with-keys-pressed.png',
			keywords:'microsoft maps, map, gis, api, sdk, events, mouse, key',
			created:'6/11/2020'
		},
		{
			title:'Multiple Maps in Different Languages',
			desc:'This sample shows two maps rendered on the same page, displaying maps in different languages. Press one of the buttons to change the language of the second map instantly.',
			path:'Map/Multiple%20Maps%20in%20Different%20Lanaguages.html',
			sourcePath:'Map/Multiple%20Maps%20in%20Different%20Lanaguages.html',
			screenshot:'Multiple-Maps-in-Different-Lanaguages.png',
			keywords:'microsoft maps, map, gis, api, sdk, multiple, language, localization, culture',
			created:'5/4/2018'
		},
		{
			title:'Multiple Maps',
			desc:'This sample shows how to render multiple maps on the same page.',
			path:'Map/Multiple%20Maps.html',
			sourcePath:'Map/Multiple%20Maps.html',
			screenshot:'Multiple-Maps.png',
			keywords:'microsoft maps, map, gis, api, sdk, multiple',
			created:'5/4/2018'
		},
		{
			title:'Render world copies',
			desc:'This sample shows how to the renderWolrdCopies map style option changes the layout of the map when zoomed out.',
			path:'Map/Render%20world%20copies.html',
			sourcePath:'Map/Render%20world%20copies.html',
			screenshot:'Render-world-copies.png',
			keywords:'microsoft maps, map, gis, api, sdk, map, worldwrap, map options',
			created:'6/24/2019'
		},
		{
			title:'Update layer based on map style',
			desc:'This sample shows how to monitor the maps style and update the style of a layer accordingly.',
			path:'Map/Update%20layer%20based%20on%20map%20style.html',
			sourcePath:'Map/Update%20layer%20based%20on%20map%20style.html',
			screenshot:'Update-layer-based-on-map-style.gif',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, icon, image, styledata',
			created:'6/5/2020'
		},
		{
			title:'Export Map as Image',
			desc:'This sample shows how to export the map canvas as an image which can be used in reports or emails. ',
			path:'Map/Export%20Map%20as%20Image/Export%20Map%20as%20Image.html',
			sourcePath:'Map/Export%20Map%20as%20Image',
			screenshot:'Export-Map-as-Image.png',
			keywords:'microsoft maps, map, gis, api, sdk, map image, export image, screenshots, reports, export map',
			created:'1/28/2019'
		},
	]
},
{
	category:'Polygon and Polygon Extrusion Layers',
	desc:'Learn how to overlay geospatially accurate circles, polygons, and multi-polygons on the map using the polygon and polygon extrusion layers.',
	samples: [
		{
			title:'Extruded choropleth map',
			desc:'This sample shows how to create a choropleth map of extruded polygons using data driven styling.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Extruded%20choropleth%20map.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Extruded%20choropleth%20map.html',
			screenshot:'Extruded-choropleth-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, thematic, choropleth, heatmap, heat map, polygon extrusion, extruded polygons',
			created:'2/3/2020'
		},
		{
			title:'Fill polygon with built-in icon template',
			desc:'This sample shows how to use an image template as a fill pattern in a polygon layer.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Fill%20polygon%20with%20built-in%20icon%20template.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Fill%20polygon%20with%20built-in%20icon%20template.html',
			screenshot:'Fill-polygon-with-built-in-icon-template.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, fill pattern, polygonlayer, image template',
			created:'7/5/2019'
		},
		{
			title:'Geospatially Accurate Circle',
			desc:'This sample shows how to use the extended GeoJSON schema defined by Azure Maps to create a geospatially accurate circle on the map with a filled area and a styled outline.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Geospatially%20Accurate%20Circle.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Geospatially%20Accurate%20Circle.html',
			screenshot:'Geospatially-Accurate-Circle.png',
			keywords:'microsoft maps, map, gis, api, sdk, circles, geospatial, geospatial circles',
			created:'9/23/2018'
		},
		{
			title:'Mercator Projection and Geospatial Circles',
			desc:'This sample shows how the Mercator projection of the map affects the scale of geospatially accurate objects on the map.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Mercator%20Projection%20and%20Geospatial%20Circles.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Mercator%20Projection%20and%20Geospatial%20Circles.html',
			screenshot:'Mercator-Projection-and-Geospatial-Circles.png',
			keywords:'microsoft maps, map, gis, api, sdk, circle, geospatial, mercator, projection',
			created:'9/23/2018'
		},
		{
			title:'Polygon Extrusion Layer Options',
			desc:'This sample shows how the different options of the polygon extrusion layer affect rendering.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Extrusion%20Layer%20Options.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Extrusion%20Layer%20Options.html',
			screenshot:'Polygon-Extrusion-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, polygon, layer',
			created:'11/22/2019'
		},
		{
			title:'Polygon Fill Pattern',
			desc:'This sample shows how to fill a polygon area using a pattern image rather than a solid color.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Fill%20Pattern.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Fill%20Pattern.html',
			screenshot:'Polygon-Fill-Pattern.png',
			keywords:'microsoft maps, map, gis, api, sdk, polyon, fill pattern',
			created:'1/24/2019'
		},
		{
			title:'Polygon Hover Style',
			desc:'This sample shows how to create a hover effect on a polygon layer.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Hover%20Style.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Hover%20Style.html',
			screenshot:'Polygon-Hover-Style.gif',
			keywords:'microsoft maps, map, gis, api, sdk, polygon, layer, hover, mouse',
			created:'9/23/2018'
		},
		{
			title:'Polygon labels - calculated',
			desc:'This sample shows how to create labels for polygons by calculating a coordinates and creating a point feature for the label.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20labels%20-%20calculated.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20labels%20-%20calculated.html',
			screenshot:'Polygon-labels---calculated.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, fill pattern, polygonlayer',
			created:'9/27/2019'
		},
		{
			title:'Polygon labels - symbol layer',
			desc:'This sample shows how the symbol layer can be used to automatically render labels for polygons on the map. ',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20labels%20-%20symbol%20layer.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20labels%20-%20symbol%20layer.html',
			screenshot:'Polygon-labels---symbol-layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, fill pattern, polygonlayer',
			created:'9/27/2019'
		},
		{
			title:'Polygon Layer Options',
			desc:'This sample shows how the different options of the polygon layer affect rendering.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Layer%20Options.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20Layer%20Options.html',
			screenshot:'Polygon-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, polygon, layer',
			created:'11/28/2018'
		},
		{
			title:'Polygon masks',
			desc:'Polygon masks limit the viewable area of the map to a polygon area.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20masks.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Polygon%20masks.html',
			screenshot:'Polygon-masks.png',
			keywords:'microsoft maps, map, gis, api, sdk, polygon mask, restrict map view',
			created:'8/20/2019'
		},
		{
			title:'Simple MultiPolygon',
			desc:'This sample shows how to render a MultiPolygon on the map.',
			path:'Polygon%20and%20Polygon%20Extrusion%20Layers/Simple%20MultiPolygon.html',
			sourcePath:'Polygon%20and%20Polygon%20Extrusion%20Layers/Simple%20MultiPolygon.html',
			screenshot:'Simple-MultiPolygon.png',
			keywords:'microsoft maps, map, gis, api, sdk, polyon, multipolygon',
			created:'9/23/2018'
		},
	]
},
{
	category:'Popups',
	desc:'See how to display information in a popup on the map.',
	samples: [
		{
			title:'Accessible popups',
			desc:'This sample shows how to use popups in a way that users can easily access them using keyboard shortcuts or on mouse click.',
			path:'Popups/Accessible%20popups.html',
			sourcePath:'Popups/Accessible%20popups.html',
			screenshot:'Accessible-popups.png',
			keywords:'microsoft maps, map, gis, api, sdk, popups, infobox, infowindow, events, mouse, accessibility',
			created:'11/20/2019'
		},
		{
			title:'Customize a popup',
			desc:'This sample shows how to customize the look of a popup.',
			path:'Popups/Customize%20a%20popup.html',
			sourcePath:'Popups/Customize%20a%20popup.html',
			screenshot:'Customize-a-popup.png',
			keywords:'microsoft maps, map, gis, api, sdk, popup, style',
			created:'7/8/2019'
		},
		{
			title:'Popup events',
			desc:'This sample shows how to add events to Popups.',
			path:'Popups/Popup%20events.html',
			sourcePath:'Popups/Popup%20events.html',
			screenshot:'Popup-events.png',
			keywords:'microsoft maps, map, gis, api, sdk, popups, infobox, infowindow, events, mouse',
			created:'6/24/2019'
		},
		{
			title:'Popup templates',
			desc:'This sample shows how to use a various popup templates to generate formatted content from porperties of features.',
			path:'Popups/Popup%20templates.html',
			sourcePath:'Popups/Popup%20templates.html',
			screenshot:'Popup-templates.png',
			keywords:'microsoft maps, map, gis, api, sdk, pins, symbols, pushpins, markers, infobox, infowindow, hover, popup templates',
			created:'12/6/2019'
		},
		{
			title:'Popup with DOM element content',
			desc:'This sample shows how to pass in a DOM-element into a popup as content.',
			path:'Popups/Popup%20with%20DOM%20element%20content.html',
			sourcePath:'Popups/Popup%20with%20DOM%20element%20content.html',
			screenshot:'Popup-with-DOM-element-content.png',
			keywords:'microsoft maps, map, gis, api, sdk, popup, style',
			created:'1/3/2020'
		},
		{
			title:'Popup with Media Content',
			desc:'This sample shows popups that contain media content.',
			path:'Popups/Popup%20with%20Media%20Content.html',
			sourcePath:'Popups/Popup%20with%20Media%20Content.html',
			screenshot:'Popup-with-Media-Content.png',
			keywords:'microsoft maps, map, gis, api, sdk, popup, infobox, infowindow, media',
			created:'5/4/2018'
		},
		{
			title:'Popups on Shapes',
			desc:'This sample shows how to display a popup when a user interacts with any shape on the map.',
			path:'Popups/Popups%20on%20Shapes.html',
			sourcePath:'Popups/Popups%20on%20Shapes.html',
			screenshot:'Popups-on-Shapes.png',
			keywords:'microsoft maps, map, gis, api, sdk, pins, symbols, pushpins, markers, infobox, infowindow, popup, polygon, line, linestring, polyline',
			created:'10/8/2018'
		},
		{
			title:'Popups with leader lines',
			desc:'This sample shows how to add events to Popups.',
			path:'Popups/Popups%20with%20leader%20lines.html',
			sourcePath:'Popups/Popups%20with%20leader%20lines.html',
			screenshot:'Popups-with-leader-lines.png',
			keywords:'microsoft maps, map, gis, api, sdk, popups, infobox, infowindow, events, mouse',
			created:'6/1/2020'
		},
		{
			title:'Reuse a popup template',
			desc:'This sample shows how to use reuse a single popup template with multiple features that share a common set of property fields.',
			path:'Popups/Reuse%20a%20popup%20template.html',
			sourcePath:'Popups/Reuse%20a%20popup%20template.html',
			screenshot:'Reuse-a-popup-template.png',
			keywords:'microsoft maps, map, gis, api, sdk, pins, symbols, pushpins, markers, infobox, infowindow, hover, popup templates',
			created:'12/6/2019'
		},
		{
			title:'Reusing Popup with Multiple Pins',
			desc:'This sample shows popups that contain media content.',
			path:'Popups/Reusing%20Popup%20with%20Multiple%20Pins.html',
			sourcePath:'Popups/Reusing%20Popup%20with%20Multiple%20Pins.html',
			screenshot:'Reusing-Popup-with-Multiple-Pins.png',
			keywords:'microsoft maps, map, gis, api, sdk, pins, symbols, pushpins, markers, infobox, infowindow, optimization, popup',
			created:'5/4/2018'
		},
		{
			title:'Show clustered points in popup',
			desc:'This sample shows how to display selectable list of points within a cluster in a popup. When an item is selected, the content of the popup will update to show the details of the selected point. ',
			path:'Popups/Show%20clustered%20points%20in%20popup.html',
			sourcePath:'Popups/Show%20clustered%20points%20in%20popup.html',
			screenshot:'Show-clustered-points-in-popup.png.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, bubbles, clustering, superclusterer',
			created:'5/18/2020'
		},
		{
			title:'Show popup on hover',
			desc:'This sample shows how to show a popup when the mouse hovers over or touches a shape.',
			path:'Popups/Show%20popup%20on%20hover.html',
			sourcePath:'Popups/Show%20popup%20on%20hover.html',
			screenshot:'Show-popup-on-hover.png',
			keywords:'microsoft maps, map, gis, api, sdk, pins, symbols, pushpins, markers, infobox, infowindow, hover',
			created:'4/15/2019'
		},
	]
},
{
	category:'REST Services',
	desc:'Learn how to directly access the Azure Maps REST services from JavaScript.',
	samples: [
		{
			title:'Calculate a Simple Isochrone',
			desc:'This sample shows how to calculate an isochrone (drive time polygon) using the Azure Maps Route Reachable Range service and display it on the map. ',
			path:'REST%20Services/Calculate%20a%20Simple%20Isochrone.html',
			sourcePath:'REST%20Services/Calculate%20a%20Simple%20Isochrone.html',
			screenshot:'Calculate-a-Simple-Isochrone.png',
			keywords:'microsoft maps, map, gis, api, sdk, rest, service, directions, route, routing, isochrone, isodistance, drive time polygon, reachable range',
			created:'10/18/2018'
		},
		{
			title:'Fill Address Form with Autosuggest',
			desc:'This sample shows how to use the Azure Maps Search service with JQuery UI\'s autocomplete widget which provides address suggestions as the user types and which populates a form with the selected suggestion.',
			path:'REST%20Services/Fill%20Address%20Form%20with%20Autosuggest.html',
			sourcePath:'REST%20Services/Fill%20Address%20Form%20with%20Autosuggest.html',
			screenshot:'Fill-Address-Form-with-Autosuggest.PNG',
			keywords:'microsoft maps, map, gis, api, sdk, search, geocoding, geocode, autosuggest, autocomplete, jquery',
			created:'10/8/2018'
		},
		{
			title:'Get current weather at a location',
			desc:'This sample shows how to retrieve weather data using the Azure Maps Current Conditions REST API.',
			path:'REST%20Services/Get%20current%20weather%20at%20a%20location.html',
			sourcePath:'REST%20Services/Get%20current%20weather%20at%20a%20location.html',
			screenshot:'Get-current-weather-at-a-location.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer, weather, accuweather',
			created:'3/20/2020'
		},
		{
			title:'Get Users Timezone with Prompt',
			desc:'This sample shows how to determine a users timezone by passing the users location into the Azure Maps REST Timezone service. The users location is retrieved using the HTML5 geolocation API which displays a prompt to the user to share their location.',
			path:'REST%20Services/Get%20Users%20Timezone.html',
			sourcePath:'REST%20Services/Get%20Users%20Timezone.html',
			screenshot:'',
			keywords:'microsoft maps, map, gis, api, sdk, rest, service, timezone, user, location, geolocation',
			created:'9/24/2018'
		},
		{
			title:'Get weather along a route',
			desc:'This sample shows how to retrieve weather data for all the waypoints along a route.',
			path:'REST%20Services/Get%20weather%20along%20a%20route.html',
			sourcePath:'REST%20Services/Get%20weather%20along%20a%20route.html',
			screenshot:'Get-weather-along-a-route.png',
			keywords:'microsoft maps, map, gis, api, sdk, rest, service, weather, accuweather, forecast, directions, route, routing',
			created:'12/6/2019'
		},
		{
			title:'Route Waypoint Optimization',
			desc:'This sample shows how to calculate routes with and without waypoint optimization using the Azure Maps REST Route API.',
			path:'REST%20Services/Route%20Waypoint%20Optimization.html',
			sourcePath:'REST%20Services/Route%20Waypoint%20Optimization.html',
			screenshot:'Route-Waypoint-Optimization.png',
			keywords:'microsoft maps, map, gis, api, sdk, route directions service, direcitons, travelling salesmen problem, route optimization, optimize, vehicle routing problem, vrp, tsp',
			created:'10/18/2018'
		},
		{
			title:'Search Autosuggest and JQuery UI',
			desc:'This sample shows how to create a custom input UI for suggesting possible results for queries against the Azure Maps Search services.',
			path:'REST%20Services/Search%20Autosuggest%20and%20JQuery%20UI.html',
			sourcePath:'REST%20Services/Search%20Autosuggest%20and%20JQuery%20UI.html',
			screenshot:'Search-Autosuggest-and-JQuery-UI.gif',
			keywords:'microsoft maps, map, gis, api, sdk, rest, search, geocoding, geocode, fuzzy, address, place, poi, points of interest, category, autosuggest, autocomplete, jquery',
			created:'9/23/2018'
		},
		{
			title:'Show weather overlays on a map',
			desc:'This sample shows how to add weather radar and infrared overlays to the map as a tile layer.',
			path:'REST%20Services/Show%20weather%20overlays%20on%20a%20map.html',
			sourcePath:'REST%20Services/Show%20weather%20overlays%20on%20a%20map.html',
			screenshot:'Show-weather-overlays-on-a-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer, weather, accuweather',
			created:'11/4/2019'
		},
		{
			title:'Simple REST Directions (Route)',
			desc:'This sample shows how to calculate simple directions between two points using the Azure Maps REST Route API and render it on a map.',
			path:'REST%20Services/Simple%20REST%20Directions.html',
			sourcePath:'REST%20Services/Simple%20REST%20Directions.html',
			screenshot:'Simple-REST-Directions.png',
			keywords:'microsoft maps, map, gis, api, sdk, rest, service, directions, route, routing',
			created:'9/23/2018'
		},
		{
			title:'Simple REST Geocoding Request',
			desc:'This sample shows how to use the REST search API directly for geocoding locations.',
			path:'REST%20Services/Simple%20REST%20Geocoding%20Request.html',
			sourcePath:'REST%20Services/Simple%20REST%20Geocoding%20Request.html',
			screenshot:'Simple-REST-Geocoding-Request.png',
			keywords:'microsoft maps, map, gis, api, sdk, rest, service, search, geocoding, geocode',
			created:'9/23/2018'
		},
	]
},
{
	category:'Services Module',
	desc:'Take advantage of the Services module to simplify integration of the REST services with the Azure Maps Web SDK.',
	samples: [
		{
			title:'Alternate routes with deviation constraints',
			desc:'This sample shows the usage of alternative routes, alternative types and supporting points with minimum deviation time and distance constraints.',
			path:'Services%20Module/Alternate%20routes%20with%20deviation%20constraints.html',
			sourcePath:'Services%20Module/Alternate%20routes%20with%20deviation%20constraints.html',
			screenshot:'Alternate-routes-with-deviation-constraints.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, route, directions',
			created:'1/29/2020'
		},
		{
			title:'Calculate a simple route',
			desc:'This sample shows how to calculate a simple route and display it on the map using the Services module for Azure Maps.',
			path:'Services%20Module/Calculate%20a%20simple%20route.html',
			sourcePath:'Services%20Module/Calculate%20a%20simple%20route.html',
			screenshot:'Calculate-a-simple-route.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, route, directions',
			created:'9/16/2019'
		},
		{
			title:'Calculate spaced positions along route',
			desc:'This sample shows how to calculate a evenly spaced out positions along a route, in this case every 10 kilometers.',
			path:'Services%20Module/Calculate%20spaced%20positions%20along%20route.html',
			sourcePath:'Services%20Module/Calculate%20spaced%20positions%20along%20route.html',
			screenshot:'Calculate-spaced-positions-along-route.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, route, directions',
			created:'9/16/2019'
		},
		{
			title:'Fuzzy Search with Services Module',
			desc:'This sample shows how to use the Services module for Azure Maps to perform a fuzzy search for points of interests, address, and places. Providing user location information allows the search service choose results that are more local to the user.',
			path:'Services%20Module/Fuzzy%20Search%20using%20Services%20Module.html',
			sourcePath:'Services%20Module/Fuzzy%20Search%20using%20Services%20Module.html',
			screenshot:'Fuzzy-Search-using-Services-Module.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, geolocation, search, fuzzy, geocode, geocoding, points of interest, poi, address, addresses, places',
			created:'9/26/2018'
		},
		{
			title:'Load POIs as the map moves',
			desc:'This sample shows how to load points of interest data on the map as the user moves the map.',
			path:'Services%20Module/Load%20POI%20as%20the%20map%20moves.html',
			sourcePath:'Services%20Module/Load%20POI%20as%20the%20map%20moves.html',
			screenshot:'Load-POIs-as-the-map-moves.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, search, points of interest, poi',
			created:'4/26/2019'
		},
		{
			title:'Methods for geocoding multiple addresses',
			desc:'This sample shows two different methods for geocoding a bunch of addresses quickly from within a web app.',
			path:'Services%20Module/Methods%20for%20geocoding%20multiple%20addresses.html',
			sourcePath:'Services%20Module/Methods%20for%20geocoding%20multiple%20addresses.html',
			screenshot:'Methods-for-geocoding-multiple-addresses.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, geolocation, search, fuzzy, geocode, geocoding, points of interest, poi, address, addresses, places, batch, batch geocode',
			created:'2/27/2020'
		},
		{
			title:'Page through POI results',
			desc:'This sample shows how to step through all the results available for a POI query. This sample also creates a list of the results and cross references the list items to the shapes on the map.',
			path:'Services%20Module/Page%20through%20POI%20results.html',
			sourcePath:'Services%20Module/Page%20through%20POI%20results.html',
			screenshot:'Page-through-POI-results.png',
			keywords:'microsoft maps, map, gis, api, sdk, page results, paging results, pagination',
			created:'9/9/2019'
		},
		{
			title:'Reverse Geocode with Services Module',
			desc:'This sample shows how to use the Services module for Azure Maps to reverse geocode a coordinate.',
			path:'Services%20Module/Reverse%20Geocode%20using%20Services%20Module.html',
			sourcePath:'Services%20Module/Reverse%20Geocode%20using%20Services%20Module.html',
			screenshot:'Reverse-Geocode-using-Services-Module.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, search, reverse, geocode, geocoding, address, addresses',
			created:'9/26/2018'
		},
		{
			title:'Search for boundaries',
			desc:'This sample shows how to use the Services module for Azure Maps to search for locations that have boundaries and display them on the map. Azure Maps provides boundary data for administrative areas such as states, countries, cities, postal codes, and other boundaries such as industrial areas.',
			path:'Services%20Module/Search%20for%20boundaries.html',
			sourcePath:'Services%20Module/Search%20for%20boundaries.html',
			screenshot:'Search-for-boundaries.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, geolocation, search, geocode, geocoding, adminstrative boundaries, boundary, boundaries, polygon',
			created:'3/13/2020'
		},
		{
			title:'Show traffic along route',
			desc:'This sample shows how to retrieve traffic information along a route using the <b>sectionType</b> option, and color the sections on the map. ',
			path:'Services%20Module/Show%20traffic%20along%20route.html',
			sourcePath:'Services%20Module/Show%20traffic%20along%20route.html',
			screenshot:'Show-traffic-along-route.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, route, directions, route sections, traffic',
			created:'3/2/2020'
		},
		{
			title:'Snap points to logical route path',
			desc:'This sample shows how to snap points to the road network to form a logical path using the Azure Maps rest directions service.',
			path:'Services%20Module/Snap%20points%20to%20logical%20route%20path.html',
			sourcePath:'Services%20Module/Snap%20points%20to%20logical%20route%20path.html',
			screenshot:'Snap-points-to-logical-route-path.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, route, directions, snap to roads, snapping, gps traces, gps trace, snap to road',
			created:'1/31/2020'
		},
	]
},
{
	category:'Spatial Analysis',
	desc:'Gain deep insights with in-depth spatial analysis of data.',
	samples: [
		{
			title:'Census block group analysis',
			desc:'This sample loads census block group data for a state and then retrieves the intersection with an area drawn by the user and calculates an estimated population.',
			path:'Spatial%20Analysis/Census%20block%20group%20analysis.html',
			sourcePath:'Spatial%20Analysis/Census%20block%20group%20analysis.html',
			screenshot:'Census-block-group-analysis.png',
			keywords:'microsoft maps, map, gis, api, spatial analysis, spatial join, voronoi, voronoi diagram, within, intersects, intersection, spatial data, spatial io module, geoxml, census',
			created:'3/20/2020'
		},
		{
			title:'Travel time analysis of multiple locations',
			desc:'This sample shows how to add calculate travel times areas for multiple points, and then spatially join these travel time polygons with a secondary set of points to calculate aggregates.',
			path:'Spatial%20Analysis/Travel%20time%20analysis%20of%20multiple%20locations.html',
			sourcePath:'Spatial%20Analysis/Travel%20time%20analysis%20of%20multiple%20locations.html',
			screenshot:'Travel-time-analysis-of-multiple-locations.png',
			keywords:'microsoft maps, map, gis, api, sdk, spatial analysis, spatial join, travel time, isochrone, route range, within, intersects, intersection',
			created:'3/20/2020'
		},
		{
			title:'Voronoi diagram analysis',
			desc:'This sample shows how to add calculate a Voronoi diagram from a set of points, and then spatially join the Voronoi polygons with a secondary set of points to calculate aggregates. ',
			path:'Spatial%20Analysis/Voronoi%20diagram%20analysis.html',
			sourcePath:'Spatial%20Analysis/Voronoi%20diagram%20analysis.html',
			screenshot:'Voronoi-diagram-analysis.png',
			keywords:'microsoft maps, map, gis, api, sdk, spatial analysis, spatial join, voronoi, voronoi diagram, within, intersects, intersection',
			created:'3/20/2020'
		},
		{
			title:'Route along GeoJSON network',
			desc:'This sample shows how to calculate the shortest route path between two points on a network of lines stored in a GeoJSON file. ',
			path:'Spatial%20Analysis/GeoJSONRouting/Route%20along%20GeoJSON%20network.html',
			sourcePath:'Spatial%20Analysis/GeoJSONRouting',
			screenshot:'Route-along-GeoJSON-network.png',
			keywords:'microsoft maps, map, gis, api, sdk, shortest path, routing, route, directions, spatial math, maritime trade routes, spatial analysis',
			created:'3/20/2020'
		},
	]
},
{
	category:'Spatial IO Module',
	desc:'Learn how to use the Spatial IO module to easily read and write spatial data and connect to OGC services.',
	samples: [
		{
			title:'Add a delimited file (CSV) to the map',
			desc:'This sample shows how to add a delimited file (CSV, TSV, PIPE) to the map by converting it into GeoJSON.',
			path:'Spatial%20IO%20Module/Add%20a%20delimited%20file%20(CSV)%20to%20the%20map.html',
			sourcePath:'Spatial%20IO%20Module/Add%20a%20delimited%20file%20(CSV)%20to%20the%20map.html',
			screenshot:'Add-a-delimited-file-(CSV)-to-the-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, csv, tsv, delimited file',
			created:'2/27/2020'
		},
		{
			title:'Drag and drop spatial files onto map',
			desc:'Drag and drop one or more KML, KMZ, GeoRSS, GPX, GML, GeoJSON or CSV files onto the map.',
			path:'Spatial%20IO%20Module/Drag%20and%20drop%20spatial%20files%20onto%20map.html',
			sourcePath:'Spatial%20IO%20Module/Drag%20and%20drop%20spatial%20files%20onto%20map.html',
			screenshot:'Drag-and-drop-spatial-files-onto-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, kml, kmz, georss, gpx, gml, geojson, csv, ogc, spatial data, spatial io module, geoxml',
			created:'2/23/2020'
		},
		{
			title:'Load KML onto map',
			desc:'This sample shows how to load KML or KMZ files onto the map.',
			path:'Spatial%20IO%20Module/Load%20KML%20onto%20map.html',
			sourcePath:'Spatial%20IO%20Module/Load%20KML%20onto%20map.html',
			screenshot:'Load-KML-onto-map.png',
			keywords:'map, gis, api, sdk, kml, kmz, ogc, spatial data, spatial io module, geoxml',
			created:'2/23/2020'
		},
		{
			title:'Load spatial data (simple)',
			desc:'This sample shows how to easily load spatial data using the spatial io module into the map. ',
			path:'Spatial%20IO%20Module/Load%20spatial%20data%20(simple).html',
			sourcePath:'Spatial%20IO%20Module/Load%20spatial%20data%20(simple).html',
			screenshot:'Load-spatial-data-(simple).png',
			keywords:'microsoft maps, map, gis, api, sdk, kml, kmz, georss, gpx, gml, geojson, csv, ogc, spatial data, spatial io module, geoxml',
			created:'2/23/2020'
		},
		{
			title:'OGC map layer example',
			desc:'This sample shows how to overlay a Web Mapping Service (WMS) or Web Mapping Tile Service (WMTS) on top of the map using the OGC map layer.',
			path:'Spatial%20IO%20Module/OGC%20map%20layer%20example.html',
			sourcePath:'Spatial%20IO%20Module/OGC%20map%20layer%20example.html',
			screenshot:'OGC-map-layer-example.png',
			keywords:'microsoft maps, map, gis, api, sdk, web mapping service, web mapping tile service, wmts, wms, ogc, spatial io module',
			created:'2/27/2020'
		},
		{
			title:'OGC map layer options',
			desc:'This sample shows how the different options of the OGC map layer affect rendering.',
			path:'Spatial%20IO%20Module/OGC%20map%20layer%20options.html',
			sourcePath:'Spatial%20IO%20Module/OGC%20map%20layer%20options.html',
			screenshot:'OGC-map-layer-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer',
			created:'2/27/2020'
		},
		{
			title:'OGC Web Map Service explorer',
			desc:'This is a simple tool for exploring Web Map Services (WMS) and Web Map Tile Services (WMTS) as layers on the map.',
			path:'Spatial%20IO%20Module/OGC%20Web%20Map%20Service%20explorer.html',
			sourcePath:'Spatial%20IO%20Module/OGC%20Web%20Map%20Service%20explorer.html',
			screenshot:'OGC-Web-Map-Service-explorer.png',
			keywords:'microsoft maps, map, gis, api, sdk, web mapping service, web mapping tile service, wmts, wms, ogc, spatial io module',
			created:'2/27/2020'
		},
		{
			title:'Read and write Well Known Text',
			desc:'This sample shows how to read and write Well Known Text (WKT) strings as GeoJSON.',
			path:'Spatial%20IO%20Module/Read%20and%20write%20Well%20Known%20Text.html',
			sourcePath:'Spatial%20IO%20Module/Read%20and%20write%20Well%20Known%20Text.html',
			screenshot:'Read-and-write-Well-Known-Text.png',
			keywords:'microsoft maps, map, gis, api, sdk, well known text, wkt, ogc, spatial io module',
			created:'2/23/2020'
		},
		{
			title:'Read Well Known Text',
			desc:'This sample shows how to easily read Well Known text as GeoJSON.',
			path:'Spatial%20IO%20Module/Read%20Well%20Known%20Text.html',
			sourcePath:'Spatial%20IO%20Module/Read%20Well%20Known%20Text.html',
			screenshot:'Read-Well-Known-Text.png',
			keywords:'microsoft maps, map, gis, api, sdk, well known text, wkt, ogc, spatial io module',
			created:'2/23/2020'
		},
		{
			title:'Simple data layer options',
			desc:'This sample shows how the different options of the simple data layer affect rendering.',
			path:'Spatial%20IO%20Module/Simple%20data%20layer%20options.html',
			sourcePath:'Spatial%20IO%20Module/Simple%20data%20layer%20options.html',
			screenshot:'Simple-data-layer-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, line, linestring, polyline, layer, linelayer, symbols, markers, pins, pushpins, spatial data, spatial io module',
			created:'2/27/2020'
		},
		{
			title:'Simple WFS example',
			desc:'This sample shows how to easily query a Web Feature Service (WFS) and overlay the results on a map.',
			path:'Spatial%20IO%20Module/Simple%20WFS%20example.html',
			sourcePath:'Spatial%20IO%20Module/Simple%20WFS%20example.html',
			screenshot:'Simple-WFS-example.png',
			keywords:'microsoft maps, map, gis, api, sdk, wfs, web feature service, ogc, spatial data, spatial io module',
			created:'2/27/2020'
		},
		{
			title:'Spatial data gallery',
			desc:'This sample shows all the different types of spatial data files that can be read with the spatial IO module.',
			path:'Spatial%20IO%20Module/Spatial%20data%20gallery.html',
			sourcePath:'Spatial%20IO%20Module/Spatial%20data%20gallery.html',
			screenshot:'Spatial-data-gallery.png',
			keywords:'microsoft maps, map, gis, api, sdk, kml, kmz, georss, gpx, gml, geojson, csv, ogc, spatial data, spatial io module, geoxml',
			created:'2/27/2020'
		},
		{
			title:'Spatial data write options',
			desc:'This sample shows the different write options for the atlas.io.write function.',
			path:'Spatial%20IO%20Module/Spatial%20data%20write%20options.html',
			sourcePath:'Spatial%20IO%20Module/Spatial%20data%20write%20options.html',
			screenshot:'Spatial-data-write-options.png',
			keywords:'microsoft maps, map, gis, api, sdk, kml, kmz, georss, gpx, gml, geojson, csv, ogc, spatial data, spatial io module, geoxml',
			created:'2/28/2020'
		},
		{
			title:'WFS filter example',
			desc:'This is a simple tool for exploring WFS services on Azure Maps.',
			path:'Spatial%20IO%20Module/WFS%20filter%20examples.html',
			sourcePath:'Spatial%20IO%20Module/WFS%20filter%20examples.html',
			screenshot:'WFS-filter-example.png',
			keywords:'microsoft maps, map, gis, api, sdk, wfs, web feature service, ogc, spatial data, spatial io module',
			created:'2/27/2020'
		},
		{
			title:'WFS service explorer',
			desc:'This is a simple tool for exploring WFS services on Azure Maps.',
			path:'Spatial%20IO%20Module/WFS%20service%20explorer.html',
			sourcePath:'Spatial%20IO%20Module/WFS%20service%20explorer.html',
			screenshot:'WFS-service-explorer.png',
			keywords:'microsoft maps, map, gis, api, sdk, wfs, web feature service, ogc, spatial data, spatial io module',
			created:'2/27/2020'
		},
	]
},
{
	category:'Spatial Math',
	desc:'Learn how to perform common spatial calculations easily with the Azure Maps Web SDK.',
	samples: [
		{
			title:'Basic snap to road logic',
			desc:'This sample shows how to snap individual points to the rendered roads on the map.',
			path:'Spatial%20Math/Basic%20snap%20to%20road%20logic.html',
			sourcePath:'Spatial%20Math/Basic%20snap%20to%20road%20logic.html',
			screenshot:'Basic-snap-to-road-logic.png',
			keywords:'microsoft maps, map, gis, api, sdk, snap to road, snap to roads, snapping, road network, gps',
			created:'1/31/2020'
		},
		{
			title:'Calculate a convex hull',
			desc:'This sample shows how to calculate a convex hull from an array of shapes.',
			path:'Spatial%20Math/Calculate%20a%20convex%20hull.html',
			sourcePath:'Spatial%20Math/Calculate%20a%20convex%20hull.html',
			screenshot:'Calculate-a-convex-hull.png',
			keywords:'microsoft maps, map, gis, api, sdk, geospatial, spatial math, math, convex hull',
			created:'7/5/2019'
		},
		{
			title:'Cardinal Spline Options',
			desc:'This sample provides a set of controls to test the various features of the Cardinal Spline calculation.',
			path:'Spatial%20Math/Cardinal%20Spline%20Options.html',
			sourcePath:'Spatial%20Math/Cardinal%20Spline%20Options.html',
			screenshot:'Cardinal-Spline-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, spatial math, math, spline, cardinal spline, curves, lines, line layer',
			created:'12/10/2018'
		},
		{
			title:'Convex hull and HTML markers',
			desc:'This sample shows how to calculate a convex hull for a set of HTML markers.',
			path:'Spatial%20Math/Convex%20hull%20and%20HTML%20markers.html',
			sourcePath:'Spatial%20Math/Convex%20hull%20and%20HTML%20markers.html',
			screenshot:'Convex-hull-and-HTML-markers.gif',
			keywords:'microsoft maps, map, gis, api, sdk, geospatial, spatial math, math, convex hull, markers',
			created:'7/5/2019'
		},
		{
			title:'Display cluster area with Convex Hull',
			desc:'This sample shows how to display the area of the points contained within a cluster by calculating a convex hull. ',
			path:'Spatial%20Math/Display%20cluster%20area%20with%20Convex%20Hull.html',
			sourcePath:'Spatial%20Math/Display%20cluster%20area%20with%20Convex%20Hull.html',
			screenshot:'Display-cluster-area-with-Convex-Hull.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, clustering, superclusterer, convex hull, spatial math',
			created:'3/27/2019'
		},
		{
			title:'Filter Data Along Route',
			desc:'This sample shows how to take a route line, calculate a buffer around it and then filter a set of points to find those that are within the buffer.',
			path:'Spatial%20Math/Filter%20Data%20Along%20Route.html',
			sourcePath:'Spatial%20Math/Filter%20Data%20Along%20Route.html',
			screenshot:'Filter-Data-Along-Route.png',
			keywords:'microsoft maps, map, gis, api, sdk, turf.js, geospatial, math, points, buffer, within, intersects, intersection',
			created:'4/1/2019'
		},
		{
			title:'Get closest HTML marker to position',
			desc:'This sample shows how to calculate the closest marker to a given position, in this case, where the user clicked on the map.',
			path:'Spatial%20Math/Get%20closest%20HTML%20marker%20to%20position.html',
			sourcePath:'Spatial%20Math/Get%20closest%20HTML%20marker%20to%20position.html',
			screenshot:'Get-closest-HTML-marker-to-position.png',
			keywords:'microsoft maps, map, gis, api, sdk, geospatial, spatial math, math, markers, coordinate',
			created:'9/20/2019'
		},
		{
			title:'Get closest point to geometry',
			desc:'This sample shows how to get the closest point on a geometry from another point or position.',
			path:'Spatial%20Math/Get%20closest%20point%20to%20geometry.html',
			sourcePath:'Spatial%20Math/Get%20closest%20point%20to%20geometry.html',
			screenshot:'Get-closest-point-to-geometry.png',
			keywords:'microsoft maps, map, gis, api, sdk, geospatial, spatial math, math',
			created:'7/5/2019'
		},
		{
			title:'Get closest point to position',
			desc:'This sample shows how to calculate the closest point to a given coordinate, in this case, where the user clicked on the map. ',
			path:'Spatial%20Math/Get%20closest%20point%20to%20position.html',
			sourcePath:'Spatial%20Math/Get%20closest%20point%20to%20position.html',
			screenshot:'Get-closest-point-to-position.png',
			keywords:'microsoft maps, map, gis, api, sdk, geospatial, spatial math, math, point, coordinate',
			created:'9/20/2019'
		},
		{
			title:'Get points in current map view',
			desc:'This sample shows how to determine which points of a data set are in the current map view.',
			path:'Spatial%20Math/Get%20points%20in%20current%20map%20view.html',
			sourcePath:'Spatial%20Math/Get%20points%20in%20current%20map%20view.html',
			screenshot:'Get-points-in-current-map-view.png',
			keywords:'microsoft maps, map, gis, api, sdk, events, overview map, overview, mini map, minimap',
			created:'11/3/2019'
		},
		{
			title:'Introduction to Spatial Math',
			desc:'This sample shows how to use many of the built in spatial math functions in the Azure Maps web control.',
			path:'Spatial%20Math/Introduction%20to%20spatial%20math.html',
			sourcePath:'Spatial%20Math/Introduction%20to%20spatial%20math.html',
			screenshot:'Introduction-to-spatial-math.png',
			keywords:'microsoft maps, map, gis, api, sdk, geospatial, spatial math, math, haversine, heading, bearing',
			created:'9/23/2018'
		},
		{
			title:'Merge Two Polygons Together',
			desc:'This sample shows how to merge (union) two polygons together to create a single polygon object.',
			path:'Spatial%20Math/Merge%20Two%20Polygons%20Together%20(Turf.js).html',
			sourcePath:'Spatial%20Math/Merge%20Two%20Polygons%20Together%20(Turf.js).html',
			screenshot:'Merge-Two-Polygons-Together-(Turf.js).png',
			keywords:'microsoft maps, map, gis, api, sdk, turf.js, geospatial, math, spatial math, polygons, merge, union, spatial analytics',
			created:'4/1/2019'
		},
		{
			title:'Simple Cardinal Spline',
			desc:'This sample shows how to create a simple cardinal spline and display it on the map.',
			path:'Spatial%20Math/Simple%20Cardinal%20Spline.html',
			sourcePath:'Spatial%20Math/Simple%20Cardinal%20Spline.html',
			screenshot:'Simple-Cardinal-Spline.png',
			keywords:'microsoft maps, map, gis, api, sdk, spatial math, math, spline, cardinal spline, curves, lines, line layer',
			created:'1/25/2019'
		},
	]
},
{
	category:'Symbol Layer',
	desc:'Render lots of styled points on the map in a Symbol layer with good performance. If working with smaller data sets use HTML based markers and take advantage of CSS for styling.',
	samples: [
		{
			title:'All built-in icon templates as symbols',
			desc:'This sample shows all the built-in icon templates rendered on a symbol layer.',
			path:'Symbol%20Layer/All%20built-in%20icon%20templates%20as%20symbols.html',
			sourcePath:'Symbol%20Layer/All%20built-in%20icon%20templates%20as%20symbols.html',
			screenshot:'All-built-in-icon-templates-as-symbols.png',
			keywords:'microsoft maps, map, gis, api, sdk, image template, icon templates',
			created:'7/5/2019'
		},
		{
			title:'Change Mouse Cursor when Hovering Layer',
			desc:'This sample shows how to change the mouse cursor when hovering over shapes in a layer. This will work with the bubble, line, polygon and symbol layer.',
			path:'Symbol%20Layer/Change%20Mouse%20Cursor%20when%20Hovering%20Layer.html',
			sourcePath:'Symbol%20Layer/Change%20Mouse%20Cursor%20when%20Hovering%20Layer.html',
			screenshot:'Change-Mouse-Cursor-when-Hovering-Layer.gif',
			keywords:'microsoft maps, map, gis, api, sdk, events, bubble, circles, bubblelayer, line, linestring, polyline, polygon, symbols, markers, pins, pushpins, layer, mouse, cursor',
			created:'11/28/2018'
		},
		{
			title:'Create Symbols from Custom JSON',
			desc:'This sample shows how to use this JSON data to create clickable symbols on a map, that when clicked, display a popup with the title and description values of the symbol that was clicked.',
			path:'Symbol%20Layer/Create%20Symbols%20from%20Custom%20JSON.html',
			sourcePath:'Symbol%20Layer/Create%20Symbols%20from%20Custom%20JSON.html',
			screenshot:'Create-Symbols-from-Custom-JSON.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, json, layer',
			created:'9/23/2018'
		},
		{
			title:'Custom Symbol Image Icon',
			desc:'This sample shows how to add a custom symbol icon to the map resources and then use it render point data with a custom symbol on the map.',
			path:'Symbol%20Layer/Custom%20Symbol%20Image%20Icon.html',
			sourcePath:'Symbol%20Layer/Custom%20Symbol%20Image%20Icon.html',
			screenshot:'Custom-Symbol-Image-Icon.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, icon, image',
			created:'1/8/2020'
		},
		{
			title:'Data-driven symbol icons',
			desc:'This sample shows how to use multiple custom icons in a single symbol layer by using data-driven styling with an expression.',
			path:'Symbol%20Layer/Data-driven%20symbol%20icons.html',
			sourcePath:'Symbol%20Layer/Data-driven%20symbol%20icons.html',
			screenshot:'Data-driven-symbol-icons.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, icon, image, expression',
			created:'5/14/2019'
		},
		{
			title:'Display clusters with a Symbol Layer',
			desc:'This sample shows how to enable point based clustering on a data source and render them with different symbols.',
			path:'Symbol%20Layer/Display%20clusters%20with%20a%20Symbol%20layer.html',
			sourcePath:'Symbol%20Layer/Display%20clusters%20with%20a%20Symbol%20layer.html',
			screenshot:'Display-clusters-with-a-Symbol-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, clustering, superclusterer',
			created:'3/27/2019'
		},
		{
			title:'Draggable Symbols',
			desc:'This sample shows how to create a symbol layer that lets you drag the symbols using the mouse.',
			path:'Symbol%20Layer/Draggable%20Symbols.html',
			sourcePath:'Symbol%20Layer/Draggable%20Symbols.html',
			screenshot:'Draggable-Symbols.gif',
			keywords:'microsoft maps, map, gis, api, sdk, symbols, markers, pins, pushpins, styling, style, layer, drag, draggable, mouse',
			created:'10/2/2018'
		},
		{
			title:'Filter Symbols by Property',
			desc:'This sample shows how to filter symbols on the map by property by creating a layer fro each property value and then toggling the visibility of that layer accordingly. ',
			path:'Symbol%20Layer/Filter%20Symbols%20by%20Property.html',
			sourcePath:'Symbol%20Layer/Filter%20Symbols%20by%20Property.html',
			screenshot:'Filter-Symbols-by-Property.png',
			keywords:'microsoft maps, map, gis, api, sdk, symbols, markers, pins, pushpins, styling, style, layer',
			created:'10/19/2018'
		},
		{
			title:'Formatted text field',
			desc:'This sample shows how to format the symbol layers text field.',
			path:'Symbol%20Layer/Formatted%20text%20field.html',
			sourcePath:'Symbol%20Layer/Formatted%20text%20field.html',
			screenshot:'Formatted-text-field.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, text formatting, formatting, string formatting',
			created:'3/29/2019'
		},
		{
			title:'Image sprite fallback expression',
			desc:'This sample shows how to use an expression to check to see if an image is available in the maps image sprite, and if it isn\'t, use a fallback image instead.',
			path:'Symbol%20Layer/Image%20sprite%20fallback%20expression.html',
			sourcePath:'Symbol%20Layer/Image%20sprite%20fallback%20expression.html',
			screenshot:'Image-sprite-fallback-expression.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, icon, image',
			created:'11/22/2019'
		},
		{
			title:'Styled Symbol Layer',
			desc:'This sample shows how to create a symbol layer and apply styles to it to customize how it renders each symbol.',
			path:'Symbol%20Layer/Styled%20Symbol%20Layer.html',
			sourcePath:'Symbol%20Layer/Styled%20Symbol%20Layer.html',
			screenshot:'Styled-Symbol-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, symbols, markers, pins, pushpins, styling, style, layer',
			created:'9/23/2018'
		},
		{
			title:'Symbol image selection state',
			desc:'This sample shows how to change the image of a symbol based on its selection state. ',
			path:'Symbol%20Layer/Symbol%20image%20selection%20state.html',
			sourcePath:'Symbol%20Layer/Symbol%20image%20selection%20state.html',
			screenshot:'Symbol-image-selection-state.gif',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, icon, image',
			created:'1/8/2020'
		},
		{
			title:'Layer events',
			desc:'This sample highlights the name of the events that are firing as you interact with the Symbol Layer. The Symbol, Bubble, Line and Polygon layer all support the same set of events. The Tile Layer does not support any of these events.',
			path:'Symbol%20Layer/Symbol%20layer%20events.html',
			sourcePath:'Symbol%20Layer/Symbol%20layer%20events.html',
			screenshot:'Layer-events.gif',
			keywords:'microsoft maps, map, gis, api, sdk, events, bubble, circles, bubblelayer, line, linestring, polyline, polygon, symbols, markers, pins, pushpins, layer, click, mouse, touch, context menu, wheel',
			created:'11/28/2018'
		},
		{
			title:'Symbol Layer Options',
			desc:'This sample shows how the different options of the symbol layer affect rendering.',
			path:'Symbol%20Layer/Symbol%20Layer%20Options.html',
			sourcePath:'Symbol%20Layer/Symbol%20Layer%20Options.html',
			screenshot:'Symbol-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, symbols, markers, pins, pushpins, layer',
			created:'11/28/2018'
		},
		{
			title:'Symbol layer with built-in icon template',
			desc:'This sample shows how to use a built-in icon template with a symbol layer.',
			path:'Symbol%20Layer/Symbol%20layer%20with%20built-in%20icon%20template.html',
			sourcePath:'Symbol%20Layer/Symbol%20layer%20with%20built-in%20icon%20template.html',
			screenshot:'Symbol-layer-with-built-in-icon-template.png',
			keywords:'microsoft maps, map, gis, api, sdk, template, symbols, markers, pins, pushpins, styling, style, layer, icons, image template',
			created:'7/5/2019'
		},
		{
			title:'Text format with inline image',
			desc:'This sample shows how to use the text format expression to create a string with an inline icon with the symbol layers textField option.',
			path:'Symbol%20Layer/Text%20format%20with%20inline%20image.html',
			sourcePath:'Symbol%20Layer/Text%20format%20with%20inline%20image.html',
			screenshot:'Text-format-with-inline-image.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, icon, image',
			created:'3/13/2020'
		},
	]
},
{
	category:'Third Party Map Controls',
	desc:'As good as the Azure Maps Web Control is, there are many 3rd party map controls in which you can import Azure Maps data into which is a great option if you have an existing app built on one of these.',
	samples: [
		{
			title:'Raster Tiles in ArcGIS JS 4.6',
			desc:'This sample shows how to render Azure Maps Raster Tiles in the ArcGIS version 4.6 JavaScript map control.',
			path:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20ArcGIS%20JS%204.6.html',
			sourcePath:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20ArcGIS%20JS%204.6.html',
			screenshot:'Raster-Tiles-in-ArcGIS-JS-4.6.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, raster, arcgis, esri',
			created:'9/23/2018'
		},
		{
			title:'Raster Tiles in Cesium JS',
			desc:'This sample shows how to render Azure Maps Raster Tiles in the Cesium JS map control.',
			path:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20Cesium%20JS.html',
			sourcePath:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20Cesium%20JS.html',
			screenshot:'Raster-Tiles-in-Cesium-JS.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, raster, cesium, cesium.js',
			created:'9/23/2018'
		},
		{
			title:'Azure Maps Raster Tiles in Leaflet JS',
			desc:'This sample shows how to render Azure Maps Raster Tiles in the Leaflet JS map control.',
			path:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20Leaflet%20JS.html',
			sourcePath:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20Leaflet%20JS.html',
			screenshot:'Raster-Tiles-in-Leaflet-JS.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, raster, leaflet, leaflet.js',
			created:'9/23/2018'
		},
		{
			title:'Raster Tiles in OpenLayers',
			desc:'This sample shows how to render Azure Maps Raster Tiles in the OpenLayers map control.',
			path:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20OpenLayers.html',
			sourcePath:'Third%20Party%20Map%20Controls/Raster%20Tiles%20in%20OpenLayers.html',
			screenshot:'Raster-Tiles-in-OpenLayers.png',
			keywords:'microsoft maps, map, gis, api, sdk, raster, tiles, open layers, openlayers',
			created:'9/23/2018'
		},
		{
			title:'Satellite Imagery in OpenLayers',
			desc:'This sample shows how to render Azure Maps Satellite/Aerial imagery tiles in the OpenLayers map control.',
			path:'Third%20Party%20Map%20Controls/Satellite%20Imagery%20in%20OpenLayers.html',
			sourcePath:'Third%20Party%20Map%20Controls/Satellite%20Imagery%20in%20OpenLayers.html',
			screenshot:'Satellite-Imagery-in-OpenLayers.png',
			keywords:'microsoft maps, map, gis, api, sdk, raster, imagery, satellite, aerial, tiles, open layers, openlayers',
			created:'11/14/2018'
		},
	]
},
{
	category:'Tile Layers',
	desc:'Overlay raster tile layers on top the map using the same tiling system used by the base maps.',
	samples: [
		{
			title:'Tile Layer Options',
			desc:'This sample shows how the different options of the tile layer affect rendering.',
			path:'Tile%20Layers/Tile%20Layer%20Options.html',
			sourcePath:'Tile%20Layers/Tile%20Layer%20Options.html',
			screenshot:'Tile-Layer-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer',
			created:'11/28/2018'
		},
		{
			title:'Tile Layer using X, Y, and Z',
			desc:'This sample shows how to create a simple tile layer which points to a set of tiles which use the x, y, zoom tiling system.',
			path:'Tile%20Layers/Tile%20Layer%20using%20X,%20Y%20and%20Z.html',
			sourcePath:'Tile%20Layers/Tile%20Layer%20using%20X,%20Y%20and%20Z.html',
			screenshot:'Tile-Layer-using-X,-Y-and-Z.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer, nautical chart, openseamap',
			created:'11/28/2018'
		},
		{
			title:'WMS Tile Layer',
			desc:'This sample shows how to create a tile layer which points to a Web Mapping Service (WMS).',
			path:'Tile%20Layers/WMS%20Tile%20Layer.html',
			sourcePath:'Tile%20Layers/WMS%20Tile%20Layer.html',
			screenshot:'WMS-Tile-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer, wms, web mapping service',
			created:'12/10/2018'
		},
		{
			title:'WMTS Tile Layer',
			desc:'This sample shows how to create a tile layer which points to a Web Mapping Tile Service (WMTS).',
			path:'Tile%20Layers/WMTS%20Tile%20Layer.html',
			sourcePath:'Tile%20Layers/WMTS%20Tile%20Layer.html',
			screenshot:'WMTS-Tile-Layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, tiles, layer, wmts, web mapping tile service',
			created:'12/11/2018'
		},
	]
},
{
	category:'Traffic',
	desc:'Overlay real-time traffic data on the map.',
	samples: [
		{
			title:'Traffic Overlay Options',
			desc:'This sample shows how the different Traffic Options change how the traffic overlay is rendered on the map.',
			path:'Traffic/Traffic%20Overlay%20Options.html',
			sourcePath:'Traffic/Traffic%20Overlay%20Options.html',
			screenshot:'Traffic-Overlay-Options.png',
			keywords:'microsoft maps, map, gis, api, sdk, traffic, layer, flow, incidents',
			created:'5/4/2018'
		},
		{
			title:'Traffic Overlay',
			desc:'This sample shows how to show the traffic overlay over top of the map.',
			path:'Traffic/Traffic%20Overlay.html',
			sourcePath:'Traffic/Traffic%20Overlay.html',
			screenshot:'Traffic-Overlay.png',
			keywords:'microsoft maps, map, gis, api, sdk, traffic, layer, flow, incidents',
			created:'5/4/2018'
		},
	]
},
{
	category:'Tutorials',
	desc:'These are the finished code samples for the tutorials in the Azure Maps documentation. You can find the full tutorial walkthroughs <a href="https://docs.microsoft.com/azure/azure-maps/" target="_blank">here</a>.',
	samples: [
		{
			title:'Interactive Search Quickstart',
			desc:'This tutorial shows how to create an interactive search experience.',
			path:'Tutorials/interactiveSearch.html',
			sourcePath:'Tutorials/interactiveSearch.html',
			screenshot:'interactiveSearch.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, tutorials, search, point of interest, poi',
			created:'10/25/2018'
		},
		{
			title:'Route to a destination',
			desc:'This tutorial shows how to calculate a route and display it on the map.',
			path:'Tutorials/route.html',
			sourcePath:'Tutorials/route.html',
			screenshot:'route.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, tutorials, routing, directions, route, truck, commercial vehicle',
			created:'10/25/2018'
		},
		{
			title:'Search for points of interest',
			desc:'This tutorial shows how to search for points of interest and display them on the map.',
			path:'Tutorials/search.html',
			sourcePath:'Tutorials/search.html',
			screenshot:'search.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, tutorials, search',
			created:'10/25/2018'
		},
		{
			title:'Multiple routes by mode of travel',
			desc:'This tutorial shows how to perform multiple routes for different modes of travel and display them on the map.',
			path:'Tutorials/truckRoute.html',
			sourcePath:'Tutorials/truckRoute.html',
			screenshot:'truckRoute.png',
			keywords:'microsoft maps, map, gis, api, sdk, services, module, tutorials, routing, directions, route, truck, commercial vehicle',
			created:'10/25/2018'
		},
		{
			title:'Simple Store Locator',
			desc:'This tutorial shows how to create a simple store locator.',
			path:'Tutorials/Simple%20Store%20Locator/index.html',
			sourcePath:'Tutorials/Simple%20Store%20Locator',
			screenshot:'Simple-Store-Locator.png',
			keywords:'microsoft maps, map, gis, api, sdk, tutorials, store locator, locator, coffee, contoso, clustering',
			created:'10/25/2018'
		},
	]
},
{
	category:'Vector tiles',
	desc:'Vector tiles are an efficient way to render larger data sets on the map.',
	samples: [
		{
			title:'Vector tile bubble layer',
			desc:'This sample shows how to how to use a vector tile service to render point data on the map.',
			path:'Vector%20tiles/Vector%20tile%20bubble%20layer.html',
			sourcePath:'Vector%20tiles/Vector%20tile%20bubble%20layer.html',
			screenshot:'Vector-tile-bubble-layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, markers, pins, pushpins, symbols, layer, bubbles, clustering, vector tiles, mbtiles, traffic, layer, flow, incidents',
			created:'7/2/2020'
		},
		{
			title:'Vector tile heat map',
			desc:'This sample shows how to how to use a vector tile service to render data as a heat map.',
			path:'Vector%20tiles/Vector%20tile%20heat%20map.html',
			sourcePath:'Vector%20tiles/Vector%20tile%20heat%20map.html',
			screenshot:'Vector-tile-heat-map.png',
			keywords:'microsoft maps, map, gis, api, sdk, heatmap, heat map, heatmaps, heat maps, density, layer, thermatic, vector tiles, mbtiles, traffic, layer, flow, incidents',
			created:'7/2/2020'
		},
		{
			title:'Vector tile line layer',
			desc:'This sample shows how to how to use a vector tile service to render line data on the map.',
			path:'Vector%20tiles/Vector%20tile%20line%20layer.html',
			sourcePath:'Vector%20tiles/Vector%20tile%20line%20layer.html',
			screenshot:'Vector-tile-line-layer.png',
			keywords:'microsoft maps, map, gis, api, sdk, line, linestring, polyline, layer, linelayer, vector tiles, mbtiles, traffic, layer, flow, incidents',
			created:'7/2/2020'
		},
	]
}];var numberOfSamples = 229;
