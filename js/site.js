/******************************/
/****  SET UP CROSSFILTER  ****/
/******************************/
var cf = crossfilter(data);
cf.yearDim = cf.dimension(function(d) {return d.Survey_yr;});
cf.regDim = cf.dimension(function(d){return d.UNICEF_reg;});
cf.countryDim = cf.dimension(function(d) {return d.ISO_3;});

cf.wastingDim = cf.dimension(function(d){return d.Wasting;});
cf.sevWastingDim = cf.dimension(function(d){return d.Sev_wasting;});
cf.stuntingDim = cf.dimension(function(d){return d.Stunting;});

cf.wastingBurdDim = cf.dimension(function(d) {return ((d.Wasting/100)*d.Pop_und5)});
cf.sevWastingBurdDim = cf.dimension(function(d) {return ((d.Sev_wasting/100)*d.Pop_und5)});
cf.stuntingBurdDim = cf.dimension(function(d) {return ((d.Stunting/100)*d.Pop_und5)});


var cf2 = crossfilter(reg_data);
cf2.yearDim = cf2.dimension(function(d) {return d.Survey_yr;});
cf2.regionDim = cf2.dimension(function(d) {return d.ISO_3;});

cf2.wastingDim = cf2.dimension(function(d){return d.Wasting;});
cf2.sevWastingDim = cf2.dimension(function(d){return d.Sev_wasting;});
cf2.stuntingDim = cf2.dimension(function(d){return d.Stunting;});

cf2.wastingBurdDim = cf2.dimension(function(d) {return d.Wasting_burd*1000000;});
cf2.sevWastingBurdDim = cf2.dimension(function(d) {return d.Sev_wasting_burd*1000000;});
cf2.stuntingBurdDim = cf2.dimension(function(d) {return d.Stunting_burd*1000000;});



/***************/
/****  MAP  ****/
/***************/

function colorAllGeoms(data) {
	data.features.forEach(function(d,i) {
		d3.selectAll('.dashgeom'+d.properties.adm0_iso)
			.attr('fill', '#ddd8d8');
	});
}
	
	
function colorData(data) {
	data.forEach(function(d,i) {
		//color = getColor(d.Wasting);   //use switch expression instead here
		//console.log("STAT_CAT = ", currentStatCat);
		switch (currentStatType) {
			case 'prev': 
				switch(currentStatCat) {
					case 'wast': 	color = getColor(d.Wasting); break;
					case 'sevwast': color = getColor(d.Sev_wasting); break;
					case 'stunt':	color = getColor(d.Stunting); break;
					default:		color = '#ddd8d8'; console.log("Error with coloring map for ", d.Country);       
				};
				break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	color = getColor((d.Wasting/100) * d.Pop_und5); break;
					case 'sevwast': color = getColor((d.Sev_wasting/100) * d.Pop_und5); break;
					case 'stunt':	color = getColor((d.Stunting/100) * d.Pop_und5); break;
					default:		color = '#ddd8d8'; console.log("Error with coloring map for ", d.Country);       
				};
				break;
			default: color = '#ddd8d8'; console.log("Error with coloring map for ", d.Country); 
		};			
		d3.selectAll('.dashgeom'+d.ISO_3)
			.attr('fill', color);
			//.attr('weight', 2)
			//.attr('dashArray', '2')
			//.attr('fillOpacity', 0.5); 
	});
}


function colorDataOneCountry(country_a3) {
	color = '';
	data = getCurrentData();
	//console.log("STAT_CAT = ", currentStatCat);
	data.forEach(function(d,i) {
		if (d.ISO_3==country_a3) {
			switch (currentStatType) {
				case 'prev': 
					switch(currentStatCat) {
						case 'wast': 	color = getColor(d.Wasting); break;
						case 'sevwast': color = getColor(d.Sev_wasting); break;
						case 'stunt':	color = getColor(d.Stunting); break;
						default:		color = '#ddd8d8'; console.log("Error with coloring map for ", d.Country);       
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	color = getColor((d.Wasting/100) * d.Pop_und5); break;
						case 'sevwast': color = getColor((d.Sev_wasting/100) * d.Pop_und5); break;
						case 'stunt':	color = getColor((d.Stunting/100) * d.Pop_und5); break;
						default:		color = '#ddd8d8'; console.log("Error with coloring map for ", d.Country);       
					};
					break;
				default: color = '#ddd8d8'; console.log("Error with coloring map for ", d.Country); 
			};
		} 
	});
	if (color=='') {
		color = '#ddd8d8';
	}; 
	return color;
}

function baseStyle(feature) {   //this is just initial base layer - only boundaries & fill opacity needed
	return {
		weight: 1,		  //boundary weight
		opacity: 0.5,	  //boundary opacity
		color: 'black',   //boundary color
		//dashArray: '1', //boundary - length of dashes
		fillOpacity: 1,   //polygon fill opacity
		fillColor: '#ddd8d8',
		className: 'dashgeom dashgeom'+feature.properties.adm0_iso
	};
} 

function getColor(d) {     
	col='';
	//console.log("STAT_CAT = ", currentStatCat, "    d = ", d);
	switch (currentStatType) {
		case 'prev': 
			switch(currentStatCat) {
				case 'wast': 				//Wasting prevalence 0-26 (>20)
					d == -99 ? col='#d3d3d3' : //do we actually have this value ever???  //color scheme = red to yellow
					d >= 20  ? col='#BD0026' :  
					d >= 15  ? col='#F03B20' :  
					d >= 10  ? col='#FD8D3C' :  
					d >= 5   ? col='#FEB24C' :  
					d >= 2   ? col='#FED976' :
							   col='#FFFFB2';   
					break;
				case 'sevwast': 			//Severe Wasting prevalence 0-15.9  (>10)
					d == -99 ? col='#d3d3d3' :   //color scheme = purple to pink
/* 					d >= 10  ? col='#980043' :  
					d >= 5  ? col='#dd1c77' :  
					d >= 2  ? col='#df65b0' :  
					d >= 1   ? col='#c994c7' :  
					d >= 0.5 ? col='#d4b9da' :
							   col='#f1eef6';    */
					d >= 10  ? col='#7a0177' :  	//color scheme = pink to purple
					d >= 5  ? col='#c51b8a' :  
					d >= 2  ? col='#f768a1' :  
					d >= 1   ? col='#fa9fb5' :  
					d >= 0.5 ? col='#fcc5c0' :
							   col='#feebe2'; 
					break;
				case 'stunt':				//Stunting prevalence 0-73.6	(>60)
					d == -99 ? col='#d3d3d3' :   //color scheme = blue to green
					d >= 60  ? col='#253494' : 
					d >= 45  ? col='#2C7FB8' :
					d >= 30  ? col='#41B6C4' :  
					d >= 20   ? col='#7FCDBB' :  
					d >= 10   ? col='#C7E9B4' :
							   col='#EDF4C4'; //'#F0F9E8'; //'#EDF4C4'; //'#EDF8B1';   
					break;		
				default:		
					col='#ddd8d8'; 
					console.log("Error with coloring map for ", d.Country);          
			};
			break;
		case 'burd':
			switch(currentStatCat) {
				case 'wast': 				//Wasting burden 0 - 25,967,070.4 (>10,000,000)
					d == -99 ? col='#d3d3d3' : 									//should be d<0 for burden i.e. anything negative
					d >= 10000000  ? col='#BD0026' :  //'#800026' :
					d >= 5000000   ? col='#F03B20' :  //'#E31A1C' :
					d >= 1000000   ? col='#FD8D3C' :  //'#FC4E2A' :
					d >= 500000    ? col='#FEB24C' :  //'#FEB24C' :
					d >= 250000    ? col='#FED976' :
							         col='#FFFFB2';   //'#FFEDA0';
					break;
				case 'sevwast': 			//Severe Wasting burden 0 - 8,828,803.936  (>5,000,000)
					d == -99 ? col='#d3d3d3' :   //change color scheme
					/* d >= 5000000  ? col='#67001f' :  
					d >= 1000000  ? col='#980043' :  
					d >= 500000   ? col='#db2d6c' :  
					d >= 200000   ? col='#df65b0' :  
					d >= 100000   ? col='#c994c7' :
							        col='#e3d1e7';   */ 
									
				 	d >= 5000000  ? col='#7a0177' :  	//color scheme = pink to purple
					d >= 1000000  ? col='#c51b8a' :  
					d >= 500000  ? col='#f768a1' :  
					d >= 200000   ? col='#fa9fb5' :  
					d >= 100000 ? col='#fcc5c0' :
							   col='#feebe2';  
					break;
				case 'stunt':				//Stunting burden 0 - 75,955,050.52	(>50,000,000)
					d == -99 ? col='#d3d3d3' :  
					d >= 50000000  ? col='#253494' : 
					d >= 20000000  ? col='#2C7FB8' :
					d >= 5000000   ? col='#41B6C4' :  
					d >= 1000000   ? col='#7FCDBB' :  
					d >= 500000    ? col='#C7E9B4' :
							         col='#EDF4C4'; //'#FFFFCC'; //'#F0F9E8'; //'#FFFFCC';   
					break;		
				default:		
					col='#ddd8d8'; 
					console.log("Error with coloring map for ", d.Country);          
			};
			break;
		default: col = '#ddd8d8'; console.log("Error with coloring map for ", d.Country); 
	};
	return col;
} 


function updateLegend() {
	//console.log('**************************** IN UPDATE LEGEND: ', currentStatCat, currentStatType);
	legendUpdate = '';
	legendUpdate += '<p class="maplegend_title">' + getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + '</p>'
	legendUpdate += '<i style="background:' + getColor(-99) + '"></i> ' + '<p class="maplegend_cat">No data</p>';
	switch(currentStatType) {
		case 'prev':
			switch(currentStatCat) {
				case 'wast': 	statCat = wastingPrevCat; break;
				case 'sevwast': statCat = sevWastingPrevCat; break;
				case 'stunt':	statCat = stuntingPrevCat; break;
				default:		statCat = [0,0,0,0,0,0];       
			}; 
			break;
		case 'burd':
			switch(currentStatCat) {
				case 'wast': 	statCat = wastingBurdCat; break;
				case 'sevwast': statCat = sevWastingBurdCat; break;
				case 'stunt':	statCat = stuntingBurdCat; break;
				default:		statCat = [0,0,0,0,0,0];       
			}; 
			break;
		default: statCat = [0,0,0,0,0,0];
	};
	for (var i = 0; i < statCat.length; i++) {	
		switch(currentStatType) {
			case 'prev':
				legendUpdate += '<i style="background:' + getColor(statCat[i]) + '"></i> ' + ((statCat[i+1]) ? '<p class="maplegend_cat">' + statCat[i] + '-' + statCat[i+1] + '%</p>' : '<p class=maplegend_cat>>' + statCat[i] + '%</p>');	
				break;
			case 'burd':
				legendUpdate += '<i style="background:' + getColor(statCat[i]) + '"></i> ' + ((statCat[i+1]) ? '<p class="maplegend_cat">' + (d3.format(",.0f"))(statCat[i]) + '-' + (d3.format(",.0f"))(statCat[i+1]) + '</p>' : '<p class=maplegend_cat>>' + (d3.format(",.0f"))(statCat[i]) + '</p>');	
				break;
			default: 
				legendUpdate += '<p>Error loading legend</p>';
		}					
	}	
	$('.maplegend').html(legendUpdate);	
};


function updateInfo(name, yr, val, yrs_since_surv) {
	//console.log("name,yr,val", currentStatCat, currentStatType, name, yr, val);
	infoUpdate = '<p>[Country statistics]</p>';
	last_surv_yr = yr - yrs_since_surv;
	prev_surv_html = '<p class="mapinfo_stat">Last survey year: ' + last_surv_yr + '</p>';
	switch(currentStatType) {
		case 'prev':
			infoUpdate = ((name && yr && val) ?  ('<p class="mapinfo_title">' + name + ', ' + yr + '</p><p class="mapinfo_stat">' + getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ': ' + val + '%</p>' + prev_surv_html) : ((name && yr) ?  ('<p class="mapinfo_title">' + name + ', ' + yr + '</p><p class="mapinfo_stat">' + getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ': <i>No data</i></p>') : "<p class='mapinfo_title'>Hover over a country, a bar, or a country's time series to get statistics</p>")); 
			break;
		case 'burd':
			infoUpdate = ((name && yr && val) ?  ('<p class="mapinfo_title">' + name + ', ' + yr + '</p><p class="mapinfo_stat">' + getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ': ' + val + '</p>' + prev_surv_html) : ((name && yr) ?  ('<p class="mapinfo_title">' + name + ', ' + yr + '</p><p class="mapinfo_stat">' + getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ': <i>No data</i></p>') : "<p class='mapinfo_title'>Hover over a country, a bar, or a country's time series to get statistics</p>")); 
			break;
		default:
			infoUpdate = 'Error loading country statistics';
	};
	$('.mapinfo').html(infoUpdate);	
}; 


function getInfoData(iso) {
	data = getCurrentData();
	countryName = '';
	survYr = '';
	statVal = '';
	yrsSinceSurv = '';
	data.forEach(function(d,i) {
		if (d.ISO_3==iso) {
			countryName = d.Country;
			survYr = d.Survey_yr;
			switch (currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	statVal = (d3.format(".3n"))(d.Wasting); 
										yrsSinceSurv = d.Wast_yrs_since_surv;
										break;
						case 'sevwast': statVal = (d3.format(".3n"))(d.Sev_wasting); 
										yrsSinceSurv = d.Sev_wast_yrs_since_surv;
										break;
						case 'stunt':	statVal = (d3.format(".3n"))(d.Stunting); 
										yrsSinceSurv = d.Stunt_yrs_since_surv;
										break;
						default:		statVal = -99; 
										yrsSinceSurv = -99;
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	statVal = (d3.format(",.0f"))((d.Wasting/100) * d.Pop_und5); 
										yrsSinceSurv = d.Wast_yrs_since_surv;
										break;
						case 'sevwast': statVal = (d3.format(",.0f"))((d.Sev_wasting/100) * d.Pop_und5); 
										yrsSinceSurv = d.Sev_wast_yrs_since_surv;
										break;
						case 'stunt':	statVal = (d3.format(",.0f"))((d.Stunting/100) * d.Pop_und5); 
										yrsSinceSurv = d.Stunt_yrs_since_surv;
										break;
						default:		statVal = -99;   
										yrsSinceSurv = -99;
					};
					break;
				default: statVal = -99;	
						 yrsSinceSurv = -99;	
			}; 
		};
	}); 
	infodata = [countryName, survYr, statVal, yrsSinceSurv];
	return infodata;
}


