function WorldMap() {
    
    //fields and default values
    var width = 960;
    var height = 800;
    var scale = 135; //scale for map size
    var shape;
    var color = d3.scale.linear().range(['#F2DA91', '#BF4904']); //set domain later
    var unit;
    var ratio;
    var legText;
    
    //constructs a new map with circles on it
    //the 'draw' function
    function chart(selection) {
        
        //for each element selected DOM element, draw a chart
        selection.each(function(data) {
            console.log(data);
            
            //heat --> change temp to generic value
            var cMin = d3.min(data, function(d) {return d[ratio]});
            var cMax = d3.max(data, function(d) {return d[ratio]});
            color.domain([cMin, cMax]);
            
            //uses an Albers projection for the USA
            var projection = d3.geo.naturalEarth()
                .scale(scale)
                .translate([width / 2, height / 2])
                .precision(.1);
            
            //path of map    
            var path = d3.geo.path()
                .projection(projection);
                
            //select svg element if it exists
            var svg = d3.select(this).selectAll('svg').data([data]);
            
            //otherwise create skeletal chart
            var gEnter = svg.enter().append('svg').append('g');
            
            //update 'outer' dimensions
            svg.attr('width', width).attr('height', height);
            
            var otherG = svg.select('g').attr('title', 'weed');
            
            //update 'inner' dimensions
            gEnter.attr('width', width).attr('height', height).attr('title', 'gEnter');
            
            var countries = gEnter.selectAll('.subunits')
                                .data(topojson.feature(shape, shape.objects.subunits).features);
                                
            countries.enter().append('path')
                        .attr('class', function(d) {return 'subunits ' + d.id})
                        .attr('d', path)
                        .attr('fill', '#ddc');
                        
            countries.exit().remove();
            
            countries.transition().duration(5000)
                        .attr('fill', function(d) {
                            var guy = undefined;
                            data.forEach(function(a) {
                                if (a[unit] == d.id) {
                                    guy = color(+a[ratio]);
                                }
                            });
                            if (guy != undefined) {
                                return guy;
                            }
                            return '#ddc';
                        });
            
            //country borders            
            gEnter.append("path")
                .datum(topojson.mesh(shape, shape.objects.subunits, function(a, b) {return a !== b }))
                .attr("d", path)
                .attr("class", "subunit-boundary"); 
                
            /*-------------legend------------- */
                
            var lWidth = width * 0.3;
            var lHeight = 10;
            
            var xScale = d3.scale.linear()
                            .range([0, lWidth])
                            .domain([cMin, cMax]);
            
            var lJar = svg.append('g')
                        .attr('transform', 'translate(' + (width / 2) + ', ' + (height - 50) + ')')
                        .attr('class', 'legend-wrapper');
                
            //gradient legend
            lJar.append('rect')
                            .attr('width', lWidth)
                            .attr('height', lHeight)
                            .attr('x', -lWidth / 2)
                            .attr('y', 10)
                            .style('fill', 'url(#linear-gradient)');
                            
            //legend title
            lJar.append('text')
                        .attr('class', 'legend-title')
                        .attr('x', 0)
                        .attr('y', -2)
                        .text(legText);
                            
            var gradientAxis = d3.svg.axis()
                                .orient('bottom')
                                .scale(xScale);
                                
            lJar.append('g')
                    .attr('class', 'axiss')
                    .attr('transform', 'translate(' + (-lWidth/2) + ', ' + (lHeight + 10) + ')')
                    .call(gradientAxis);
                            
            //definition for gradient                
            var defs = svg.append('defs');
            
            //gradient
            var linearGradient = defs.append('linearGradient')
                    .attr('id', 'linear-gradient');
                    
            //horizontal gradient
            linearGradient
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%');
                
            //start color
            linearGradient.selectAll('stop')
                .data(color.range())
                .enter().append('stop')
                .attr('offset', function(d,i) {return i / (color.range().length - 1)})
                .attr('stop-color', function(d) {return d});
        });
    };
    
    /*--------change parameters of the chart----------*/
    
    //sets width of chart to 'value'
    chart.width = function(value) {
        if(!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };
    
    //sets height of chart to 'value'
    chart.height = function(value) {
        if(!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };
    
    //sets the json to make the map
    chart.map = function(obj) {
        if(!arguments.length) {
            return shape;
        }
        shape = obj;
        return chart;
    };
    
    //sets what data to use to differentiate countries
    chart.unit = function(val) {
        if(!arguments.length) {
            return unit;
        }
        unit = val;
        return chart;
    };
    
    //set what data to use for values on each country
    chart.ratio = function(val) {
        if(!arguments.length) {
            return ratio;
        }
        ratio = val;
        return chart;
    };
    
    chart.legText = function(val) {
        if(!arguments.length) {
            return legText;
        }
        legText = val;
        return chart;
    };
    
    return chart;
};