function generateMap(id,data){ 		 
	var baselayer = L.tileLayer('https://data.hdx.rwlabs.org/mapbox-base-tiles/{z}/{x}/{y}.png', {
		//attribution: '<a href="https://data.hdx.rwlabs.org/" target="_blank">HDX</a>',
	});	 

	var map = L.map('map', {
        center: [0,0],  
        zoom: 2,
		layers: [baselayer],
    }); 
	
	var mapInfo = L.control({position: 'topright'});	
	mapInfo.onAdd = function (map) {
		var infoDiv = L.DomUtil.create('infoDiv', 'mapinfo');   //create a div with class'mapinfo'
		updateInfo('','','','');
		return infoDiv;
		};
	mapInfo.addTo(map);	
	
	wastingPrevCat = [0,2,5,10,15,20];
	sevWastingPrevCat = [0,0.5,1,2,5,10];
	stuntingPrevCat = [0,10,20,30,45,60];
	wastingBurdCat = [0,250000,500000,1000000,5000000,10000000];
	sevWastingBurdCat = [0,100000,200000,500000,1000000,5000000];
	stuntingBurdCat = [0,500000,1000000,5000000,20000000,50000000];	
	
	var mapLegend = L.control({position: 'bottomleft'});			
	mapLegend.onAdd = function (map) {	
		legendDiv = L.DomUtil.create('legendDiv', 'maplegend'); 	// create a div with class 'maplegend'
		updateLegend();
		return legendDiv;
	};
	mapLegend.addTo(map);
	
	var the_overlay = L.geoJson(countries_all,{
                style: baseStyle,
                onEachFeature: onEachFeature
            }).addTo(map);  
						
	document.getElementById('regionbuttons').onclick = function(abc) {    //zoom to region when user clicks on region button
		//console.log("CLICKED ON ZOOM TO REGION");
        var pos = abc.target.getAttribute('data-position');
        var zoom = abc.target.getAttribute('data-zoom');
        if (pos && zoom) {
            var locat = pos.split(',');
            var zoo = parseInt(zoom);
            map.setView(locat, zoo, {animation: true});
			//console.log("data-position: ", pos, "data-zoom: ", zoom);
            return false;
        }
    }  
						
	return map;
	
	
	function onEachFeature(feature, layer) {	
		layer.on("mouseover", function(f,l) {
			infodata = getInfoData(f.target.feature.properties.adm0_iso);
			if (infodata[0]=='') {
				infodata[0] = f.target.feature.properties.name_eng,
				infodata[1] = currentYr
			}; 
			updateInfo(infodata[0], infodata[1], infodata[2], infodata[3]);
		});
		layer.on("mouseout", function(f,l) {
			updateInfo('','','','');
		}); 
		layer.on("click", function(f,l) {
			if (getInfoData(f.target.feature.properties.adm0_iso)[0] != '') {		//if there exists data for this feature
				addCountryLine('#linegraph', f.target.feature.properties.adm0_iso, 'perm');
			};
		}); 
		layer.on("dblclick", function(f,l) {			
			if (getInfoData(f.target.feature.properties.adm0_iso)[0] != '') {		//if there exists data for this feature
				removeCountryLine('#linegraph', f.target.feature.properties.adm0_iso, 'perm');
			};
			//zoomToFeature;
		}); 
		layer.on({
			mouseover: highlightFeature,
			mouseout:  resetHighlight,      
			//dblclick: zoomToFeature		  
		});
	}
	
	
	function highlightFeature(e) {
		var layer = e.target;
		var highlightColor = '#ffff00';
		layer.setStyle({
			weight: 5,			//boundary weight
			opacity: 1,			//boundary opacity
			color: '#767373', 	//'#666', //boundary color 
			//dashArray: '',	//boundary - length of dashes
			fillColor: colorDataOneCountry(layer.feature.properties.adm0_iso),
			fillOpacity: 1,		//polygon fill opacity
		})
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		} 
		//info.update(layer.feature.properties);   //does it make sense to updateInfo here?
		
		var lowBars = d3.selectAll('rect.lower_bar'+ layer.feature.properties.adm0_iso); 
		var uppBars = d3.selectAll('rect.upper_bar'+ layer.feature.properties.adm0_iso);
		lowBars.attr('fill', highlightColor);
		uppBars.attr('fill', highlightColor);
		
		if (getInfoData(layer.feature.properties.adm0_iso)[0] != '') {		//if there exists data for this feature
			addCountryLine('#linegraph', layer.feature.properties.adm0_iso, 'temp');
		};
	}

	function resetHighlight(e) {	
		var layer = e.target;
		var origColor = colorDataOneCountry(layer.feature.properties.adm0_iso);
 		layer.setStyle({
			weight: 1,		  //boundary weight
			opacity: 0.5,	  //boundary opacity
			color: 'black',   //boundary color
			//dashArray: '', //boundary - length of dashes
			fillColor: origColor,
			fillOpacity: 1    //polygon fill opacity
		}); 
		//info.update();				//does it make sense to updateInfo here?
		
		var lowBars = d3.selectAll('rect.lower_bar'+ layer.feature.properties.adm0_iso); 
		var uppBars = d3.selectAll('rect.upper_bar'+ layer.feature.properties.adm0_iso);
		lowBars.attr('fill', origColor);
		uppBars.attr('fill', origColor);
		
		if (getInfoData(layer.feature.properties.adm0_iso)[0] != '') {		//if there exists data for this feature
			removeCountryLine('#linegraph', layer.feature.properties.adm0_iso, 'temp');
		};
	} 

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

}


function updateMap(id,data){ 
 	//console.log("In updateMap, map object = ", map);
	colorAllGeoms(countries_all);
	colorData(data);
	
}


/************************/
/*****  LINE GRAPH  *****/  
/************************/

function generateLineGraph(id){ 
	var margin = {top: 10, left: 40, right: 20, bottom: 20};  //margins of actual x- and y-axes within the svg
	var width = $(id).width() - margin.left - margin.right;  	//width of main svg
	var height = $(id).height() - margin.top - margin.bottom;   //height of main svg	
			
	var yrScale = d3.scale.linear()
            .range([0, width])    		//x-axis width, accounting for specified margins
            .domain([minYr,maxYr]);              
	
	var lineDom = getLinegraphDomain();
	var yScale = d3.scale.linear()   
			.domain([lineDom[0],lineDom[1]]) 			
            .range([height, 0]);	    //y-axis height, accounting for specified margins
			
			
	//Define axes
	var xAxis = d3.svg.axis()
				.scale(yrScale)
				.orient("bottom")	//orient tick marks only 
				.tickFormat(function(d, i) {
					return d3.format("")(d)
				}); 
					
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")		//orient tick marks only
				.tickFormat(function(d, i) {
					switch(currentStatType) {
						case 'prev':	return d3.format(",.0f")(d); break;
						case 'burd':	return d3.format("s")(d); break;
						default:		return d3.format(",.0f")(d);
					};
				 })
				.ticks(5);
	
	
	//Render main SVG
	var lineGraph = d3.select(id)           //create a d3.svg called 'lineGraph' - could classed as e.g. 'chart' (prob just for css?)  
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
		  
 	var g = lineGraph.append('g')			//create a group 'g' in the main svg/'lineGraph' and shift it over by left & top margins
		//.attr('fill', 'blue')
		.attr("width", width)
		.attr("height", height)
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); 
				
	
	//Render axes
	g.append('g')
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + height + ")")	//translate by 'height' to shift whole x axis down to bottom
		.call(xAxis);	
		
	g.append('g')
		.attr("class", "y axis")
		//.attr("transform", "translate(" + 30 + ",0)")
		.call(yAxis); 
		
	//Render grey line showing current year
	lineGraph.append("line")
		.attr("class", "year_line")
		.attr("x1", margin.left + yrScale(currentYr))  
		.attr("y1", margin.top)    			//+ve value moves down from top
		.attr("x2", margin.left + yrScale(currentYr))  
		.attr("y2", height + margin.top)			//-ve value moves up from bottom
		.attr('stroke', '#c7c9c9')  //light grey
		//.attr('stroke-dasharray', '5, 5')
		.attr("stroke-width", 1);	
		
		
 	//Add intro text to linegraph to explain how to add/remove country lines	
	var g2 = lineGraph.append('text')				//create a group 'g2' in the main svg/'lineGraph' 
		.attr("class","linegraph_intro")
		.attr("x", 55)
		.attr("y", 50)
		//.attr('font-size', '12px')
		.style('fill', 'darkOrange')
		.html('Click on country in map or barchart');
	var g2 = lineGraph.append('text')				 
		.attr("class","linegraph_intro")
		.attr("x", 130)
		.attr("y", 70)
		.style('fill', 'darkOrange')
		.html('to add here');

	var g2 = lineGraph.append('text')
		.attr("class","linegraph_intro")
		.attr("x", 50)
		.attr("y", 100)
		.style('fill', 'darkOrange')
		.html('Double-click country in map, barchart'); 
	var g2 = lineGraph.append('text')				
		.attr("class","linegraph_intro")
		.attr("x", 110)
		.attr("y", 120)
		.style('fill', 'darkOrange')
		.html('or here to remove'); 
		
	return lineGraph;
					
};


function addLineGraphIntroText() {
	lineGraph.selectAll('.linegraph_intro')
		.style("opacity", 1);
		
	return lineGraph;
	
};



function getLinegraphDomain() {
	points = getPointData();
	//console.log("points = ", points);
	switch (currentStatType) {
		case 'prev':
			switch(currentStatCat) {			//get max each time linegraph domain is accessed
				case 'wast': 	if (points.length==0) {maxY = 26;} else {maxY = d3.max(points, function(d) {return d.Wasting;})}; break;
				case 'sevwast': if (points.length==0) {maxY = 16;} else {maxY = d3.max(points, function(d) {return d.Sev_wasting;})}; break;
				case 'stunt':	if (points.length==0) {maxY = 74;} else {maxY = d3.max(points, function(d) {return d.Stunting;})}; break;
				default:		maxY = 0; break;
			};
			domX = 0;
			domY = maxY;
			break;
		case 'burd':
			switch(currentStatCat) {		
				case 'wast': 	if (points.length==0) {
									maxY = 26000000;
								} else {
									maxY = d3.max(points, function(d) {
										if (d.ISO_3.substring(0,2)=="XX") {
											return d.Wasting_burd*1000000;
										} else {
											return (d.Wasting/100)*d.Pop_und5;
										};
									});
								};										
								break;						
				case 'sevwast': if (points.length==0) {
									maxY = 9000000;
								} else {
									maxY = d3.max(points, function(d) {
										if (d.ISO_3.substring(0,2)=="XX") {
											return d.Sev_wasting_burd*1000000;
										} else {
											return (d.Sev_wasting/100)*d.Pop_und5;
										};
									});
								};										
								break;	
				case 'stunt': 	if (points.length==0) {
									maxY = 76000000;
								} else {
									maxY = d3.max(points, function(d) {
										if (d.ISO_3.substring(0,2)=="XX") {
											return d.Stunting_burd*1000000;
										} else {
											return (d.Stunting/100)*d.Pop_und5;
										};
									});
								};										
								break;	
				default:		maxY = 0; break;
			};
			domX = 0;
			domY = maxY;
			break;
		default: domX = 0; domY = 0;
	}; 
	//console.log("[domX, domY] = ", domX, domY);
	return [domX, domY];
}


function updateYearLineGraph(id){    //shifts vertical grey line to current year in line graph
	var margin = {top: 10, left: 40, right: 20, bottom: 20};
	var width = $(id).width() - margin.left - margin.right;  
	var height = $(id).height() - margin.top - margin.bottom;  
	
	var yrScale = d3.scale.linear()
            .range([0, width])    
            .domain([minYr,maxYr]);  
			
	var year_line = lineGraph.selectAll('.year_line');

	year_line.transition()
	    .duration(1000)  
		.attr("class", "year_line")
		.attr("x1", margin.left + yrScale(currentYr))  
		.attr("y1", margin.top)    		
		.attr("x2", margin.left + yrScale(currentYr))  
		.attr("y2", height + margin.top)		
		.attr('stroke', '#c7c9c9')  //light grey
		//.attr('stroke-dasharray', '5, 5')
		.attr("stroke-width", 1);
		
	return lineGraph;
		
};


function addCountryLine(id, iso_code, status){ 
	var margin = {top: 10, left: 40, right: 20, bottom: 20};
	var width = $(id).width() - margin.left - margin.right;  
	var height = $(id).height() - margin.top - margin.bottom;  
	
	var yrScale = d3.scale.linear()
            .range([0, width])    
            .domain([minYr,maxYr]);  
			
	var lineDom = getLinegraphDomain();
	var yScale = d3.scale.linear()   
			.domain([lineDom[0],lineDom[1]]) 							
            .range([height, 0]);	
			
	//Define axes
	var xAxis = d3.svg.axis()
				.scale(yrScale)
				.orient("bottom")	//orient tick marks only 
				.tickFormat(function(d, i) {
					return d3.format("")(d)
				});  
					
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")		//orient tick marks only
				.tickFormat(function(d, i) {
					switch(currentStatType) {
						case 'prev':	return d3.format(",.0f")(d); break;
						case 'burd':	return d3.format("s")(d); break;
						default:		return d3.format(",.0f")(d);
					};
				 })
				.ticks(5);
	
	//check whether country is in currentCountryLines array
	in_list = false;
	pos_currentCountryLines = get_pos_currentCountryLines(iso_code);	
	if (pos_currentCountryLines == -1) {
		in_list = false;
	} else {
		in_list = true;
	};
	
	//set line_color for country
	if ((status=="perm") && (in_list==false)) {		//if permanent (i.e. clicked on) but new to list then assign new color and add to currentCountryLines
		if (iso_code=="XX0") { 						//global stat
			line_color = '#000000';						//black
		} else if (iso_code.substring(0,2)=="XX") {	//regional stat
			line_color = '#4b4949';						//dark grey
		} else {
			line_color = getNewCountryLineColor(iso_code);
		};
		countryLine = {};
		countryLine.iso = iso_code;
		countryLine.color = line_color;
		currentCountryLines.push(countryLine);
		//console.log("******************************************************** added ", iso_code, ", to list,  currentCountryLines = ", currentCountryLines);
	} else if ((status=="perm") && (in_list==true)) {		
		line_color = getExistingCountryLineColor(iso_code);
	} else if ((status=="temp") && (in_list==true)) {		
		line_color = getExistingCountryLineColor(iso_code);
	} else if ((status=="temp") && (in_list==false)) {	
		line_color = 'none';
	};
	
	if (currentCountryLines.length != 0) {
		var linegraph_text = d3.selectAll('.linegraph_intro')
			.style("opacity", 0);
	}
	
	if (iso_code.substring(0,2)=="XX") {
		countryData = getRegionalData(iso_code);
	} else {
		countryData = getCountryData(iso_code);
	};
	
	var lineFunction = d3.svg.line()
		.x(function(d) {return margin.left + yrScale(d.Survey_yr)})
		.y(function(d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; break;
						case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting;} else {stat = d.Sev_wasting;}; break;	
						case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting;} else {stat = d.Stunting;}; break;
						default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; 
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; break;
						case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting_burd*1000000;;} else {stat = ((d.Sev_wasting/100) * d.Pop_und5);}; break;
						case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting_burd*1000000;} else {stat = ((d.Stunting/100) * d.Pop_und5);}; break;
						default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; 
					};
					break;
				default: stat = d.Wasting;
			};
			val = margin.top + yScale(stat);
			return val;            			
		}) 
		.interpolate('linear');
		
		
 	lineGraph.append('path')
        .datum(countryData)
        .attr('class', function (d) {
			if (status=='perm') {
				return 'country_line country_line' + d[0].ISO_3;	//adding class for country's ISO
			} else if (status=='temp') {
				return 'country_line country_line' + d[0].ISO_3 + '_temp';
			};
		})	
        .attr('d', lineFunction)
        //.attr("stroke", "red")
		 .attr("stroke", function (d) {
			if ((status=='perm')) {
				return line_color;	
			} else if (status=='temp') {
				return 'yellow';
			};
		})	 
        //.attr("stroke-width", 1)
		.attr("stroke-width", function (d) {
			if (status=='perm') {
				return '1';	
			} else if (status=='temp') {
				return '3';
			};
		})	
		.attr("fill", "none")
		.on("mouseover", function (d) {
			mouseoverCountryLineFunction(d);
		})
		.on("mouseout", function (d) {
			mouseoutCountryLineFunction(d);
		})
		.on("dblclick", function (d) {
			mouseoutCountryLineFunction(d);
			removeCountryLine('#linegraph', d[0].ISO_3, 'perm');
		});   
		
		
	if (status=='perm') {	
		pointData = getPointData();  
		lineGraph.selectAll("circle")  
			.data(pointData)
			.enter()
			.append("circle") 
			.attr('class', function (d) {
					//console.log("Append data circle for: ", d.ISO_3, d.Survey_yr);
					if (status=='perm') {
						return 'country_line country_line' + d.ISO_3 + ' data_point data_point' + d.ISO_3 + ' data_point' + d.ISO_3 + d.Survey_yr;	
					} else if (status=='temp') {
						return 'country_line country_line' + d.ISO_3 + '_temp data_point';
					};
				})	
			.attr("cy", function(d){
					switch(currentStatType) {
						case 'prev':
							switch(currentStatCat) {
								case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; break;
								case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting;} else {stat = d.Sev_wasting;}; break;  
								case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting;} else {stat = d.Stunting;}; break;
								default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; 
							};
							break;
						case 'burd':
							switch(currentStatCat) {
								case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; break;
								case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting_burd*1000000;} else {stat = ((d.Sev_wasting/100) * d.Pop_und5);}; break;
								case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting_burd*1000000;} else {stat = ((d.Stunting/100) * d.Pop_und5);}; break;
								default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; 
							};
							break;
						default: stat = d.Wasting;
					};
					val = margin.top + yScale(stat);
					return val;  
        			
				})
			.attr("cx", function(d){
					return margin.left + yrScale(d.Survey_yr);
				})
			.attr("r", 3)
			.attr("fill", function (d) {
				if ((status=='perm')) { 
					return line_color;	
				} else if (status=='temp') {
					return 'yellow';
				}; 
			})	 
			.style('opacity', function (d) {
				val = 0;
				switch(currentStatCat) {
					case 'wast': 	if (d.Wast_yrs_since_surv == 0) {val=1;}; break;
					case 'sevwast': if (d.Sev_wast_yrs_since_surv == 0) {val=1;}; break;
					case 'stunt':	if (d.Stunt_yrs_since_surv == 0) {val=1;}; break;
					default:		val = 0; 
				};		
				return val; 
			})
			.on("mouseover", function (d) {
				mouseoverPointFunction(d);
			})
			.on("mouseout", function (d) {
				mouseoutPointFunction(d);
			})
			.on("dblclick", function (d) {
				tip.hide(d);
				mouseoutPointFunction(d);
				removeCountryLine('#linegraph', d.ISO_3, 'perm');
			});  
	};
	
	lineGraph.selectAll(".x.axis")
		.transition()
		.duration(1000)
		.call(xAxis);  
		
	//Update y-axis
	lineGraph.selectAll(".y.axis")
		.transition()
		.duration(1000)
		.call(yAxis);  	
		
	transitionCurrentCountryLines('#linegraph', iso_code);  //add iso_code for temp hovered country
		
	lineGraph.call(tip);

};


var mouseoverCountryLineFunction = function(d) {   
	console.log("In mouseoverCountryLineFunction for ", d[0].ISO_3, "  d = ", d);
	var highlightColor = '#ffff00';
		
	//Create tooltip variable for path on linegraph:	
/* 	var line_tip = {Country: d[0].Country,
					ISO_3:"XXX"};
	tip.show(line_tip); */
	
	//set highlight color for country_line
	var country_line = d3.selectAll('.country_line'+ d[0].ISO_3); 
	country_line.attr('stroke', highlightColor)
		.attr("stroke-width", 3);
		
	if (d[0].ISO_3.substring(0,2)!="XX") {
		
		//highlight bars on barchart	
		var lowBars = d3.selectAll('rect.lower_bar'+ d[0].ISO_3); 
		var uppBars = d3.selectAll('rect.upper_bar'+ d[0].ISO_3);
		lowBars.attr('fill', highlightColor);
		uppBars.attr('fill', highlightColor);
		
		//highlight country in map
		d3.selectAll('.dashgeom'+d[0].ISO_3)
			.attr('fill', highlightColor)
			.attr('fillOpacity', '0.5'); //not working
		
		//update info box in map
		infodata = getInfoData(d[0].ISO_3);
		if (infodata[0]=='') {
			infodata[0] = d[0].Country,
			infodata[1] = currentYr
		};  
		updateInfo(infodata[0], infodata[1], infodata[2], infodata[3]);
	};
		
};

var mouseoutCountryLineFunction = function(d) { 
	//console.log("In mouseoutCountryLineFunction for ", d[0].ISO_3, "  d = ", d);
	
	/* var line_tip = {Country: d[0].Country,
					ISO_3:"XXX"};
	tip.hide(line_tip); */
		
	//reset color for country_line
	var resetColor = getExistingCountryLineColor(d[0].ISO_3);
	var country_line = d3.selectAll('.country_line'+ d[0].ISO_3); 
	country_line.attr('stroke', resetColor)
		.attr("stroke-width", 1);
				
	if (d[0].ISO_3.substring(0,2)!="XX") {	  //reset color for bars in barchart
		var origBarColor = colorDataOneCountry(d[0].ISO_3);
		var lowBars = d3.selectAll('rect.lower_bar'+ d[0].ISO_3); 
		var uppBars = d3.selectAll('rect.upper_bar'+ d[0].ISO_3);
		lowBars.attr('fill', origBarColor);
		uppBars.attr('fill', origBarColor);	
		
		//revert country highlight back to original
		d3.selectAll('.dashgeom'+d[0].ISO_3)
			.attr('stroke-width', '1')
			.attr('stroke-opacity', '0.5')
			.attr('stroke', 'black')
			.attr('fill', origBarColor)
			.attr('fillOpacity', '1');    //not working - probably need a different attr name not fillOpacity
		
		//clear info box in map
		updateInfo('','','','');
	}
};


var mouseoverPointFunction = function(d) {	
	var highlightColor = '#ffff00';
	
	tip.show(d);
	
	//set highlight color for country_line
	var country_line = d3.selectAll('.country_line'+ d.ISO_3); 
	country_line.attr('stroke', highlightColor)
		.attr("stroke-width", 3);
		
	//set highlight color for data_point
	var data_point = d3.selectAll('.data_point'+ d.ISO_3 + d.Survey_yr); 
	data_point.attr('fill', highlightColor)
		.style('opacity', 1);
		
	if (d.ISO_3.substring(0,2)!="XX") {
		//highlight bars on barchart	
		var lowBars = d3.selectAll('rect.lower_bar'+ d.ISO_3); 
		var uppBars = d3.selectAll('rect.upper_bar'+ d.ISO_3);
		lowBars.attr('fill', highlightColor);
		uppBars.attr('fill', highlightColor);
		
		//highlight country in map
		d3.selectAll('.dashgeom'+d.ISO_3)
			.attr('fill', highlightColor)
			.attr('fillOpacity', '0.5'); //not working
		
		//update info box in map
		infodata = getInfoData(d.ISO_3);
		if (infodata[0]=='') {
			infodata[0] = d.Country,
			infodata[1] = currentYr
		};  
		updateInfo(infodata[0], infodata[1], infodata[2], infodata[3]);
	};
	
	
};

var mouseoutPointFunction = function(d) {	
	
	tip.hide(d);
	
	//reset color for country_line
	var resetColor = getExistingCountryLineColor(d.ISO_3);
	var country_line = d3.selectAll('.country_line'+ d.ISO_3); 
	country_line.attr('stroke', resetColor)
		.attr("stroke-width", 1);
		
	//reset highlight color for data_point
	var data_point = d3.selectAll('.data_point'+ d.ISO_3 + d.Survey_yr); 
	data_point.attr('fill', resetColor)
		.style('opacity', function (d) {
			val = 0;
			switch(currentStatCat) {
				case 'wast': 	if (d.Wast_yrs_since_surv == 0) {val=1;}; break;
				case 'sevwast': if (d.Sev_wast_yrs_since_surv == 0) {val=1;}; break;
				case 'stunt':	if (d.Stunt_yrs_since_surv == 0) {val=1;}; break;
				default:		val = 0; 
			};		
			return val; 
		});
	
	
	if (d.ISO_3.substring(0,2)!="XX") {
		//reset color for bars in barchart
		var origBarColor = colorDataOneCountry(d.ISO_3);
		var lowBars = d3.selectAll('rect.lower_bar'+ d.ISO_3); 
		var uppBars = d3.selectAll('rect.upper_bar'+ d.ISO_3);
		lowBars.attr('fill', origBarColor);
		uppBars.attr('fill', origBarColor);	
		
		//revert country highlight back to original
		d3.selectAll('.dashgeom'+d.ISO_3)
			.attr('stroke-width', '1')
			.attr('stroke-opacity', '0.5')
			.attr('stroke', 'black')
			.attr('fill', origBarColor)
			.attr('fillOpacity', '1'); //not working - probably need a different attr name not fillOpacity
		
		//clear info box in map
		updateInfo('','','','');
	};
}; 


//Create tooltip variable for points on linegraph:	
var tip = d3.tip()																		
	.attr('class', 'd3-tip')
	/* .offset(function (d) {
		if (d.ISO_3=="XXX") {return [0,0];}
		else {return [-10,4];}
	}) */
	.offset([-10,4])
	.html(function(d) {
		tip_text = '';
		//if (d.ISO_3=="XXX") {tip_text = d.Country}
		//else {		
		if (d.ISO_3.substring(0,2)=="XX") {
			name = getRegName(d.Region);
		} else {
			name = d.Country;
		}
		switch(currentStatType) {
			case 'prev':
				switch(currentStatCat) {
					case 'wast': 	statVal = (d3.format(".3n"))(d.Wasting); break;
					case 'sevwast': statVal = (d3.format(".3n"))(d.Sev_wasting); break;
					case 'stunt':	statVal = (d3.format(".3n"))(d.Stunting); break;
					default:		statVal = -99; console.log("Error creating tooltip");       
				};
				tip_text = "<span style='color:black'>" + name + ", " + d.Survey_yr + ": " + statVal + "%</span>";
				break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	if (d.ISO_3.substring(0,2)=="XX") {
										statVal = (d3.format(",.0f"))(d.Wasting_burd*1000000);
									} else {
										statVal = (d3.format(",.0f"))((d.Wasting/100) * d.Pop_und5);
									}; 
									break;						
					case 'sevwast': if (d.ISO_3.substring(0,2)=="XX") {
										statVal = (d3.format(",.0f"))(d.Sev_wasting_burd*1000000);
									} else {
										statVal = (d3.format(",.0f"))((d.Sev_wasting/100) * d.Pop_und5);
									}; 
									break;
					case 'stunt':	if (d.ISO_3.substring(0,2)=="XX") {
										statVal = (d3.format(",.0f"))(d.Stunting_burd*1000000);
									} else {
										statVal = (d3.format(",.0f"))((d.Stunting/100) * d.Pop_und5);
									}; 
									break;	
					default:		statVal = -99; console.log("Error creating tooltip");       
				};
				tip_text = "<span style='color:black'>" + name + ", " + d.Survey_yr + ": " + statVal + "</span>";
				break;
			default: tip_text = "<span style='color:black'>" + name + ", " + d.Survey_yr + ": <i>Error</i></span>"; console.log("Error creating tooltip");
		}; 
		//};
		return tip_text;
	}); 			
		
		
function get_pos_currentCountryLines(iso_code) {			//returns position in list, otherwise -1 if not in list
	pos = -1;
	currentCountryLines.forEach(function(d,i) {
		if (d.iso == iso_code) {
			pos = i;
		};
	});
	return pos;
};


function getExistingCountryLineColor(iso_code) {		//get line color for existing country lines
	countryPos = get_pos_currentCountryLines(iso_code);
	col = 'black';
	
	if (countryPos!=-1) {		
		col = currentCountryLines[countryPos].color;		
	}
	//console.log("Existing country line ", iso_code, "   country position ", countryPos, " = ", col);
	return col;
};


function getNewCountryLineColor(iso_code) {			    //get line color for new country lines
	allCountryLineColors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#a65628','#f781bf','#999999','#1b9e77','#d95f02','#e7298a','#e6ab02'];
	currentCountryLineColors = allCountryLineColors;
	
	currentCountryLines.forEach(function(d,i) {
		if (d.color != '#000000') {
			currentCountryLineColors.push(d.color);		//list of all colors currently in use except black
		};
	});	
	//console.log("currentCountryLineColors: ", currentCountryLineColors);
	
	freq_asc = currentCountryLineColors.leastFrequent();
	col = freq_asc[0].key;	
	
	return col;
};


Array.prototype.leastFrequent = function() {
  var o = {};
  this.filter(function(el) { return el; }).forEach(function(el) {
      o[el] = (o[el] || 0) + 1;
  });
  return Object.keys(o).map(function (key) {
      return { key: key, occurrences: o[key] };
  }).sort(function(a, b) {
    return a.occurrences - b.occurrences;
  });
}



function removeCountryLine(id, iso_code, status){ 
	var margin = {top: 10, left: 40, right: 20, bottom: 20}; 
	var width = $(id).width() - margin.left - margin.right;  
	var height = $(id).height() - margin.top - margin.bottom;  

	//console.log("******************************************************** remove country = ", iso_code);

	var yrScale = d3.scale.linear()
            .range([0, width])    
            .domain([minYr,maxYr]);  
	
	var lineDom = getLinegraphDomain();
	var yScale = d3.scale.linear()   
			.domain([lineDom[0],lineDom[1]]) 			
            .range([height, 0]);
			
	var xAxis = d3.svg.axis()
				.scale(yrScale)
				.orient("bottom")	//orient tick marks only 
				.tickFormat(function(d, i) {
					return d3.format("")(d)
				});  		
				
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")		//orient tick marks only
				.tickFormat(function(d, i) {
					switch(currentStatType) {
						case 'prev':	return d3.format(",.0f")(d); break;
						case 'burd':	return d3.format("s")(d); break;
						default:		return d3.format(",.0f")(d);
					};
				 })
				.ticks(5);
	
	
	//check whether country in currentCountryLines array
	in_list = false;
	pos_currentCountryLines = get_pos_currentCountryLines(iso_code);
	if (pos_currentCountryLines == -1) {
		in_list = false;
	} else {
		in_list = true;
	}; 	

	
	//set line_color for country	
	if ((status=="perm") && (in_list==true)) {		
		line_color = getExistingCountryLineColor(iso_code);
	} else if ((status=="temp") && (in_list==true)) {		
		line_color = getExistingCountryLineColor(iso_code);
	} else if ((status=="temp") && (in_list==false)) {	
		line_color = 'none';
	} else {
		console.log("*************** ERROR SHOULDN'T BE HERE!!!!! ******************");
	};	
	var resetColor = line_color;
	
	
	if (status=='perm') {
		var country_line = d3.selectAll('.country_line'+ iso_code); 	//delete line
		country_line.remove();			
		for (var i = currentCountryLines.length - 1; i >= 0; i--) {		//remove iso_code from array list
			if(currentCountryLines[i].iso === iso_code) {
			   currentCountryLines.splice(i, 1);
			}
		};	
	} else if ((status=='temp')&&(!in_list)) {
		var country_line = d3.selectAll('.country_line'+ iso_code + '_temp'); 
		country_line.remove();
	} else if ((status=='temp')&&(in_list)) {							
		var country_line = d3.selectAll('.country_line'+ iso_code + '_temp'); 
		country_line.remove();
		var country_line = d3.selectAll('.country_line'+ iso_code); 
		country_line.attr('stroke', resetColor)
			.attr("stroke-width", 1);
	};	
	
	
	//Update axes	
	lineGraph.selectAll(".x.axis")
		.transition()
		.duration(1000)
		.call(xAxis);  
	
	lineGraph.selectAll(".y.axis")
		.transition()
		.duration(1000)
		.call(yAxis); 
		
	if (currentCountryLines.length == 0) {
		addLineGraphIntroText();
	}	
	transitionCurrentCountryLines('#linegraph', iso_code);  //add iso_code for temp hovered country
	
	//console.log("******************************************************** currentCountryLines = ", currentCountryLines);
};

function removeAllCountryLines() {
	for (i=0; i <= currentCountryLines.length-1; i++) {
		var country_line = d3.selectAll('.country_line'+ currentCountryLines[i].iso); 
		country_line.remove();				
	};
	currentCountryLines = [];
	addLineGraphIntroText();
};

	
function getPointData() {
	points = [];
	currentCountryLines.forEach(function(d,i) {
		if (d.iso.substring(0,2)=="XX") {
			if (statCat != 'sevwast') {
				data = getRegionalData(d.iso);
			};
		} else {
			data = getCountryData(d.iso);
		}           
		data.forEach(function(d,i) {
			points.push(d);
		});
	});
	//console.log("all points: ", points);
	return points;
};




function getCountryData(iso_code) {	  //returns data for any specified country, for current stat, ordered by chronological year						
	cf.yearDim.filterAll();
	cf.regDim.filterAll();
	cf.countryDim.filter(iso_code);
	
	switch (currentStatType) {		
		case 'prev':
			switch (currentStatCat) {     
				case 'wast':	temp = cf.wastingDim.filter(function(d) {return d >= 0}).top(Infinity); 
								break;
				case 'sevwast':	temp = cf.sevWastingDim.filter(function(d) {return d >= 0}).top(Infinity);
								break;
				case 'stunt':	temp = cf.stuntingDim.filter(function(d) {return d >= 0}).top(Infinity);
								break;
				default:	temp = cf.wastingDim.filter(function(d) {return d >= 0}).top(Infinity);	
							console.log("Error in getting country stats");
			};
			break;
		case 'burd':
			switch (currentStatCat) {      
				case 'wast':	temp = cf.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
								break;
				case 'sevwast':	temp = cf.sevWastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);
								break;
				case 'stunt':	temp = cf.stuntingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);
								break;
				default:	temp = cf.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
							console.log("Error in getting country stats");
			};
			break;
		default: 	temp = cf.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
					console.log("Error in getting country stats")
	};  
	
	temp = cf.yearDim.bottom(Infinity);   //order by chronological year
	
	cf.wastingDim.filterAll(); 			//remove any filters on stats or country so subsequent operations have a clean start
	cf.sevWastingDim.filterAll();
	cf.stuntingDim.filterAll();
	cf.wastingBurdDim.filterAll();
	cf.sevWastingBurdDim.filterAll();
	cf.stuntingBurdDim.filterAll();
	cf.countryDim.filterAll();    
	
	//console.log("getCountryData = ", temp);  
	return temp;
		
};


function getRegionalData(iso_code) {	  //returns data for any specified region, for current stat, ordered by chronological year						
	cf2.yearDim.filterAll();
	cf2.regionDim.filter(iso_code);
	
	switch (currentStatType) {		
		case 'prev':
			switch (currentStatCat) {     
				case 'wast':	temp = cf2.wastingDim.filter(function(d) {return d >= 0}).top(Infinity); 
								break;
				case 'sevwast':	temp = cf2.sevWastingDim.filter(function(d) {return d >= 0}).top(Infinity); 
								break;
				case 'stunt':	temp = cf2.stuntingDim.filter(function(d) {return d >= 0}).top(Infinity);
								break;
				default:	temp = cf2.wastingDim.filter(function(d) {return d >= 0}).top(Infinity);	
							console.log("Error in getting regional stats");
			};
			break;
		case 'burd':
			switch (currentStatCat) {      
				case 'wast':	temp = cf2.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
								break;
				case 'sevwast':	temp = cf2.sevWastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity); 
								break;
				case 'stunt':	temp = cf2.stuntingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);
								break;
				default:	temp = cf2.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
							console.log("Error in getting regional stats");
			};
			break;
		default: 	temp = cf2.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
					console.log("Error in getting regional stats")
	};  
	
	temp = cf2.yearDim.bottom(Infinity);   //order by chronological year
	
	cf2.wastingDim.filterAll(); 			//remove any filters on stats or country so subsequent operations have a clean start
	cf2.sevWastingDim.filterAll(); 
	cf2.stuntingDim.filterAll();
	cf2.wastingBurdDim.filterAll();
	cf2.sevWastingBurdDim.filterAll(); 
	cf2.stuntingBurdDim.filterAll();
	cf2.regionDim.filterAll();    
	
	//console.log("getRegionalData = ", temp);  
	return temp;
		
};



function transitionCurrentCountryLines(id, temp_iso){ 
	var margin = {top: 10, left: 40, right: 20, bottom: 20}; 
	var width = $(id).width() - margin.left - margin.right;  
	var height = $(id).height() - margin.top - margin.bottom; 

	//console.log("********************TRANSITIONING currentCountryLines LINES HERE");
	
	//Update scales
	var yrScale = d3.scale.linear()
            .range([0, width])    
            .domain([minYr,maxYr]);  
			
	var lineDom = getLinegraphDomain();
	var yScale = d3.scale.linear()   
			.domain([lineDom[0],lineDom[1]]) 			
            .range([height, 0]);			
	
				
	//Update axes
	var xAxis = d3.svg.axis()
				.scale(yrScale)
				.orient("bottom")	//orient tick marks only 
				.tickFormat(function(d, i) {
					return d3.format("")(d)
				});  
					
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")		//orient tick marks only
				.tickFormat(function(d, i) {
					switch(currentStatType) {
						case 'prev':	return d3.format(",.0f")(d); break;
						case 'burd':	return d3.format("s")(d); break;
						default:		return d3.format(",.0f")(d);
					};
				 })
				.ticks(5);	
	
	lineGraph.selectAll(".x.axis")
		.transition()
		.duration(1000)
		.call(xAxis);  
		
	lineGraph.selectAll(".y.axis")
		.transition()
		.duration(1000)
		.call(yAxis);  				
	
		
	var transLineFunction = d3.svg.line()			
		.x(function(d) {
			return margin.left + yrScale(d.Survey_yr)
		})
		.y(function(d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; break;
						case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting;} else {stat = d.Sev_wasting;}; break;			
						case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting;} else {stat = d.Stunting;}; break;
						default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; 
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; break;
						case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting_burd*1000000;;} else {stat = ((d.Sev_wasting/100) * d.Pop_und5);}; break;
						case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting_burd*1000000;} else {stat = ((d.Stunting/100) * d.Pop_und5);}; break;
						default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; 
					};
					break;
				default: if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {d.Wasting;};
			};
			val = margin.top + yScale(stat);
			return val;            			
		}) 
		.interpolate('linear');
		
		
	for (i=0; i <= currentCountryLines.length-1; i++) {
		iso = currentCountryLines[i].iso;
		col = currentCountryLines[i].color;
		//console.log("******************************************************** country/reg = ", iso, currentStatCat, currentStatType, col);
		
		if (iso.substring(0,2)=="XX") {
			if (statCat != 'sevwast') {
				countryData = getRegionalData(iso);
			};
			//console.log("******************************************************** regionalData = ", countryData);
		} else {
			countryData = getCountryData(iso);
			//console.log("******************************************************** countryData = ", countryData);
		};
		
	
		var path = lineGraph.selectAll('path.country_line'+iso); 
		//Note: don't need path.enter() or path.exit() because only transitioning line that is already there
		path.transition()
			.duration(500)  
			.attr('class', function (d) {
				return 'country_line country_line' + iso;
			})
			.ease("linear")
			.attr('d', transLineFunction(countryData))
			.attr("stroke", col)
			.attr("stroke-width", 1);
			/* .style("stroke-dasharray", function (d,i) {				//For making part of path dashed line
				console.log("d in stroke-dasharray: ", d);
				if (d[i].Survey_yr > 2010) { 		
					console.log("d[i].Survey_yr in stroke-dasharray: ", d[i].Survey_yr);				
					return ("3, 3");
				 } else {
					console.log("d[i].Survey_yr in stroke-dasharray: ", d[i].Survey_yr);
					return ("0,0");   //no dash
				} 
			}); */
	
		
		pointData = getPointData();  //appends all countryData from countryList into pointData	
		countryPointData = pointData.filter(function(d){return d.ISO_3==iso;});	//return only points for that country
		var points = lineGraph.selectAll('circle.data_point'+iso).data(countryPointData);
		
		points.exit()
			.transition()
			.duration(500)
			.style('fill-opacity', 1e-6)  
			.remove();
		
		points.enter()
			.append('circle') 
			.attr('class', function (d) {
				return 'country_line country_line' + d.ISO_3 + ' data_point data_point' + d.ISO_3 + ' data_point' + d.ISO_3 + d.Survey_yr;		
			})
			.attr("cy", function(d){
				switch(currentStatType) {
					case 'prev':
						switch(currentStatCat) {
							case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; break;
							case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = Sev_wasting;} else {stat = d.Sev_wasting;}; break;
							case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting;} else {stat = d.Stunting;}; break;
							default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; 
						};
						break;
					case 'burd':
						switch(currentStatCat) {
							case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; break;
							case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting_burd*1000000;} else {stat = ((d.Sev_wasting/100) * d.Pop_und5);}; break;
							case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting_burd*1000000;} else {stat = ((d.Stunting/100) * d.Pop_und5);}; break;
							default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; 
						};
						break;
					default: if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {d.Wasting;};
				};
				val = margin.top + yScale(stat);
				return val;            			
			})
			.attr("cx", function(d){
				return margin.left + yrScale(d.Survey_yr);
			})
			.attr("r", 3)
			.attr("fill", col)
			.style('opacity', function (d) {
				val = 0;
				switch(currentStatCat) {
					case 'wast': 	if (d.Wast_yrs_since_surv == 0) {val=1;}; break;
					case 'sevwast': if (d.Sev_wast_yrs_since_surv == 0) {val=1;}; break;
					case 'stunt':	if (d.Stunt_yrs_since_surv == 0) {val=1;}; break;
					default:		val = 0; 
				};		
				return val;
			})
			.on("mouseover", function (d) {
				mouseoverPointFunction(d);						
			})
			.on("mouseout", function (d) {
				mouseoutPointFunction(d);							
			})
			.on("dblclick", function (d) {
				//tip.hide(d);										
				mouseoutPointFunction(d);							
				removeCountryLine('#linegraph', d.ISO_3, 'perm');
			});
		
		
		points.transition()
			.duration(500)
			.attr('class', function (d) {
				return 'country_line country_line' + d.ISO_3 + ' data_point data_point' + d.ISO_3 + ' data_point' + d.ISO_3 + d.Survey_yr;	
			})	
			.attr("cy", function(d){    
				switch(currentStatType) {
					case 'prev':
						switch(currentStatCat) {
							case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; break;
							case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting;} else {stat = d.Sev_wasting;}; break;			
							case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting;} else {stat = d.Stunting;}; break;
							default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {stat = d.Wasting;}; 
						};
						break;
					case 'burd':
						switch(currentStatCat) {
							case 'wast': 	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; break;
							case 'sevwast': if (d.ISO_3.substr(0,2)=="XX") {stat = d.Sev_wasting_burd*1000000;} else {stat = ((d.Sev_wasting/100) * d.Pop_und5);}; break;
							case 'stunt':	if (d.ISO_3.substr(0,2)=="XX") {stat = d.Stunting_burd*1000000;} else {stat = ((d.Stunting/100) * d.Pop_und5);}; break;
							default:		if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting_burd*1000000;} else {stat = ((d.Wasting/100) * d.Pop_und5);}; 
						};
						break;
					default: if (d.ISO_3.substr(0,2)=="XX") {stat = d.Wasting;} else {d.Wasting;};
				};
				val = margin.top + yScale(stat);
				return val;        
			})
			.attr("cx", function(d){
				return margin.left + yrScale(d.Survey_yr);
			})
			.attr("r", 3)
			.attr("fill", col)
			.style('opacity', function (d) {
				val = 0;
				switch(currentStatCat) {
					case 'wast': 	if (d.Wast_yrs_since_surv == 0) {val=1;}; break;
					case 'sevwast': if (d.Sev_wast_yrs_since_surv == 0) {val=1;}; break;
					case 'stunt':	if (d.Stunt_yrs_since_surv == 0) {val=1;}; break;
					default:		val = 0; 
				};		
				return val; 
			});
		
	};
	
	//transition the temp (yellow hovered) path
	if (temp_iso.substr(0,2)=="XX") {
		if (statCat != 'sevwast') {
			countryData = getRegionalData(temp_iso);
		};
	} else {
		countryData = getCountryData(temp_iso);
	};
	var path = lineGraph.selectAll('path.country_line'+temp_iso+'_temp');  
		path.transition()
			.duration(500)  
			.attr('class', function (d) {
				return 'country_line country_line' + temp_iso+'_temp';
			})
			.ease("linear")
			.attr('d', transLineFunction(countryData))
			.attr("stroke", 'yellow')
			.attr("stroke-width", 3); 
			
};

	
/***********************/
/*****  BAR CHART  *****/  
/***********************/
	
function generateBarChart(id, idX){ 
	var margin = {top: 0, left: 140, right: 20, bottom: 0};
	var width = $(id).width() - margin.left - margin.right;   
	var height = $(id).height() - margin.top - margin.bottom;  
	var xAxisHeight = $(idX).height();
	var xAxisWidth = $(idX).width();
	var upper_bar_margin = (width)*(2/3)+10;
	
 	//Create axis scales:  //note: max Wasting = 26, Sev Wasting = 15.9, Stunting = 73.6
	var wastPrevScale = d3.scale.linear()   //wastScale = x-axis
			.domain([0,26]) 			 	//need to set to maxWast=26?
            .range([0, width]);   	 		//pixel range to map to 
			
	var sevWastPrevScale = d3.scale.linear()    //sevWastScale = x-axis
			.domain([0,16]) 			 //need to set to maxSevWast=15.9?
            .range([0, width]);
			
	var stuntPrevScale = d3.scale.linear()    //stuntScale = x-axis
			.domain([0,74]) 			 //need to set to maxStunt=73.6?
            .range([0, width]);	 
			
	var wastBurdScale = d3.scale.linear()   
			.domain([1,1000000]) 			 	//change to 0
            .range([0, upper_bar_margin-10])
			.clamp(true); 
			
	var wastBurdScale_upper = d3.scale.linear()   
			.domain([1000000,26000000]) 			 
            .range([upper_bar_margin, width])
			.clamp(true);
			
	var sevWastBurdScale = d3.scale.linear()   
			.domain([1,1000000]) 			 
            .range([0, upper_bar_margin-10])
			.clamp(true); 
	var sevWastBurdScale_upper = d3.scale.linear()   
			.domain([1000000,9000000]) 			 
            .range([upper_bar_margin, width])
			.clamp(true);  	
			
	var stuntBurdScale = d3.scale.linear()   
			.domain([1,2000000]) 			 
            .range([0, upper_bar_margin-10])
			.clamp(true); 
	var stuntBurdScale_upper = d3.scale.linear()   
			.domain([2000000,76000000]) 			 
            .range([upper_bar_margin, width])
			.clamp(true);  			
			
	var noScale_upper = d3.scale.linear()   
			.domain([0,0]) 			 
            .range([width,width])
			.clamp(true);		
			


	var currentDomain = function (d) {
		var domain = [];
		var currentData = getCurrentData();
		for (i=0; i <= currentData.length-1; i++) {
			domain.push(currentData[i].Country);
		};
		//console.log("currentDomain  = ", domain);
		return domain;
	};
	
	function getXScale() {
		switch(currentStatType) {
			case 'prev':
				switch(currentStatCat) {
					case 'wast': 	scale = wastPrevScale; break;
					case 'sevwast': scale = sevWastPrevScale; break;
					case 'stunt':	scale = stuntPrevScale; break;
					default:		scale = wastPrevScale; 
				};
				break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	scale = wastBurdScale; break;
					case 'sevwast': scale = sevWastBurdScale; break;
					case 'stunt':	scale = stuntBurdScale; break;
					default:		scale = wastBurdScale; 
				};
				break;
			default: scale = wastPrevScale;
		};
		return scale;
	};	
	var xScale = getXScale();	
	
	
	function getX2Scale() {
		switch(currentStatType) {
			case 'prev': scale = noScale_upper; break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	scale = wastBurdScale_upper; break;
					case 'sevwast': scale = sevWastBurdScale_upper; break;
					case 'stunt':	scale = stuntBurdScale_upper; break;
					default:		scale = wastBurdScale_upper; 
				};
				break;
			default: scale = noScale_upper;
		};
		return scale;
	};	
	var x2Scale = getX2Scale();	
	
	
	var allBarsHeight = Math.max((currentDomain().length * (barHeight + 2)), height); //max, min = height
	var yScale = d3.scale.ordinal()
		.domain(currentDomain())
		//.rangeRoundBands([0,height], 0.05, 0.5);   //here height should depend on the length of currentDomain(), but with a set minimum and no maximum?
		.rangeRoundBands([0, allBarsHeight], 0, 0);
		
	var yScaleLess20 = d3.scale.ordinal()
		.domain(currentDomain())
		//.rangeRoundBands([0,height], 0.05, 0.5);    //i.e. d3.scale.ordinal().rangeRoundBands([0, w], inner_padding, outer_padding)
		.rangeRoundBands([0, allBarsHeight], 0.05, 0.5); // 0.05, 0.5);
	
	var xAxis = d3.svg.axis()
					.scale(xScale)				
					.orient("bottom");
					
	var xAxis_upper = d3.svg.axis()
						.scale(x2Scale)
						.orient("bottom");
					
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");
					
	var yAxisLess20 = d3.svg.axis()
					.scale(yScaleLess20)
					.orient("left");				
					
	
	//Render main SVG
	var barChart = d3.select(id)           //create a d3.svg called 'barChart' - could classed as e.g. 'chart' (prob just for css?)  //barChart is the whole chart area incl axes
		//.classed('chart',true)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom); 		//changing this height will change height of all bars but not of chart area itself
		/* .attr("transform", "translate(" + 0 + ',' + margin.top + ')');  */
		//.call(d3.behavior.zoom().scaleExtent([1, 5]).on("zoom", zoom));   //DON'T THINK WE NEED THIS HERE, ONLY IN UPDATE BELOW
	
	var barChartXAxis = d3.select(idX)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", xAxisHeight);
		
		


	
	//Render axes
	barChartXAxis.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + margin.left + "," + 0 + ")")
		.call(xAxis);
		
	barChartXAxis.append("g")
		.attr("class", "x2 axis")
		.attr("transform", "translate(" + margin.left + "," + 0 + ")")
		.call(xAxis_upper);
		
	barChart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin.left + ",0)")
		.call(yAxis); 
	
	return [barChart, barChartXAxis];
		
}


function updateBarChart(id, idX, data) {
	var margin = {top: 0, left: 140, right: 20, bottom: 0};
	var width = $(id).width() - margin.left - margin.right;   
	var height = $(id).height() - margin.top - margin.bottom;  
	var xAxisHeight = $(idX).height();
	var xAxisWidth = $(idX).width();
	var upper_bar_margin = (width)*(2/3)+10;
	
	//console.log("DATA LENGTH = ", data.length, data);
	
	//Create axis scales:  //note max Wasting = 26, Sev Wasting = 15.9, Stunting = 73.6
	var wastPrevScale = d3.scale.linear()    //wastScale = x-axis
			.domain([0,26]) 			 //need to set to maxWast=26?
            .range([0, width]);   	 //pixel range to map to 
			
	var sevWastPrevScale = d3.scale.linear()    //sevWastScale = x-axis
			.domain([0,16]) 			 //need to set to maxSevWast=15.9?
            .range([0, width]);
			
	var stuntPrevScale = d3.scale.linear()    //stuntScale = x-axis
			.domain([0,74]) 			 //need to set to maxStunt=73.6?
            .range([0, width]);	 
			
	var wastBurdScale = d3.scale.linear()   
			.domain([1,1000000]) 			 
            .range([0, upper_bar_margin-10])
			.clamp(true); 
	var wastBurdScale_upper = d3.scale.linear()   
			.domain([1000000,26000000]) 			 
            .range([upper_bar_margin, width])
			.clamp(true);  	 
			
	var sevWastBurdScale = d3.scale.linear()   
			.domain([1,1000000]) 			 
            .range([0, upper_bar_margin-10])
			.clamp(true); 
	var sevWastBurdScale_upper = d3.scale.linear()   
			.domain([1000000,9000000]) 			 
            .range([upper_bar_margin, width])
			.clamp(true);  	
			
	var stuntBurdScale = d3.scale.linear()   
			.domain([1,2000000]) 			 
            .range([0, upper_bar_margin-10])
			.clamp(true); 
	var stuntBurdScale_upper = d3.scale.linear()   
			.domain([2000000,76000000]) 			 
            .range([upper_bar_margin, width])
			.clamp(true); 
			
	var noScale_upper = d3.scale.linear()   
			.domain([0,0]) 			 
            .range([width,width])
			.clamp(true);		

	var currentDomain = function (d) {
		var domain = [];
		var currentData = getCurrentData();
		//console.log("in currentDomain: ", domain, "    currentData = ", currentData);
		for (i=0; i <= currentData.length-1; i++) {
			domain.push(currentData[i].Country);
		};
		//console.log("currentDomain  = ", domain);
		return domain;
	};

	function getXScale() {
		switch(currentStatType) {
			case 'prev':
				switch(currentStatCat) {
					case 'wast': 	scale = wastPrevScale; break;
					case 'sevwast': scale = sevWastPrevScale; break;
					case 'stunt':	scale = stuntPrevScale; break;
					default:		scale = wastPrevScale; 
				};
				break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	scale = wastBurdScale; break;
					case 'sevwast': scale = sevWastBurdScale; break;
					case 'stunt':	scale = stuntBurdScale; break;
					default:		scale = wastBurdScale; 
				};
				break;
			default: scale = wastPrevScale;
		};
		return scale;
	};
	var xScale = getXScale();
	
	function getX2Scale() {
		switch(currentStatType) {
			case 'prev': scale = noScale_upper; break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	scale = wastBurdScale_upper; break;
					case 'sevwast': scale = sevWastBurdScale_upper; break;
					case 'stunt':	scale = stuntBurdScale_upper; break;
					default:		scale = wastBurdScale_upper; 
				};
				break;
			default: scale = noScale_upper;
		};
		return scale;
	};	
	var x2Scale = getX2Scale();	
	
	
	var allBarsHeight = Math.max((currentDomain().length * (barHeight + 2)), height);
	//console.log("currentDomain: ", currentDomain());     /// *** KEEP THIS CONSOLE OUTPUT
	//console.log("Number of bars: ", currentDomain().length, "   Bar height: ", barHeight, "   Total bar height: ", allBarsHeight);
	var yScale = d3.scale.ordinal()
		.domain(currentDomain())
		//.rangeRoundBands([0,height], 0.05, 0.5);    //i.e. d3.scale.ordinal().rangeRoundBands([0, w], inner_padding, outer_padding)
		.rangeRoundBands([0, allBarsHeight], 0, 0); // 0.05, 0.5);
		
	var yScaleLess20 = d3.scale.ordinal()
		.domain(currentDomain())
		//.rangeRoundBands([0,height], 0.05, 0.5);    //i.e. d3.scale.ordinal().rangeRoundBands([0, w], inner_padding, outer_padding)
		.rangeRoundBands([0, allBarsHeight], 0.05, 0.5); // 0.05, 0.5);

			
	function getTicks() {
		var t=0;
		if (currentStatType =='burd') {
			t=2;
		} else {
			t=8;
		};
		return t;
	};	
	var numTicks = getTicks();
	
	function getUpperTicks() {
		var t=0;
		if (currentStatType =='burd') {
			t=2;
		} else {
			t=0;
		};
		return t;
	};	
	var numTicksUpper = getUpperTicks();
	
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")
				    .tickFormat(function(d, i) {
						//return d3.format(",.0f")(d)
						return d3.format("s")(d)
					 })
				    .ticks(numTicks);
					
	var xAxis_upper = d3.svg.axis()
					.scale(x2Scale)
					.orient("bottom")
					.tickFormat(function(d, i) {
						//return d3.format(",.0f")(d)
						return d3.format("s")(d)
					 })
					.ticks(numTicksUpper);
					
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");
					
	var yAxisLess20 = d3.svg.axis()
					.scale(yScaleLess20)
					.orient("left");


	function getYAxis() {
		if (currentDomain().length >=20) {
			//console.log("currentDomain length >= 20: ", currentDomain().length);
			return yAxis;
		} else {
			//console.log("currentDomain length < 20: ", currentDomain().length);
			return yAxisLess20;
		}	
	};
	var currentYAxis = getYAxis();   
	
	
	function getXTitle() {
		switch(currentStatType) {
			case 'prev':
				switch(currentStatCat) {
					case 'wast': 	title = "Wasting Prevalence (%)"; break;
					case 'sevwast': title = "Severe Wasting Prevalence (%)"; break;
					case 'stunt':	title = "Stunting Prevalence (%)"; break;
					default:		title = "Wasting Prevalence (%)"; console.log("Error getting x-axis title"); 
				};
				break;
			case 'burd':
				switch(currentStatCat) {
					case 'wast': 	title = "Wasting Burden (total numbers)"; break;
					case 'sevwast': title = "Severe Wasting Burden (total numbers)"; break;
					case 'stunt':	title = "Stunting Burden (total numbers)"; break;
					default:		title = "Wasting Burden (total numbers)"; console.log("Error getting x-axis title"); 
				};
				break;
			default: title = "Wasting Prevalence (%)"; console.log("Error getting x-axis title"); 
		};
		return title;	
	};
	var xTitle = getXTitle();
	
	
  	//Create tooltip variable for bars:	
 	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([0, width/4])
		.html(function(d) {
			tip_text = '';
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	statVal = (d3.format(".3n"))(d.Wasting); break;
						case 'sevwast': statVal = (d3.format(".3n"))(d.Sev_wasting); break;
						case 'stunt':	statVal = (d3.format(".3n"))(d.Stunting); break;
						default:		statVal = -99; console.log("Error creating tooltip");       
					};
					tip_text = "<span style='color:black'>" + d.Country + ", " + d.Survey_yr + ": " + statVal + "%</span>";
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	statVal = (d3.format(",.0f"))((d.Wasting/100) * d.Pop_und5); break;
						case 'sevwast': statVal = (d3.format(",.0f"))((d.Sev_wasting/100) * d.Pop_und5); break;
						case 'stunt':	statVal = (d3.format(",.0f"))((d.Stunting/100) * d.Pop_und5); break;
						default:		statVal = -99; console.log("Error creating tooltip");       
					};
					tip_text = "<span style='color:black'>" + d.Country + ", " + d.Survey_yr + ": " + statVal + "</span>";
					break;
				default: tip_text = "<span style='color:black'>" + d.Country + ", " + d.Survey_yr + ": <i>Error</i></span>"; console.log("Error creating tooltip");
			};
			return tip_text;
		}); 
		
	
	var mouseoverBarFunction = function(d) {   //ALSO WANT TO HIGHLIGHT COUNTRY IN LINECHART HERE TOO?
		//console.log("In mouseover function, d = ", d);
		var highlightColor = '#ffff00';
		
		//set highlight color for relevant bars for both lower and upper x-axes
		var lowBars = d3.selectAll('rect.lower_bar'+ d.ISO_3); 
		var uppBars = d3.selectAll('rect.upper_bar'+ d.ISO_3);
		lowBars.attr('fill', highlightColor);
		uppBars.attr('fill', highlightColor);
		
		//show tooltip
		tip.show(d); 		
			
		//highlight country in map
		d3.selectAll('.dashgeom'+d.ISO_3)
			.attr('fill', highlightColor);
		
		//update info box in map
		infodata = getInfoData(d.ISO_3);
		if (infodata[0]=='') {
			infodata[0] = d.Country,
			infodata[1] = currentYr
		};  
		updateInfo(infodata[0], infodata[1], infodata[2], infodata[3]);
		
		//highlight country in linegraph
		addCountryLine('#linegraph', d.ISO_3, 'temp');
	};

	var mouseoutBarFunction = function(d) {
		//console.log("In mouseout function, d = ", d.ISO_3);
		var origColor = colorDataOneCountry(d.ISO_3);
		
		//revert color for relevant bars for both lower and upper x-axes
		var lowBars = d3.selectAll('rect.lower_bar'+ d.ISO_3) 
					.transition()
					.duration(300);
		var uppBars = d3.selectAll('rect.upper_bar'+ d.ISO_3)
					.transition()
					.duration(300);
		lowBars.attr('fill', origColor);
		uppBars.attr('fill', origColor);
		
		//hide tooltip
		tip.hide(d); 

		//revert country highlight back to original
		d3.selectAll('.dashgeom'+d.ISO_3)
			.attr('stroke-width', '1')
			.attr('stroke-opacity', '0.5')
			.attr('stroke', 'black')
			.attr('fill', origColor);
		
		//clear info box in map
		updateInfo('','','','');
		
		//revert linegraph highlight back to original
		removeCountryLine('#linegraph', d.ISO_3, 'temp');
	};
	
	var clickBarFunction = function(d) {
		addCountryLine('#linegraph', d.ISO_3, 'perm');
	};
	
	var dblclickBarFunction = function(d) {
		removeCountryLine('#linegraph', d.ISO_3, 'perm');
	};

	
  	//Update lower bars
	currentData = getCurrentData();
	adjustScroll();
	
	var lower_bars = barChart.selectAll('rect.lower_bar').data(currentData);
	
 	lower_bars.exit()
	    .transition()
        .duration(600)
		.attr('x', xScale(0) + margin.left)
        //.attr('height', height - yScale(0))
		.attr('width', width - xScale(0))
        .style('fill-opacity', 1e-6)  
        .remove();  

 	lower_bars.enter() 
		.append('rect')   
		.attr('class', function (d) {
			return 'lower_bar lower_bar' + d.ISO_3;		
		})
	    .attr('transform', function(d) {
			if (currentDomain().length<=20) {
				return "translate(0,0)scale(1,1)";
			} else {
				return  "translate(0," + barsTranslate + ")scale(1,1)";   
			};
		}) 
		.attr("x", margin.left)
		.attr('width', function (d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	w = xScale(d.Wasting); break;
						case 'sevwast': w = xScale(d.Sev_wasting); break;
						case 'stunt':	w = xScale(d.Stunting); break;
						default:		w = xScale(d.Wasting); console.log("Error rendering new bars");
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	w = xScale((d.Wasting/100)*d.Pop_und5); break;
						case 'sevwast': w = xScale((d.Sev_wasting/100)*d.Pop_und5); break;
						case 'stunt':	w = xScale((d.Stunting/100)*d.Pop_und5); break;
						default:		w = xScale((d.Wasting/100)*d.Pop_und5); console.log("Error rendering new bars");
					};
					break;
				default: w = xScale(d.Wasting); console.log("Error rendering new bars");
			};
			return w;
			})
		.attr('y', function (d) {     
			if (currentDomain().length>=20) {
				return yScale(d.Country);}
			else {
				return yScaleLess20(d.Country);}
		})  				
		.attr('height', function(d) {
			if (currentDomain().length>=20) {return barHeight;}
			else {return yScaleLess20.rangeBand();}
		})
		.attr('fill', function (d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	col = getColor(d.Wasting); break;
						case 'sevwast': col = getColor(d.Sev_wasting); break;
						case 'stunt':	col = getColor(d.Stunting); break;
						default:		col = getColor(d.Wasting); console.log("Error coloring bars");
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	col = getColor((d.Wasting/100)*d.Pop_und5); break;
						case 'sevwast': col = getColor((d.Sev_wasting/100)*d.Pop_und5); break;
						case 'stunt':	col = getColor((d.Stunting/100)*d.Pop_und5); break;
						default:		col = getColor((d.Wasting/100)*d.Pop_und5); console.log("Error coloring bars");
					};
					break;
				default: col = getColor(d.Wasting); console.log("Error coloring bars");
			};
			return col;
		})
		.on("mouseover", function (d) {
			mouseoverBarFunction(d);
		})
		.on("mouseout", function (d) {
			mouseoutBarFunction(d);
		})
		.on("click", function (d) {
			clickBarFunction(d);
		})
		.on("dblclick", function (d) {
			dblclickBarFunction(d);
		});
		
		
	lower_bars.append("text")
	   .text(function(d,i) {
			return i;
	   })
	   .attr("x", margin.left+100)
	   .attr('y', function (d) {   
			if (currentDomain().length>=20) {
				return yScale(d.Country);}
			else {
				return yScaleLess20(d.Country);}
		})
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "black");
 
	lower_bars.transition()  //this only transitions bars that already exist, not new ones entering
	    .duration(1000)  
		.attr('class', function (d) {
			return 'lower_bar lower_bar' + d.ISO_3;		
		})
 		.attr('transform', function(d) {
			if (currentDomain().length<=20) {
				return "translate(0,0)scale(1,1)";
			} else {
				return  "translate(0," + barsTranslate + ")scale(1,1)"; 				
			};
		}) 
		.attr("x", margin.left)
		.attr('width', function (d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	w = xScale(d.Wasting); break;
						case 'sevwast': w = xScale(d.Sev_wasting); break;
						case 'stunt':	w = xScale(d.Stunting); break;
						default:		w = xScale(d.Wasting); 
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	w = xScale((d.Wasting/100)*d.Pop_und5); break;
						case 'sevwast': w = xScale((d.Sev_wasting/100)*d.Pop_und5); break;
						case 'stunt':	w = xScale((d.Stunting/100)*d.Pop_und5); break;
						default:		w = xScale((d.Wasting/100)*d.Pop_und5); 
					};
					break;
				default: w = xScale(d.Wasting); 
			};
			return w;
			})
		.attr('y', function (d) {     
			if (currentDomain().length>=20) {
				return yScale(d.Country);}
			else {
				return yScaleLess20(d.Country);}
		})  
		.attr('height', function(d) {
			if (currentDomain().length>=20) {return barHeight;}
			else {return yScaleLess20.rangeBand();}
		})
		.attr('fill', function (d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	col = getColor(d.Wasting); break;
						case 'sevwast': col = getColor(d.Sev_wasting); break;
						case 'stunt':	col = getColor(d.Stunting); break;
						default:		col = getColor(d.Wasting); 
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	col = getColor((d.Wasting/100)*d.Pop_und5); break;
						case 'sevwast': col = getColor((d.Sev_wasting/100)*d.Pop_und5); break;
						case 'stunt':	col = getColor((d.Stunting/100)*d.Pop_und5); break;
						default:		col = getColor((d.Wasting/100)*d.Pop_und5); 
					};
					break;
				default: col = getColor(d.Wasting);
			};
			return col;
		});
				
		
	//Update upper bars	
	var upper_bars = barChart.selectAll('rect.upper_bar').data(currentData);	
				
 	upper_bars.exit()
	    .transition()
        .duration(600)
        //.attr('y', yScale(0))
		.attr('x', margin.left)   
        //.attr('height', height - yScale(0))
		.attr('width', width)	
        .style('fill-opacity', 1e-6)  
        .remove();  

 	upper_bars.enter() 
		.append('rect')   
		.attr('class', function (d) {
			return 'upper_bar upper_bar' + d.ISO_3;		
		})
		.attr('transform', function(d) {
			if (currentDomain().length<=20) {
				return "translate(0,0)scale(1,1)";
			} else {
				return  "translate(0," + barsTranslate + ")scale(1,1)";  
			};
		}) 
		.attr("x", margin.left + upper_bar_margin)
		.attr('width', function (d) {     //{ return d >= 15 ? 160 - upper(d) : 0; }
			switch(currentStatType) {
				case 'prev': 	 w = 0;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	(((d.Wasting/100)*d.Pop_und5) >= 1000000) ? (w = (x2Scale((d.Wasting/100)*d.Pop_und5))-upper_bar_margin) : (w = 0); break;
						case 'sevwast': (((d.Sev_wasting/100)*d.Pop_und5) >= 1000000) ? (w = (x2Scale((d.Sev_wasting/100)*d.Pop_und5))-upper_bar_margin) : (w = 0); break;
						case 'stunt':	(((d.Stunting/100)*d.Pop_und5) >= 2000000) ? (w = (x2Scale((d.Stunting/100)*d.Pop_und5))-upper_bar_margin) : (w = 0); break;
						default:		w = 0; console.log("Error entering new upper bars");
					};
					break;
				default: w = 0; console.log("Error entering new upper bars");
			};
			return w;
			})
		.attr('y', function (d) {   
			if (currentDomain().length>=20) {
				return yScale(d.Country);}
			else {
				return yScaleLess20(d.Country);}
		})  				
		.attr('height', function(d) {
			if (currentDomain().length>=20) {return barHeight;}
			else {return yScaleLess20.rangeBand();}
		})
		.attr('fill', function (d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	col = getColor(d.Wasting); break;
						case 'sevwast': col = getColor(d.Sev_wasting); break;
						case 'stunt':	col = getColor(d.Stunting); break;
						default:		col = getColor(d.Wasting); console.log("Error coloring bars");
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	col = getColor((d.Wasting/100)*d.Pop_und5); break;
						case 'sevwast': col = getColor((d.Sev_wasting/100)*d.Pop_und5); break;
						case 'stunt':	col = getColor((d.Stunting/100)*d.Pop_und5); break;
						default:		col = getColor((d.Wasting/100)*d.Pop_und5); console.log("Error coloring bars");
					};
					break;
				default: col = getColor(d.Wasting); console.log("Error coloring bars");
			};
			return col;
		})		
		.on("mouseover", function (d) {
			mouseoverBarFunction(d);
		})
		.on("mouseout", function (d) {
			mouseoutBarFunction(d);
		})
		.on("click", function (d) {
			clickBarFunction(d);
		})
		.on("dblclick", function (d) {
			dblclickBarFunction(d);
		});   
		
	upper_bars.transition()  //this only transitions bars that already exist, not new ones entering
		.attr('class', function (d) {
			return 'upper_bar upper_bar' + d.ISO_3;			 
		})
	    .duration(1000)
		.attr('transform', function(d) {
			if (currentDomain().length<=20) {
				return "translate(0,0)scale(1,1)";
			} else {
				return  "translate(0," + barsTranslate + ")scale(1,1)";  
			};
		}) 
	    .attr("x", margin.left + upper_bar_margin)
		.attr('width', function (d) {
			switch(currentStatType) {
				case 'prev':	w = 0; break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	(((d.Wasting/100)*d.Pop_und5) >= 1000000) ? (w = (x2Scale((d.Wasting/100)*d.Pop_und5))-upper_bar_margin) : (w = 0); break;
						case 'sevwast': (((d.Sev_wasting/100)*d.Pop_und5) >= 1000000) ? (w = (x2Scale((d.Sev_wasting/100)*d.Pop_und5))-upper_bar_margin) : (w = 0); break;
						case 'stunt':	(((d.Stunting/100)*d.Pop_und5) >= 2000000) ? (w = (x2Scale((d.Stunting/100)*d.Pop_und5))-upper_bar_margin) : (w = 0); break;
						default:		w = 0; console.log("Error transitioning upper bars");
					};
					break;
				default: w = 0; 
			};
			return w;
			})
		.attr('y', function (d) {    
			if (currentDomain().length>=20) {
				return yScale(d.Country);}
			else {
				return yScaleLess20(d.Country);}
		})   
		.attr('height', function(d) {
			if (currentDomain().length>=20) {return barHeight;}
			else {return yScaleLess20.rangeBand();}
		})
		.attr('fill', function (d) {
			switch(currentStatType) {
				case 'prev':
					switch(currentStatCat) {
						case 'wast': 	col = getColor(d.Wasting); break;
						case 'sevwast': col = getColor(d.Sev_wasting); break;
						case 'stunt':	col = getColor(d.Stunting); break;
						default:		col = getColor(d.Wasting); 
					};
					break;
				case 'burd':
					switch(currentStatCat) {
						case 'wast': 	col = getColor((d.Wasting/100)*d.Pop_und5); break;
						case 'sevwast': col = getColor((d.Sev_wasting/100)*d.Pop_und5); break;
						case 'stunt':	col = getColor((d.Stunting/100)*d.Pop_und5); break;
						default:		col = getColor((d.Wasting/100)*d.Pop_und5); 
					};
					break;
				default: col = getColor(d.Wasting);
			};
			return col;
		});		
		
		
/*	 	.on('zoom', function() {
 			var min = 1;
			var max = currentDomain().length;
			console.log("min: ", min, "       max: ", max);
			console.log("yScale.domain()[0]: ", yScale.domain()[0]);
			console.log("yScale.domain()[1]: ", yScale.domain()[1]);
			if (yScale.domain()[0] < min) {
				
				//var y = zoom.translate()[1] - yScale(min) + yScale.range()[0];
				//zoom.translate([0, y]);
			} else if (yScale.domain()[1] > max) {
				//var y = zoom.translate()[1] - yScale(max) + yScale.range()[1];
				//zoom.translate([0, y]);
			} 
			zoom;
		})
	); 	*/
	
/* 		function scrollBars() {        // see http://blog.scottlogic.com/2014/09/19/interactive.html - about 60% of the way down page - for not allowing scroll to go beyond min & max
		var min = 0;							//first country in list (i.e. 0)
		var max = currentDomain().length-1;		//last country in list (i.e. total countries)
		var minPix = yScale.range()[min];		//top pix of first bar in list
		var maxPix = yScale.range()[max] + 14;		//bottom pix of last bar in list (i.e. top pix of last bar + 14 to take to bottom of bar)
		var zoomScale = 1;						//could set this to d3.event.scale
			
		//console.log("***** IN scrollBars()");	
		//console.log("min: ", min, "       max: ", max);
		//console.log("minPix: ", minPix, "         maxPix: ", maxPix);
		//console.log("barsTranslate = ", barsTranslate);
		
		/* if (d3.event===null) {			//if user has updated year but NOT scrolled
			zoomYTranslate = prevBarsTranslate;
			first_scroll = 1;
		} else { // if (first_scroll==1) {   //user scrolled for first time after updated year
			zoomYTranslate =  d3.event.translate[1];  //same as zoom.translate[0]()
			first_scroll = 0;
		} ; */
/* 		else if (first_scroll==0) {	//user scrolled for second or more consecutive times
	//		zoomYTranslate = d3.event.translate[1];
	//		first_scroll = 1;
	//	}; 
		
		zoomYTranslate = d3.event.translate[1];		

		//console.log("barsTranslate = ", barsTranslate, "     zoomYTranslate = ", zoomYTranslate);		
			
		if (currentDomain().length<=20) {				//if <=20 countries in list, don't translate bars
			barsTranslate = 0
			
			
		} else if ((currentDomain().length > 20) && (minPix + zoomYTranslate >= 0)){    //if >20 countries in list and user is at top or scrolls down beyond first one, don't translate bars
			//console.log("CAN'T MOVE DOWN ANYMORE!!!!!   ", zoomYTranslate, " - ", yScale(currentDomain()[min]), " + ", minPix);
			//barsTranslate = zoomYTranslate - yScale(currentDomain()[min]) + minPix; 
			
			barsTranslate = 0;
			console.log("1 - barsTranslate = ", barsTranslate); 
			scroll.translate([0, barsTranslate]);


		} else if ((currentDomain().length > 20) && (maxPix + zoomYTranslate < height)) {	 //if >20 countries in list and user scrolls up beyond last one, don't translate bars
			//console.log("CAN'T MOVE UP ANYMORE!!!!!   ", zoomYTranslate, " - ", yScale(currentDomain()[max]), " + ", maxPix);
			
			//barsTranslate = zoomYTranslate - yScale(currentDomain()[max]) + maxPix;
			
			//yScale.range[1]();
			barsTranslate = -maxPix + height;   // 14 = barHeight + padding?
			console.log("2 - barsTranslate = ", barsTranslate); 
			scroll.translate([0, barsTranslate]);
			
		} else {										//if >20 countries in list and user scrolls within limits, translate bars accordingly
			//console.log("SCROLL OK HERE   ", barsTranslate);
			barsTranslate = zoomYTranslate;		
			console.log("3 - barsTranslate = ", barsTranslate); 
		};	
		lower_bars.attr("transform", "translate(0," + barsTranslate + ")scale(" + zoomScale + ",1)");   //makes bars transform up & down (not left & right)
		upper_bars.attr("transform", "translate(0," + barsTranslate + ")scale(" + zoomScale + ",1)");		
		
					
		if (currentDomain().length<=20) {
			barChart.select(".y.axis")
				.attr("transform", "translate(" + margin.left + ",0)scale(1,1)")		//makes y-axis labels transform up & down (not left & right)
				.call(yAxisLess20.scale(yScaleLess20.rangeBand()));
			barChartXAxis.select(".x.axis").call(xAxis); 
		} else if (currentDomain().length > 20) {	
			barChart.select(".y.axis")
				.attr("transform", "translate(" + margin.left + "," + barsTranslate + ")scale(" + zoomScale + ",1)")   //makes y-axis labels transform up & down (not left & right)
				.call(yAxis.scale(yScale.rangeRoundBands([0, allBarsHeight * zoomScale], 0, 0)));
			barChartXAxis.select(".x.axis").call(xAxis); 
		}
		
		prevBarsTranslate = barsTranslate;	
		//console.log("prevBarsTranslate = ", prevBarsTranslate);
		//console.log("***** END scrollBars()");
		
	}	 */
	

	function scrollBars() {        // see http://blog.scottlogic.com/2014/09/19/interactive.html - about 60% of the way down page - for not allowing scroll to go beyond min & max
		var min = 0;							//first country in list (i.e. 0)
		var max = currentDomain().length-1;		//last country in list (i.e. total countries)
		var minPix = yScale.range()[min];		//top pix of first bar in list
		var maxPix = yScale.range()[max] + 14;		//bottom pix of last bar in list (i.e. top pix of last bar + 14 to take to bottom of bar)
		var zoomScale = 1;						//could set this to d3.event.scale
			
		console.log("***** IN scrollBars()");	
		//console.log("min: ", min, "       max: ", max);
		//console.log("minPix: ", minPix, "         maxPix: ", maxPix);
		//console.log("barsTranslate = ", barsTranslate);
		
		/* if (d3.event===null) {			//if user has updated year but NOT scrolled
			zoomYTranslate = prevBarsTranslate;
			first_scroll = 1;
		} else { // if (first_scroll==1) {   //user scrolled for first time after updated year
			zoomYTranslate =  d3.event.translate[1];  //same as zoom.translate[0]()
			first_scroll = 0;
		} ; */
/* 		else if (first_scroll==0) {	//user scrolled for second or more consecutive times
			zoomYTranslate = d3.event.translate[1];
			first_scroll = 1;
		}; */
		
		
		zoomYTranslate = d3.event.translate[1];
		/* if (prevBarsTranslate==0) {
			zoomYTranslate = d3.event.translate[1];	
		} else {				
			zoomYTranslate = prevBarsTranslate;
		}; */

		console.log("barsTranslate = ", barsTranslate, "     zoomYTranslate = ", zoomYTranslate, "     prevBarsTranslate = ", prevBarsTranslate);		
			
		if (currentDomain().length<=20) {				//if <=20 countries in list, don't translate bars
			barsTranslate = 0
			
			
		} else if ((currentDomain().length > 20) && (minPix + zoomYTranslate >= 0)){    //if >20 countries in list and user is at top or scrolls down beyond first one, don't translate bars
		//} else if ((currentDomain().length > 20) && (minPix + prevBarsTranslate >= 0)){    //if >20 countries in list and user is at top or scrolls down beyond first one, don't translate bars
			//console.log("CAN'T MOVE DOWN ANYMORE!!!!!   ", zoomYTranslate, " - ", yScale(currentDomain()[min]), " + ", minPix);
			//barsTranslate = zoomYTranslate - yScale(currentDomain()[min]) + minPix; 
			
			barsTranslate = 0;
			console.log("1 - barsTranslate = ", barsTranslate); 
			scroll.translate([0, barsTranslate]);


		} else if ((currentDomain().length > 20) && (maxPix + zoomYTranslate < height)) {	 //if >20 countries in list and user scrolls up beyond last one, don't translate bars
		//} else if ((currentDomain().length > 20) && (maxPix + prevBarsTranslate < height)) {	 //if >20 countries in list and user scrolls up beyond last one, don't translate bars
			//console.log("CAN'T MOVE UP ANYMORE!!!!!   ", zoomYTranslate, " - ", yScale(currentDomain()[max]), " + ", maxPix);
			
			//barsTranslate = zoomYTranslate - yScale(currentDomain()[max]) + maxPix;
			
			//yScale.range[1]();
			barsTranslate = -maxPix + height;   // 14 = barHeight + padding?
			console.log("2 - barsTranslate = ", barsTranslate); 
			scroll.translate([0, barsTranslate]);
			
		} else {										//if >20 countries in list and user scrolls within limits, translate bars accordingly
			//console.log("SCROLL OK HERE   ", barsTranslate
			
			/* if ((prevBarsTranslate <=0)&&(prevBarsTranslate>=height-maxPix)) {
				barsTranslate = prevBarsTranslate */
			barsTranslate = zoomYTranslate;		
			console.log("3 - barsTranslate = ", barsTranslate); 
		};	
		
		lower_bars.attr("transform", "translate(0," + barsTranslate + ")scale(" + zoomScale + ",1)");   //makes bars transform up & down (not left & right)
		upper_bars.attr("transform", "translate(0," + barsTranslate + ")scale(" + zoomScale + ",1)");		
		
					
		if (currentDomain().length<=20) {
			barChart.select(".y.axis")
				.attr("transform", "translate(" + margin.left + ",0)scale(1,1)")		//makes y-axis labels transform up & down (not left & right)
				.call(yAxisLess20.scale(yScaleLess20.rangeBand()));
			barChartXAxis.select(".x.axis").call(xAxis); 
		} else if (currentDomain().length > 20) {	
			barChart.select(".y.axis")
				.attr("transform", "translate(" + margin.left + "," + barsTranslate + ")scale(" + zoomScale + ",1)")   //makes y-axis labels transform up & down (not left & right)
				.call(yAxis.scale(yScale.rangeRoundBands([0, allBarsHeight * zoomScale], 0, 0)));
			barChartXAxis.select(".x.axis").call(xAxis); 
		}
		
		prevBarsTranslate = barsTranslate;	
		//console.log("prevBarsTranslate = ", prevBarsTranslate);
		//console.log("***** END scrollBars()");
		
	}	
	
	
	function adjustScroll() {
		var min = 0;							//first country in list (i.e. 0)
		var max = currentDomain().length-1;		//last country in list (i.e. total countries)
		var minPix = yScale.range()[min];		//top pix in list
		var maxPix = yScale.range()[max] + 14;		//bottom pix in list
		var zoomScale = 1;						//could set this to d3.event.scale
		
		//console.log("****** IN adjustScroll, for ", currentYr);
		//console.log("min: ", min, "       max: ", max);
		//console.log("minPix: ", minPix, "         maxPix: ", maxPix);
		//console.log("currentDomain().length: ", currentDomain().length); 
		//console.log("currentDomain(): ", currentDomain());
		
		zoomYTranslate = prevBarsTranslate;
		//console.log("zoomYTranslate = ", zoomYTranslate, "   prevBarsTranslate = ", prevBarsTranslate);
		
		if ((currentDomain().length > 20) && (minPix + zoomYTranslate >= 0)){    //if >20 countries in list and user is at top or scrolls down beyond first one, don't translate bars
			//console.log("CAN'T MOVE DOWN ANYMORE!!!!!   ", zoomYTranslate, " - ", yScale(currentDomain()[min]), " + ", minPix);
			//barsTranslate = zoomYTranslate - yScale(currentDomain()[min]) + minPix; 
			
			barsTranslate = 0;
			//console.log("1 - barsTranslate = ", barsTranslate); 
			//scroll.translate([0, barsTranslate]);
			
		//} else if ((currentDomain().length > 20) && (maxPix + zoomYTranslate < height)) {	 //THIS IS WRONG *** NEEDS TO SAY IF PREVZOOM IS > CURRENT MAX THEN SHIFT IT //if >20 countries in list and user scrolls up beyond last one, don't translate bars
		
		//} else if ((currentDomain().length > 20) && (zoomYTranslate + maxPix +14 < height)) {	//zoomYTranslate > maxPix
		} else if ((currentDomain().length > 20) && (zoomYTranslate + maxPix < height)) {	//zoomYTranslate > maxPix
			//console.log("zoomYTranslate + maxPix < height: ", zoomYTranslate, " + ", maxPix, " < ", height, "       ",zoomYTranslate + maxPix, " < ", height);
		
			//console.log("CAN'T MOVE UP ANYMORE!!!!!   ", zoomYTranslate, " - ", yScale(currentDomain()[max]), " + ", maxPix);
			//console.log("CAN'T MOVE UP ANYMORE!!!!!    ", zoomYTranslate, " < -", maxPix);
			//barsTranslate = zoomYTranslate - yScale(currentDomain()[max]) + maxPix;
			//barsTranslate = (-maxPix + height) + (((-maxPix+height)-prevBarsTranslate)*14);   // 14 = barHeight   //don't want to use prevBarsTranslate here
			barsTranslate = -maxPix + height;
			//barsTranslate = barsTranslate2 - prevBarsTranslate;
			console.log("**** 2 - barsTranslate = ", barsTranslate); 
			//scroll.translate([0, barsTranslate]);
			
		} else if (currentDomain().length > 20) {										//if >20 countries in list and user scrolls within limits, translate bars accordingly
			//console.log("zoomYTranslate + maxPix + 14 >= height: ", zoomYTranslate, " + ", maxPix, " + 14 >= ", height, "       ",zoomYTranslate + maxPix +14, " >= ", height);
			//console.log("SCROLL OK HERE   ", barsTranslate);
			barsTranslate = zoomYTranslate;		
			console.log("3 - barsTranslate = ", barsTranslate); 
		};	
		

		//lower_bars.attr("transform", "translate(0," + barsTranslate + ")scale(" + zoomScale + ",1)");   //makes bars transform up & down (not left & right)
		//upper_bars.attr("transform", "translate(0," + barsTranslate + ")scale(" + zoomScale + ",1)");		
		
			
		
		/* if (currentDomain().length > 20) {	
			barChart.select(".y.axis")
				.attr("transform", "translate(" + margin.left + "," + barsTranslate + ")scale(" + zoomScale + ",1)")   //makes y-axis labels transform up & down (not left & right)
				.call(yAxis.scale(yScale.rangeRoundBands([0, allBarsHeight * zoomScale], 0, 0)));
			barChartXAxis.select(".x.axis").call(xAxis); 
		} */
		
		prevBarsTranslate = barsTranslate;		
		//console.log("****** END adjustScroll, prevBarsTranslate = ", prevBarsTranslate);


	}

	var scroll = d3.behavior.zoom()
		.scaleExtent([1, 1])	
		.on("zoom", scrollBars);

	
	
	//Update axes
	barChartXAxis.selectAll(".x.axis")
		.transition()
		.duration(1000)
		.call(xAxis);	
	barChartXAxis.selectAll(".x2.axis")
		.transition()
		.duration(1000)
		.call(xAxis_upper);	
		
	barChart.selectAll(".y.axis")
		.transition()
		.duration(1000)
		.attr('transform', function(d) {
			if (currentDomain().length<=20) {
				return "translate(" + margin.left + ",0)scale(1,1)";
			} else {
				return  "translate(" + margin.left + "," + barsTranslate + ")scale(1,1)";  
			};
		})  
		.call(currentYAxis); 	
			
	
	
	//Update x-axis title 
	barChartXAxis.selectAll("text.label").remove();  
	barChartXAxis.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "middle")
		.attr("x", margin.left+(width/2))
		.attr("y", function(d) {
			return xAxisHeight - 10;})
		.text(xTitle); 
		
	//Re-draw black line of y-axis 
	barChart.selectAll(".y.axis")
		.selectAll("line").remove();
	barChart.selectAll(".y.axis")
		.append("line") 
        .attr("x1", 0) 
        .attr("y1", 0)
        .attr("x2", 0) 
        .attr("y2", allBarsHeight)
		.attr("stroke-width", 2);
         
		 
		 
	//Draw vertical campaign target lines & legend on graph 
	function addTargets() {
		if ((currentStatCat == 'wast') && (currentStatType == 'prev')) {
			$('.barlegend').html('');	

			barChart				//World Health Assembly target of <5%
				.append("line") 
				.attr("class","targets")
				.attr("x1", margin.left + xScale(5))  //5% aim 
				.attr("y1", margin.top)    			
				.attr("x2", margin.left + xScale(5))  
				.attr("y2", height + margin.top)			
				.attr('stroke', '#161e2c')  //dark grey
				.attr('stroke-dasharray', '5, 5')
				.attr("stroke-width", 1);
				
			barChart				//Generation Nutrition target of <4%
				.append("line") 
				.attr("class","targets")
				.attr("x1", margin.left + xScale(4))  //4% aim for wasting prev
				.attr("y1", margin.top)    		
				.attr("x2", margin.left + xScale(4))  
				.attr("y2", height + margin.top)			
				.attr('stroke', '#161e2c')  //dark grey
				.attr('stroke-dasharray', '15, 5')
				.attr("stroke-width", 1);
				
			
			var w = $('#barlegend').width();
			var h = $('#barlegend').height();
			var barChartLeg = d3.select('#barlegend').append('svg')
				.attr('width', w)
				.attr('height', h);	
				
			barChartLeg
				.append("line") 
				.attr("class","targets")
				.attr("x1", 16) 
				.attr("y1", 5)    			
				.attr("x2", 48)  
				.attr("y2", 5)			
				.attr('stroke', '#161e2c')  //dark grey
				.attr('stroke-dasharray', '15, 5')
				.attr("stroke-width", 1);
			
			barChartLeg 
				.append("text")
				.attr("class","targets")
				.attr("x", 52)
				.attr("y", 8)
				.text("<4%: Generation Nutrition global target by 2030"); 	
				
			barChartLeg
				.append("line") 
				.attr("class","targets")
				.attr("x1", 16) 
				.attr("y1", 18)    			
				.attr("x2", 48)  
				.attr("y2", 18)			
				.attr('stroke', '#161e2c')  //dark grey
				.attr('stroke-dasharray', '5, 5')
				.attr("stroke-width", 1);
			
			barChartLeg 
				.append("text")
				.attr("class","targets")
				.attr("x", 52)
				.attr("y", 22)
				.text("<5%: World Health Assembly global target by 2025"); 
		
		} else if ((currentStatCat == 'stunt') && (currentStatType == 'burd')) {			
			stunt_burd_arr = getRegionalData("XX0");   //get global data
			console.log(stunt_burd_arr);
			stunt_burd = "Not available";
			for (i=0; i <= stunt_burd_arr.length-1; i++) {
				if (stunt_burd_arr[i].Survey_yr == currentYr) {
					console.log(stunt_burd_arr[i].Survey_yr, currentYr);
					stunt_burd = (d3.format(",.0f"))(stunt_burd_arr[i].Stunting_burd*1000000);
					break;
				};
			};			

			$('.barlegend').html('<p>World Health Assembly global target (by 2025): <b><102,000,000</b><br/>Global stunding burden for ' + currentYr + ': <b>' + stunt_burd + '</b></p>');	
		
		} else {
			barChart.selectAll(".targets").remove();
			$('.barlegend').html('');	
		};
			
	};
			

	addTargets();
	//adjustScroll();
	barChart.call(scroll);
	barChart.call(tip); 

	return [barChart, barChartXAxis];
	
};



/***********************************/
/****  UPDATE DATA & DASHBOARD  ****/
/***********************************/	

function updateAll(){			//gets data for current year, calls functions to update linegraph yearline, bar chart, map
	data = getCurrentData();
	currentRegionTitle = getRegName(currentRegion);
	
	console.log("**** Update for ", currentYr);
	//console.log("   Data for ", currentYr, ", ", currentRegionTitle, ", ", currentStatCat, currentStatType, " = ", data);   
				
	totalEntries = data.length;
	
	switch(currentStatType) {
		case 'prev': 	suffix = '(%)'; break;
		case 'burd': suffix = '(total numbers)'; break;
		default:	suffix = ''; 
	};
	$('#linegraph_title').html(getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ' <small>' + suffix + '</small>');
	lineGraph = updateYearLineGraph('#linegraph');
	
	barCharts = updateBarChart('#barchart', '#barchartxaxis', data);
	barChart = barCharts[0];
	barChartXAxis = barCharts[1];
	$('#barchart_title').html(getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ', ' + currentYr);
	$('#barchart_subtitle').html(currentRegionTitle + ' (' + totalEntries + ')');
	
	//console.log("In updateAll, map object before update: ", map);
	map = updateMap('#map',data);
	//console.log("In updateAll, map object after update: ", map);
	$('#map_title').html(getStatName(currentStatCat) + ' ' + getStatName(currentStatType) + ', ' + currentYr);
	$('#map_subtitle').html(currentRegionTitle + ' (' + totalEntries + ')');
	
	
}


function getCurrentData() {		//returns data for current year, region, statistic; ordered by descending statistic

	cf.yearDim.filter(currentYr);	//filter year
	
	if (currentRegion=="Glob") {		//filter region
		cf.regDim.filterAll();
	}
	else {
		cf.regDim.filter(getRegAbbrev(currentRegion));
	};
	
	switch (currentStatType) {			//filter statistic
		case 'prev':
			switch (currentStatCat) {     
				case 'wast':	filtered = cf.wastingDim.filter(function(d) {return d >= 0}).top(Infinity); 
								cf.wastingDim.filterAll();   		//remove filter so subsequent operations have a clean start
								break;
				case 'sevwast':	filtered = cf.sevWastingDim.filter(function(d) {return d >= 0}).top(Infinity);
								cf.sevWastingDim.filterAll();
								break;
				case 'stunt':	filtered = cf.stuntingDim.filter(function(d) {return d >= 0}).top(Infinity);
								cf.stuntingDim.filterAll();
								break;
				default:	filtered = cf.wastingDim.filter(function(d) {return d >= 0}).top(Infinity);	
							cf.wastingDim.filterAll();
							console.log("Error in getting year stats");
			};
			break;
		case 'burd':
			switch (currentStatCat) {      
				case 'wast':	filtered = cf.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);		
								cf.wastingBurdDim.filterAll();
								break;
				case 'sevwast':	filtered = cf.sevWastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);
								cf.sevWastingBurdDim.filterAll();
								break;
				case 'stunt':	filtered = cf.stuntingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);
								cf.stuntingBurdDim.filterAll();
								break;
				default:	filtered = cf.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
							cf.wastingBurdDim.filterAll();
							console.log("Error in getting year stats");
			};
			break;
		default: 	filtered = cf.wastingBurdDim.filter(function(d) {return d >= 0}).top(Infinity);	
					cf.wastingBurdDim.filterAll();
					console.log("Error in getting year stats")
	};
	//console.log("getCurrentData = ", yr, filtered);  	
	return filtered;
}



/**********************************/
/****  STATISTIC TYPE UPDATES  ****/
/**********************************/	

function getStatName(st) {
	switch(st) {
		case 'wast': 	st_name = 'Wasting'; break;
		case 'sevwast': st_name = 'Severe Wasting'; break;
		case 'stunt':	st_name = 'Stunting'; break;
		case 'prev': 	st_name = 'Prevalence'; break;
		case 'burd': 	st_name = 'Burden'; break;
		default:		st_name = 'No statistic';       
	};
	return st_name;
};

function btn_currentStatCat(new_currentStatCat) {
	if ((new_currentStatCat=="wast") && !($('#btnWast').hasClass('on'))) {
	 	//console.log("Clicked WASTING button");
		$('#btnWast').addClass('on');
		$('#btnSevWast').removeClass('on');
		$('#btnStunt').removeClass('on');
		currentStatCat = 'wast';
		updateLegend();
		updateAll();  //don't move outside if statement or updates even if clicked on same button twice
		transitionCurrentCountryLines('#linegraph', '');  //'' is for iso_code for temp hovered country - none here
	}
	else if  ((new_currentStatCat=="sevwast") && !($('#btnSevWast').hasClass('on'))) {
		//console.log("Clicked SEVERE WASTING button");
		$('#btnWast').removeClass('on');
		$('#btnSevWast').addClass('on');
		$('#btnStunt').removeClass('on');
		currentStatCat = 'sevwast';
		updateLegend();
		updateAll(); 
		transitionCurrentCountryLines('#linegraph', '');  
	}
	else if  ((new_currentStatCat=="stunt") && !($('#btnStunt').hasClass('on'))) {
		//console.log("Clicked STUNTING button");
		$('#btnWast').removeClass('on');
		$('#btnSevWast').removeClass('on');
		$('#btnStunt').addClass('on');
		currentStatCat = 'stunt';
		updateLegend();
		updateAll(); 
		transitionCurrentCountryLines('#linegraph', '');  
	};
};


function btn_currentStatType(new_currentStatType) {
	if ((new_currentStatType=="prev") && !($('#btnPrev').hasClass('on'))) {
	 	//console.log("Clicked PREVALENCE button");
		$('#btnPrev').addClass('on');
		$('#btnBurd').removeClass('on');
		currentStatType = 'prev';
		updateLegend();
		updateAll();
		transitionCurrentCountryLines('#linegraph', '');  
	}
	else if  ((new_currentStatType=="burd") && !($('#btnBurd').hasClass('on'))) {
		//console.log("Clicked BURDEN button");
		$('#btnPrev').removeClass('on');
		$('#btnBurd').addClass('on');
		currentStatType = 'burd';
		updateLegend()
		updateAll(); 
		transitionCurrentCountryLines('#linegraph', '');  
	}
};





/***************************/
/*****  REGION UPDATE  *****/  
/***************************/

function btn_reg_zoom(region) {
	currentRegion = region;
	if ((region=="Glob") && !($('#btnGlob').hasClass('reg_on'))) {
	 	//console.log("Clicked Global button");
		removeRegBtnClasses();
		$('#btnGlob').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();		//don't move outside if statement or updates even if clicked on same button twice
	}	
	else if  ((region=="WCA") && !($('#btnWCA').hasClass('reg_on'))) {
		//console.log("Clicked WCA button");
		removeRegBtnClasses();
		$('#btnWCA').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();
	} 
	else if  ((region=="ESA") && !($('#btnESA').hasClass('reg_on'))) {
		//console.log("Clicked ESA button");
		removeRegBtnClasses();
		$('#btnESA').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();
	} 
	else if ((region=="MENA") && !($('#btnMENA').hasClass('reg_on'))) {
	 	//console.log("Clicked MENA button");
		removeRegBtnClasses();
		$('#btnMENA').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();		
	}
	else if  ((region=="SA") && !($('#btnSA').hasClass('reg_on'))) {
		//console.log("Clicked SA button");
		removeRegBtnClasses();
		$('#btnSA').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();
	} 
	else if  ((region=="EAP") && !($('#btnEAP').hasClass('reg_on'))) {
		//console.log("Clicked EAP button");
		removeRegBtnClasses();
		$('#btnEAP').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();
	} 
	else if  ((region=="TAC") && !($('#btnTAC').hasClass('reg_on'))) {
		//console.log("Clicked TAC button");
		removeRegBtnClasses();
		$('#btnTAC').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();
	} 
	else if  ((region=="CEECIS") && !($('#btnCEECIS').hasClass('reg_on'))) {
		//console.log("Clicked CEECIS button");
		removeRegBtnClasses();
		$('#btnCEECIS').addClass('reg_on');
		addCountryLine('#linegraph', getRegISO(region), 'perm');
		updateAll();
	} 
	else if  ((region=="Ind") && !($('#btnInd').hasClass('reg_on'))) {
		//console.log("Clicked Industrialized button");
		removeRegBtnClasses();
		$('#btnInd').addClass('reg_on');
		updateAll();
	}
};

function removeRegBtnClasses() {
	$('#btnGlob').removeClass('reg_on');
	$('#btnWCA').removeClass('reg_on');
	$('#btnESA').removeClass('reg_on');
	$('#btnMENA').removeClass('reg_on');
	$('#btnSA').removeClass('reg_on');
	$('#btnEAP').removeClass('reg_on');
	$('#btnTAC').removeClass('reg_on');
	$('#btnCEECIS').removeClass('reg_on');
	$('#btnInd').removeClass('reg_on');
};


function getRegAbbrev(reg) {
	switch (reg) {
		case 'Glob':	reg_name = 'Global'; break;
		case 'WCA':		reg_name = 'WCARO'; break;
		case 'ESA':		reg_name = 'ESARO'; break;
		case 'MENA':	reg_name = 'MENA'; break;
		case 'SA':		reg_name = 'ROSA'; break;
		case 'EAP':		reg_name = 'EAPRO'; break;
		case 'TAC':		reg_name = 'TACRO'; break;
		case 'CEECIS':	reg_name = 'CEECIS'; break;
		case 'Ind': 	reg_name = 'Industrialized'; break;
		default:		reg_name = 'Global'; console.log("Error with getting region name");
	}
	
	return reg_name;
};


function getRegName(reg) {
	switch (reg) {
		case 'Glob':	reg_name = 'Global'; break;
		case 'WCA':		reg_name = 'West and Central Africa'; break;
		case 'ESA':		reg_name = 'Eastern and Southern Africa'; break;
		case 'MENA':	reg_name = 'Middle East and North Africa'; break;
		case 'SA':		reg_name = 'South Asia'; break;
		case 'EAP':		reg_name = 'East Asia and Pacific'; break;
		case 'TAC':		reg_name = 'Latin America and the Caribbean'; break;
		case 'CEECIS':	reg_name = 'Central and Eastern Europe and the Commonwealth of Independent States'; break;
		case 'Ind': 	reg_name = 'Industrialized Countries'; break;
		default:		reg_name = 'Global'; console.log("Error with getting region name");
	}	
	return reg_name;
};


function getRegISO(reg) {
	switch (reg) {
		case 'Glob':	reg_iso = 'XX0'; break;
		case 'WCA':		reg_iso = 'XX2'; break;
		case 'ESA':		reg_iso = 'XX1'; break;
		case 'MENA':	reg_iso = 'XX3'; break;
		case 'SA':		reg_iso = 'XX4'; break;
		case 'EAP':		reg_iso = 'XX5'; break;
		case 'TAC':		reg_iso = 'XX6'; break;
		case 'CEECIS':	reg_iso = 'XX7'; break;
		default:		reg_iso = 'XX0'; console.log("Error with getting region code");
	}	
	return reg_iso;
};

	
	
/***********************/
/****  TIME SLIDER  ****/
/***********************/

//COMBINED EXAMPLES OF:	http://jsfiddle.net/coma/V32MD/1/   and   http://jsfiddle.net/amcharts/ZPqhP/
var arr = [];									//set array of years
	for (var i=1983;i<=2015;i++) {				//change to min and max years
	  arr.push(i);
	};
var total = arr.length;	
	
var currentSlide = total+1;
var playInterval;
var slideDuration = 1500; // in milliseconds
var autoRewind = false;
var yr = 0;

$(function() {
    $( "#slider-range-max" ).slider({				//create slider
        range: "min",
        min: 1,
        max: total,
		value: total,
        slide: function( event, ui ) {				//call ui event with 
			yr = arr[ui.value-1];   				//get year value
			currentYr = yr;
			$(".ui-slider-handle" ).text(yr); 		//set year text on slider
			setSlide(ui.value);
			console.log("Slider year: ", yr);
			updateAll();
        }
    });
	
	$("#btnPlay").on("click", function() {	     //when you push play button
		if (playInterval != undefined) {		 //playInterval is defined when button is playing - so here we are stopping it from playing
            clearInterval(playInterval);
            playInterval = undefined;
			//$("#btnPlay").html("Play");
            $("#btnPlay").removeClass('pause');  //change button to 'play' because we are now paused
			//console.log("WE ARE NOW PAUSED - button should be to 'play' - 1");
            return;
        }
		//$("#btnPlay").html("Pause");
		$("#btnPlay").addClass('pause');   //change button to 'pause' because we are now playing
		yr = currentSlide + 1983 - 1;
		currentYr = yr;
		//console.log("Now on slider button: ", yr, "    currentSlide: ", currentSlide);
		if (yr == 2016) {
			currentSlide = 0;
		}
		//console.log("WE ARE NOW PLAYING - button should be to 'pause'");
		playInterval = setInterval(function () {
            currentSlide++;
            if (currentSlide > arr.length) {	//if we reach the final year
                if (autoRewind) {				//if we loop (autoRewind) then go back to beginning
                    currentSlide = 0;
                }
                else {							//if we don't loop (autoRewind) then stop and clear 
                    clearInterval(playInterval);
					playInterval = undefined;
					$("#btnPlay").removeClass('pause');   //change button to 'play' because we are now paused
					//console.log("WE ARE NOW PAUSED - button should be to 'play' - 2");
                    return;
                }
            }
            setSlide(currentSlide);
			yr = currentSlide + 1983 - 1;
			currentYr = yr;
			//console.log("Current slide: ", currentSlide, yr);
			$(".ui-slider-handle" ).text(yr); 
			updateAll();	
        }, slideDuration);
    });
	
	$("#slider-range-max").on("change", function(){		// each time slider value changes
		//update();
		console.log("THIS IS A SLIDER .ON CHANGE");
		$("#range").html($("#slider").val());	// change the value displayed
		$(".ui-slider-handle" ).text( arr[$( "#slider-range-max" ).slider( "value" )-1] );    //what does this do??? - seems redundant
		$(".ui-slider" ).append("<span class='bl_line' style='width:"+ $( ".ui-slider" ).width() + "px'></span>");  //adds in black line
		clearInterval(playInterval);   //playInterval = rename it to timer?
		$("#btnPlay").html("Play"); 
	});
	
	$(".ui-slider-handle" ).text( arr[$( "#slider-range-max" ).slider( "value" )-1] );    //what does this do??? - seems redundant
    $(".ui-slider" ).append("<span class='bl_line'style=' width:"+ $( ".ui-slider" ).width() + "px'></span>");  //adds in black line
	var foo = total - 1;
    var mar = $( ".ui-slider" ).width() / (foo);    
    for (var x = 0; x < foo+1; x++){        						//this bit adds in markers at each timestep
        $(".ui-slider" ).append("<span class='dots' style='left:"+ x * mar + "px'></span>");
    }  
	
	
/* 	update = function() {
		//yr = $("#slider-range-max").value();  
		//yr = $(".ui-slider-handle" ).text( arr[$( "#slider-range-max" )] );
		console.log("UPDATED YEAR TO: ", yr);
		updateAll()
	}; */  	
	
});

function setSlide (index) {
    currentSlide = index;
    $( "#slider-range-max" ).slider( "value", index );
}
	
	

/*************************/
/****  INTRO.JS TOUR  ****/
/*************************/


 $('#btnIntro').click(function(){
    var intro = introJs();
    intro.setOptions({
		steps: [
		  {
			  intro:"<div style='width: 500px; font: 14px sans-serif;'><h4><b>Global Child Malnutrition, map and dashboard</b></h4><p>This map and dashboard displays various child malnutrition estimates jointly published by UNICEF, the WHO, and the World Bank Group. It was created as a resource for the <a href='http://www.generation-nutrition.org/en'  target='_blank'>Generation Nutrition</a> campaign.</p><p>This tour will take you through the main features of the site...</p></div>",
		  } ,
		  {
			  element: '#statbuttons',
			  intro:"<div style='width: 400px; font: 14px sans-serif;'><h4><b>Select malnutrition statistic for display</b></h4><p>Use these buttons to toggle between different types of malnutrition estimates.</p><p>The three statistics available here are <i>Wasting, Severe Wasting,</i> and <i>Stunting.</i> Each of these can be presented as either <i>Prevalence</i> (i.e. percentage) or <i>Burden</i> (i.e. total numbers).</p><p>Definitions for each of these can be seen when hovering over the respective button.</p></div>",
			  position: 'right'
		  },
		  {
			  element: '#regionbuttons',
			  intro:"<div style='width: 500px; font: 14px sans-serif;'><h4><b>Select region for display</b></h4><p>Use these buttons to toggle between different regions as defined by UNICEF. Selecting a region does the following:</p><ol><li style='margin-bottom: 5px;'>Zooms to that region on the map and only shows data for the countries in that region</li><li style='margin-bottom: 5px;'>Filters all data in the barchart to display only countries in that region</li><li style='margin-bottom: 5px;'>Note that it does <i>not</i> remove or filter countries' time series from the line graph</li></ol><p>The UNICEF regions are as follows:</p><ul><i><li style='margin-bottom: 5px;'>West and Central Africa (WCA)</li><li style='margin-bottom: 5px;'>Eastern and Southern Africa (ESA)</li><li style='margin-bottom: 5px;'>Middle East and North Africa (MENA)</li><li style='margin-bottom: 5px;'>South Asia (SA)</li><li style='margin-bottom: 5px;'>East Asia and Pacific (EAP)</li><li style='margin-bottom: 5px;'>Latin America and the Caribbean (TAC)</li><li style='margin-bottom: 5px;'>Central and Eastern Europe and the Commonwealth of Independent States (CEECIS)</li><li>Industrialized Countries</li></i></ul><p>Full region names can be seen when hovering over the respective button.</p></div>",
			  position: 'bottom'   /* may be able to make this left once sorted sticky div */
		  },
		  {
			  element: '#timeline',
			  intro:"<div style='width: 400px; font: 14px sans-serif;'><h4><b>The Timeline <i><font size=3.0em>(1983-2015)</font></i></b></h4><p>Navigate through time using this timeline in one of three ways:</p><ul><li style='margin-bottom: 5px;'>Use the 'play'/'pause' button to autoplay and watch.</li><li style='margin-bottom: 5px;'>Click on the big circle representing the current year and drag it to the desired year.</li><li>Click on any of the small circles to jump to that year.</li></ul><p>Changing year does the following:</p><ol><li style='margin-bottom: 5px;'>Updates countries in the map for that year</li><li style='margin-bottom: 5px;'>Shifts the grey vertical line in the linegraph to that year</li><li>Re-orders countries in the barchart for that year</li></ol></div>",
			  position: 'right'
		  },
		  {
			  element: '#map-container',
			  intro: "<div style='width: 350px; font: 14px sans-serif;'><h4><b>The Map</b></h4><p>The map displays values for the malnutrition statistic selected and the current year. These are indicated in the map title just above the map.</p><p><i>Hovering</i> over a country does the following:</p><ol><li style='margin-bottom: 5px;'>The value of the selected statistic is displayed in the info box in the top right corner of the map. The year of the previous survey is also given.</li><li style='margin-bottom: 5px;'>The country's time series is highlighted in yellow in the line graph.</li><li>If the country is currently visible in the barchart, its bar is highlighted in yellow.</li></ol><p><i>Clicking</i> on a country adds that country's time series on the linegraph.</p><p><i>Double-clicking</i> on a country removes that country's time series from the linegraph (if it is displayed).</p></div>",
			  position: 'left'
		  },
		  {
			  element: '#linegraph_all',
			  intro:"<div style='width: 400px; font: 14px sans-serif;'><h4><b>The Linegraph</b></h4><p>This linegraph allows individual country's time series to be compared.</p><p>To <i>add</i> a country's time series to the linegraph do one of the following:</p><ol><li style='margin-bottom: 5px;'><i>Click</i> on the country in the map</li><li><i>Click</i> on the country in the barchart</li></ol><p>To <i>remove</i> a country's time series from the linegraph do one of the following:</p><ol><li style='margin-bottom: 5px;'><i>Double-click</i> on the line itself in the linegraph</li><li style='margin-bottom: 5px;'><i>Double-click</i> on the country in the map</li><li><i>Double-click</i> on the country in the barchart</li></ol><p>To remove <i>all</i> country time series, <i>click</i> on the <i>'Clear All'</i> button.</p><p>The grey vertical line depicts the year that is currently displayed on the map and in the barchart.</p><p>Solid points on a time series indicate survey years.</p></div>",
			  position: 'right'
		  },
		  {
			  element: '#barchart_all',
			  intro:"<div style='width: 400px; font: 14px sans-serif;'><h4><b>The Barchart</b></h4><p>This barchart orders countries from highest to lowest for the malnutrition statistic selected for the current year. These are indicated in the title at the top of the barchart.</p><p>Below the title, the selected region (e.g. <i>'Global', 'South Asia'</i>) and the number of countries that data is available for, are displayed.</p><p>If relevant, a legend may appear to indicate World Health Assembly and/or Generation Nutrition targets.</p><p><i>Hovering</i> over a bar does the following:</p><ol><li style='margin-bottom: 5px;'>The bar is highlighted in yellow.</li><li style='margin-bottom: 5px;'>A tooltip appears showing the selected statistic for that country for that year.</li><li style='margin-bottom: 5px;'>The country's time series is highlighted in yellow in the line graph.</li><li>The country is highlighted in yellow in the map.</li></ol><p><i>Clicking</i> on a country adds that country's time series on the linegraph.</p><p><i>Double-clicking</i> a bar removes that country's time series from the linegraph (if it is displayed).</p><p>It is also possible to scroll down through the barchart to view all the countries that data is available for.</p></div>",
			  position: 'right'
		  },
		  {
			  intro:"<div style='width: 500px; font: 14px sans-serif;'><h4><b>Further information:</b></h4><ul><li style='margin-bottom: 5px;'>Statistics pertain to children aged between 0 and 59 months of age. This is the age group for which countries gather statistics on wasting and stunting.</li><li style='margin-bottom: 5px;'>For all countries, linear interpolations of prevalence estimates are assumed for the years between actual survey years.</li><li style='margin-bottom: 5px;'>For all countries, constant prevalence estimates are assumed after the last survey year until the most recent year <i>(i.e. 2015)</i>.</li><li>Annual population statistics from the UN Dept of Economic and Social Affairs were used to convert prevalence estimates to burden estimates. These were available for every country and for every year, <i>except</i> for the islands of Tuvalu and Nauru. In these two cases, a single population estimate, as given by the Joint child Malnutrition Estimates (JME) for the single year of 2007, was kept constant through time.</li></ul></div>",
		  } ,
 		]
	});
    intro.start();
}); 



/************************************************/
/******  WINDOW RESIZE EVENTS & STICKY DIV  *****/
/************************************************/	

function stickydiv(){			//applies/removes 'sticky' class to #map-container depending on width of current screen
	var window_height = $(window).height();
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
	var max_width = 976;		//sticky only operates when screen width is >= this
	
	/* console.log("IN STICKYDIV");
	console.log("WINDOW HEIGHT: ",window_height);
	console.log("WINDOW TOP: ",window_top);
	console.log("DIV TOP: ",div_top);
	console.log("WINDOW WIDTH: ",$(window).width()); */
    if ((window_top > div_top) && ($(window).width() >= max_width)){     
		//console.log("  ADD STICKY HERE");
        $('#map-container').addClass('sticky');
    }
    else{
		//console.log("  REMOVE STICKY HERE");
        $('#map-container').removeClass('sticky');
    }
};

$(window).scroll(function(){	
    stickydiv();
}); 



/* function resizedw(){	//can reload most of page here so it loads properly
    if($(window).width()<=976){compact = true;} else {compact = false;}		//set compact
    if($(window).width()<currentwidth-20 || $(window).width()>currentwidth+20){
        currentwidth = $(window).width();
        $('#map-container').removeClass('sticky');
    }
} */
	
      
/*********************************************/
/****  GLOBAL VARIABLES & INITIALISATION  ****/
/*********************************************/
var compact = false;
var currentwidth=$(window).width();

var minYr = d3.min(data, function(d) { return d.Survey_yr; }) 
var maxYr = d3.max(data, function(d) { return d.Survey_yr; })  
var barHeight = 12;
var currentYr = 2015;
var currentRegion = 'Glob';
var currentStatCat = 'wast';
var currentStatType = 'prev';
var currentCountryLines = [];
var countries_all = {};

var map;
var barsTranslate = 0;
var prevBarsTranslate = 0;
 
$('#map').width($('#map').width());


//load topojson data
var countriesGeomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/countries_all.json', 
    dataType: 'json',
});
$.when(countriesGeomCall).then(function(countriesGeomArgs){
	var countriesGeom = topojson.feature(countriesGeomArgs, countriesGeomArgs.objects.countries_all); 
	countries_all = countriesGeom;

	initData = getCurrentData();   
	map = generateMap('#map', initData);
	$('#map').width($('#map').width());
	updateLegend();
	lineGraph = generateLineGraph('#linegraph');
	lineGraph = addLineGraphIntroText();
	barCharts = generateBarChart('#barchart', '#barchartxaxis'); 
	barChart = barCharts[0];
	barChartXAxis = barCharts[1];
	updateAll();
	//addCountryLine('#linegraph', 'XX0', 'perm');   //add global stat line

	
	/* var currentwidth=$(window).width();
	if ($(window).width()<=976) {compact = true;} else {compact = false;};
	$(window).scroll(function(){
		if(!compact){
			console.log("CALLING STICKYDIV");
			stickydiv();
		}
	}); */ 
	
	//$(window).resize(function(){location.reload();});
	window.onresize = function(){ location.reload(); }
	
	/* var doit;
	window.onresize = function(){
	  clearTimeout(doit);
	  doit = setTimeout(resizedw, 100);
	};  */
	
});

/* if(compact){    
}; */
